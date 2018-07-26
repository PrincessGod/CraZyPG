import { FileLoader } from './Fileloader';
import { Matrix4 } from '../math/Matrix4';
import { IndicesKey, BeginMode, TextureWrapMode, ShaderParams, TextureFilter } from '../core/constant';
import { getTypedArrayTypeFromGLType } from '../core/typedArray';
import { deleteUndefined } from '../core/utils';
import { Primitive } from '../model/Primitive';
import { PhysicalModelMaterial } from '../shader/PhysicalModelMaterial';
import { Model } from '../model/Model';
import { Node } from '../object/Node';
import { Texture2D } from '../texture/Texture2D';

function GLTFLoader() {
}

Object.assign( GLTFLoader.prototype, {

    load( file, opts = {} ) {

        const name = 'GLTFLOADER';
        const loader = new FileLoader( { file, name } );
        const {
            dither, envTexture, envMode, refractionRation, envTextureIntensity,
        } = opts;
        this.dither = !! dither;
        this.envTexture = envTexture;
        this.envMode = envMode;
        this.refractionRation = refractionRation;
        this.envTextureIntensity = envTextureIntensity;

        return loader.load()
            .then( res => this.parse( res[ name ] ) );

    },

    parse( json ) {

        this.gltf = json;

        const { version } = this.gltf.asset;
        if ( version !== '2.0' ) {

            console.error( `GlTFLoader only support glTF 2.0 for now! Received glTF version: ${this.version}` );
            return false;

        }

        this.result = {
            nodes: this.parseNodes(),
            meshes: this.parseMeshes(),
        };

        return this.parseScene();

    },

    parseNodes() {

        return this.gltf.nodes ? this.gltf.nodes.map( node => this.parseNode( node ) ) : [];

    },

    parseMeshes() {

        return this.gltf.meshes ? this.gltf.meshes.map( mesh => this.parseMesh( mesh ) ) : [];

    },

    parseScene( sceneId ) {

        const loadScene = sceneId || this.gltf.scene || 0;
        const scene = this.gltf.scenes[ loadScene ];
        const root = new Node( scene.name || `GLTF_SCENE${loadScene}` );

        const combineNode = ( parent, nodeId ) => {

            const {
                name, translation, rotation, scale,
            } = this.result.nodes[ nodeId ];
            const { children, mesh } = this.gltf.nodes[ nodeId ];

            let node = new Node( name );
            if ( mesh !== undefined ) {

                const models = [];
                const primitives = this.result.meshes[ mesh ];
                primitives.forEach( ( { primitive, material } ) => {

                    const model = new Model( primitive, material );
                    models.push( model );

                } );

                if ( models.length === 1 )
                    node = models[ 0 ];
                else
                    models.forEach( model => node.addChild( model ) );

            }

            if ( translation )
                node.position = translation;
            if ( rotation )
                node.quaternion = rotation;
            if ( scale )
                node.scale = scale;

            if ( children )
                children.forEach( childrenId => combineNode( node, childrenId ) );

            parent.addChild( node );

        };

        for ( let i = 0; i < scene.nodes.length; i ++ )
            combineNode( root, scene.nodes[ i ] );

        return root;

    },

    parseNode( node ) {

        const {
            name, matrix, translation, rotation, scale,
        } = node;

        const result = {
            name,
            translation,
            rotation,
            scale,
        };

        if ( matrix ) {

            const t = [ 0, 0, 0 ];
            const r = [ 0, 0, 0, 1 ];
            const s = [ 1, 1, 1 ];
            Matrix4.decompose( matrix, t, r, s );

            result.translation = t;
            result.rotation = r;
            result.scale = s;

        }

        return deleteUndefined( result );

    },

    parseMesh( mesh ) {

        const { primitives } = mesh;
        const meshName = mesh.name;
        const dprimitives = [];
        for ( let i = 0; i < primitives.length; i ++ ) {

            const primitive = primitives[ i ];
            const {
                attributes, indices, material, mode, name, targets,
            } = primitive;
            const dprimitive = {
                name: name || meshName || GLTFLoader.getMeshNameCounter(),
                attribArrays: {},
            };

            Object.keys( attributes ).forEach( ( attribute ) => {

                const accessor = this.parseAccessor( attributes[ attribute ] );
                const attributeName = GLTFLoader.attributesKey[ attribute ] || attribute;
                if ( accessor )
                    dprimitive.attribArrays[ attributeName ] = accessor;

            } );

            if ( indices !== undefined ) {

                const accessor = this.parseAccessor( indices );
                if ( accessor )
                    dprimitive.attribArrays[ IndicesKey ] = accessor;

            }

            const dmaterial = this.parseMaterial( material );
            dprimitive.material = Object.assign( {}, dmaterial, {
                drawMode: mode === undefined ? BeginMode.TRIANGLES : mode,
            } );

            dprimitive.primitive = new Primitive( dprimitive.attribArrays, { name: dprimitive.name } );
            dprimitive.material = new PhysicalModelMaterial( dprimitive.material );
            dprimitives.push( dprimitive );

        }

        return dprimitives;

    },

    parseAccessor( accessorId ) {

        const accessor = this.gltf.accessors[ accessorId ];

        if ( accessor.isParsed )
            return accessor.daccessor;

        accessor.isParsed = true;
        accessor.daccessor = false;

        const normalize = !! accessor.normalized;
        const bufferView = this.gltf.bufferViews[ accessor.bufferView ];
        const byteStride = bufferView && bufferView.byteStride;
        const arrayType = getTypedArrayTypeFromGLType( accessor.componentType );
        let numComponents = 1;
        switch ( accessor.type ) {

        case 'SCALAR':
            numComponents = 1;
            break;
        case 'VEC2':
            numComponents = 2;
            break;
        case 'VEC3':
            numComponents = 3;
            break;
        case 'VEC4':
        case 'MAT2':
            numComponents = 4;
            break;
        case 'MAT3':
            numComponents = 9;
            break;
        case 'MAT4':
            numComponents = 16;
            break;
        default:
            numComponents = 0;
            break;

        }
        if ( numComponents === 0 ) {

            console.error( `glTF has unknown data type in accessor: ${accessor.type}` );
            return false;

        }
        const componentsBytes = numComponents * arrayType.BYTES_PER_ELEMENT;

        let buffer;
        if ( bufferView !== undefined ) {

            buffer = this.parseBufferView( accessor.bufferView );
            if ( ! buffer )
                return accessor.daccessor;

        } else
            buffer = ( new Uint8Array( componentsBytes * accessor.count ) ).buffer;

        let typedArray = this.getTypedArrayFromArrayBuffer( buffer, byteStride, accessor.byteOffset || 0, arrayType, numComponents, accessor.count );

        if ( accessor.sparse ) {

            const { count, indices, values } = accessor.sparse;
            typedArray = new arrayType( typedArray ); // eslint-disable-line

            const indicesByteOffset = indices.byteOffset || 0;
            const indicesBufferView = this.gltf.bufferViews[ indices.bufferView ];
            const indicesArrayType = getTypedArrayTypeFromGLType( indices.componentType );
            const indicesBuffer = this.parseBufferView( indices.bufferView );
            const indicesArray = this.getTypedArrayFromArrayBuffer( indicesBuffer, indicesBufferView.byteStride, indicesByteOffset, indicesArrayType, 1, count );

            const valuesByteOffset = values.byteOffset || 0;
            const valuesBufferView = this.gltf.bufferViews[ values.bufferView ];
            const valuesBuffer = this.parseBufferView( values.bufferView );
            const valuesArray = this.getTypedArrayFromArrayBuffer( valuesBuffer, valuesBufferView.byteStride, valuesByteOffset, arrayType, numComponents, count );

            for ( let i = 0; i < indicesArray.length; i ++ )
                typedArray.set( valuesArray.slice( i * numComponents, i * numComponents + numComponents ), indicesArray[ i ] * numComponents );

        }

        accessor.computeResult = {
            typedArray, arrayType, numComponents,
        };
        accessor.daccessor = {
            data: typedArray, numComponents, normalize,
        };

        return accessor.daccessor;

    },

    getTypedArrayFromArrayBuffer( buffer, byteStride, byteOffset, arrayType, numComponents, count ) {

        let typedArray;
        const componentsBytes = numComponents * arrayType.BYTES_PER_ELEMENT;
        if ( byteStride && componentsBytes !== byteStride ) {

            const arrayLength = numComponents * count;
            typedArray = new arrayType( arrayLength ); // eslint-disable-line
            for ( let i = 0; i < count; i ++ ) {

                const componentVals = new arrayType( buffer, byteOffset + i * byteStride, numComponents ); // eslint-disable-line
                for ( let j = 0; j < numComponents; j ++ )
                    typedArray[ i * numComponents + j ] = componentVals[ j ];

            }

        } else
            typedArray = new arrayType( buffer, byteOffset, count * numComponents ); // eslint-disable-line

        return typedArray;

    },

    parseBufferView( bufferViewId ) {

        const bufferView = this.gltf.bufferViews[ bufferViewId ];

        if ( bufferView.isParsed )
            return bufferView.dbufferView;

        bufferView.isParsed = true;
        bufferView.dbufferView = false;

        const buffer = this.parseBuffer( bufferView.buffer );
        if ( buffer ) {

            const { byteOffset, byteLength } = bufferView;
            const bufferArray = new Uint8Array( buffer, byteOffset || 0, byteLength );
            bufferView.dbufferView = ( new Uint8Array( bufferArray ) ).buffer;

        }

        return bufferView.dbufferView;

    },

    BASE64_MARKER: ';base64,',

    parseBuffer( bufferId ) {

        const buffer = this.gltf.buffers[ bufferId ];

        if ( buffer.isParsed )
            return buffer.dbuffer;

        buffer.isParsed = true;
        buffer.dbuffer = false;

        if ( buffer.uri.substr( 0, 5 ) !== 'data:' ) {

            const uri = buffer.uri;
            const arrayBuffer = this.gltf.resources[ uri ];
            if ( arrayBuffer )
                if ( arrayBuffer.byteLength === buffer.byteLength ) {

                    buffer.dbuffer = this.gltf.resources[ uri ];

                } else
                    console.error( `load gltf resource "${uri}" at buffers[${bufferId} failed, ArrayBuffer.byteLength not equals buffer's byteLength]` );
            else
                console.error( `load gltf resource "${uri}" at buffers[${bufferId}] failed` );

        } else {

            const base64Idx = buffer.uri.indexOf( this.BASE64_MARKER ) + this.BASE64_MARKER.length;
            const blob = window.atob( buffer.uri.substr( base64Idx ) );
            const bytes = new Uint8Array( blob.length );
            for ( let i = 0; i < blob.length; i ++ )
                bytes[ i ] = blob.charCodeAt( i );
            buffer.dbuffer = bytes.buffer;

        }

        return buffer.dbuffer;

    },

    parseMaterial( materialId ) {

        let material;
        if ( materialId === undefined )
            material = GLTFLoader.defaultMaterial;
        else
            material = this.gltf.materials[ materialId ];

        if ( material.isParsed )
            return material.dmaterial;

        const {
            name, pbrMetallicRoughness, normalTexture, occlusionTexture, emissiveTexture, emissiveFactor,
            alphaMode, alphaCutoff, doubleSided,
        } = material;
        const dmaterial = {
            name,
            cull: ! doubleSided,
            baseColor: [ 1, 1, 1, 1 ],
            metalness: 1,
            roughness: 1,
        };

        if ( alphaMode && alphaMode !== 'OPAQUE' )
            if ( alphaMode === 'MASK' )
                dmaterial.alphaMask = alphaCutoff === undefined ? 0.5 : alphaCutoff;
            else if ( alphaMode === 'BLEND' )
                dmaterial.blend = true;

        if ( pbrMetallicRoughness ) {

            const {
                baseColorFactor, metallicFactor, roughnessFactor, baseColorTexture, metallicRoughnessTexture,
            } = pbrMetallicRoughness;

            Object.assign( dmaterial, {
                baseColor: baseColorFactor || [ 1, 1, 1, 1 ],
                metalness: metallicFactor === undefined ? 1 : metallicFactor,
                roughness: roughnessFactor === undefined ? 1 : roughnessFactor,
            } );


            if ( baseColorTexture ) {

                const texture = this.parseTexture( baseColorTexture.index );
                if ( texture ) {

                    texture.texCoord = baseColorTexture.texCoord || 0;
                    dmaterial.baseTexture = texture;

                }

            }

            if ( metallicRoughnessTexture ) {

                const texture = this.parseTexture( metallicRoughnessTexture.index );
                if ( texture ) {

                    texture.texCoord = metallicRoughnessTexture.texCoord || 0;
                    dmaterial.metalnessTexture = texture;
                    dmaterial.roughnessTexture = texture;

                }

            }

        }

        if ( normalTexture ) {

            const texture = this.parseTexture( normalTexture.index );
            if ( texture ) {

                texture.texCoord = normalTexture.texCoord || 0;
                dmaterial.normalTexture = texture;
                dmaterial.normalScale = [ 0, 0 ].fill( normalTexture.scale || 1 );

            }

        }

        if ( occlusionTexture ) {

            const texture = this.parseTexture( occlusionTexture.index );
            if ( texture ) {

                texture.texCoord = occlusionTexture.texCoord || 0;
                dmaterial.aoTexture = texture;
                dmaterial.aoTextureIntensity = occlusionTexture.strength || 1;

            }

        }

        if ( emissiveTexture && emissiveFactor ) {

            const texture = this.parseTexture( emissiveTexture.index );
            if ( texture ) {

                texture.texCoord = emissiveTexture.texCoord || 0;
                dmaterial.emissiveTexture = texture;
                dmaterial.emissive = emissiveFactor;

            }

        }

        dmaterial.dither = this.dither;
        dmaterial.envTexture = this.envTexture;
        dmaterial.envMode = this.envMode;
        dmaterial.refractionRation = this.refractionRation;
        dmaterial.envTextureIntensity = this.envTextureIntensity;
        material.isParsed = true;
        material.dmaterial = dmaterial;
        return material.dmaterial;

    },

    parseTexture( textureId ) {

        const texture = this.gltf.textures[ textureId ];

        if ( texture.isParsed )
            return texture.dtexture;

        const { source, sampler } = texture;
        let dtexture = {};
        const image = this.parseImage( source );
        const imgsampler = this.parseSampler( sampler );
        if ( ! image || ! imgsampler ) {

            dtexture = false;
            return false;

        }
        Object.assign( dtexture, { src: image }, imgsampler );

        texture.isParsed = true;
        texture.dtexture = new Texture2D( dtexture );
        return texture.dtexture;

    },

    parseImage( imageId ) {

        const image = this.gltf.images[ imageId ];

        if ( image.isParsed )
            return image.dimage;

        image.isParsed = true;
        image.dimage = false;

        if ( ! image.uri && typeof image.bufferView !== 'undefined' ) {

            const arrayBuffer = this.parseBufferView( image.bufferView );
            if ( arrayBuffer ) {

                const type = image.mimeType || 'image/jpeg';
                const arrayBufferView = new Uint8Array( arrayBuffer );
                const blob = new Blob( [ arrayBufferView ], { type } );
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL( blob );

                image.dimage = imageUrl;

            }

        }

        if ( image.uri )
            if ( image.uri.substr( 0, 5 ) !== 'data:' ) {

                const uri = image.uri;
                const imageres = this.gltf.resources[ uri ];
                if ( imageres )
                    image.dimage = imageres;

            } else {

                const img = new window.Image();
                img.src = image.uri;

                image.dimage = img;

            }

        return image.dimage;

    },

    parseSampler( samplerId ) {

        if ( samplerId === undefined ) return { wrap: TextureWrapMode.REPEAT, minMag: TextureFilter.LINEAR_MIPMAP_LINEAR };
        const sampler = this.gltf.samplers[ samplerId ];

        if ( sampler.isParsed )
            return sampler.dsampler;

        const {
            magFilter, minFilter, wrapS, wrapT,
        } = sampler;

        const dsampler = {
            wrapS: wrapS || TextureWrapMode.REPEAT,
            wrapT: wrapT || TextureWrapMode.REPEAT,
            min: minFilter || TextureFilter.LINEAR_MIPMAP_LINEAR,
            mag: magFilter || TextureFilter.LINEAR,
        };

        sampler.dsampler = dsampler;
        sampler.isParsed = true;
        return dsampler;

    },

} );

Object.assign( GLTFLoader, {

    getMeshNameCounter: ( function () {

        let counter = 0;

        return function getMeshNameCounter() {

            return `GLTF_NO_NAME_PRIMITIVE_${counter ++}`;

        };

    }() ),

    getModelNameCounter: ( function () {

        let counter = 0;

        return function getModelNameCounter() {

            return `GLTF_NO_NAME_MESH_${counter ++}`;

        };

    }() ),


    GLTF_NODE_INDEX_PROPERTY: 'GLTF_NODE_INDEX',

    getTexCoordDefine( texNum ) {

        return `UV_NUM ${texNum}`;

    },

    BASE_COLOR_UNIFORM: 'u_baseColorFactor',

    BASE_COLOR_TEXTURE_UNIFORM: 'u_baseColorSampler',

    METALROUGHNESS_UNIFORM: 'u_metallicRoughnessValues',

    METALROUGHNESS_TEXTURE_UNIFORM: 'u_metallicRoughnessSampler',

    NORMAL_TEXTURE_UNIFORM: 'u_normalSampler',

    NORMAL_SCALE_UNIFORM: 'u_normalScale',

    EMISSIVE_TEXTURE_UNIFORM: 'u_emissiveSampler',

    EMISSIVE_FACTOR_UNIFORM: 'u_emissiveFactor',

    OCCLUSION_TEXTURE_UNIFORM: 'u_occlusionSampler',

    OCCLUSION_FACTOR_UNIFORM: 'u_occlusionFactor',

    getVertexColorDefine( num ) {

        return `HAS_VERTEXCOLOR ${num}`;

    },

    getBaseColorTextureDefine() {

        return 'HAS_BASECOLORMAP';

    },

    getMetalRoughnessDefine() {

        return 'HAS_METALROUGHNESSMAP';

    },

    getNormalMapDefine() {

        return 'HAS_NORMALMAP';

    },

    getEmissiveMapDefine() {

        return 'HAS_EMISSIVEMAP';

    },

    getOcclusionMapDefine() {

        return 'HAS_OCCLUSIONMAP';

    },

    MAX_MORPH_TARGETS: 8,

    MORPH_POSITION_PREFIX: 'a_morphPositions_',

    MORPH_NORMAL_PREFIX: 'a_morphNromals_',

    MORPH_TANGENT_PREFIX: 'a_morphTangents_',

    MORPH_WEIGHT_UNIFORM: 'u_morphWeights',

    getMorphTargetsDefine( targetNum ) {

        return `MORPH_TARGET_NUM ${targetNum}`;

    },

    getMorphtargetPositionDefine() {

        return 'HAS_MORPH_POSITION';

    },

    getMorphtargetNormalDefine() {

        return 'HAS_MORPH_NORMAL';

    },

    getMorphtargetTangentDefine() {

        return 'HAS_MORPH_TANGENT';

    },

    SCENE_ROOT_SKELETON: 'SCENE_ROOT',

    IDENTITY_INVERSE_BIND_MATRICES: 'IDENTITY_IBM',

    getJointsNumDefine( num ) {

        return `JOINTS_NUM ${num}`;

    },

    getJointVec8Define() {

        return 'JOINT_VEC8';

    },

    JOINT_MATRICES_UNIFORM: 'u_jointMatrix',

    getHasNormalDefine() {

        return 'HAS_NORMAL';

    },

    getHasTangentDefine() {

        return 'HAS_TANGENT';

    },

    getHasNormalMapDefine() {

        return 'HAS_NORMAL_MAP';

    },

    ALPHA_CUTOFF_UNIFORM: 'u_alphaCutoff',

    getAlphaMaskDefine() {

        return 'ALPHA_MASK';

    },

    getAlphaBlendDdefine() {

        return 'ALPHA_BLEND';

    },

    defaultMaterial: {

        name: 'GLTF_DEFAULT_MATERIAL',
        emissiveFactor: [ 0, 0, 0 ],
        alphaMode: 'OPAQUE',
        alphaCutoff: 0.5,
        doubleSided: false,
        isParsed: true,
        dmaterial: {
            name: 'GLTF_DEFAULT_MATERIAL',
            cull: true,
            baseColor: [ 1, 1, 1, 1 ],
            emissive: [ 0, 0, 0 ],
            metalness: 1,
            roughness: 1,
        },

    },

    attributesKey: {
        POSITION: ShaderParams.ATTRIB_POSITION_NAME,
        NORMAL: ShaderParams.ATTRIB_NORMAL_NAME,
        TANGENT: ShaderParams.ATTRIB_TANGENT_NAME,
        TEXCOORD_0: ShaderParams.ATTRIB_UV_NAME,
        JOINTS_0: ShaderParams.ATTRIB_JOINT_0_NAME,
        WEIGHTS_0: ShaderParams.ATTRIB_WEIGHT_0_NAME,
        COLOR_0: ShaderParams.ATTRIB_VERTEX_COLOR_NAME,
    },

} );

export { GLTFLoader };
