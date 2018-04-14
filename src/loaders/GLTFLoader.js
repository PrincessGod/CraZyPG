/* eslint no-loop-func: 0 */
import { getTypedArrayTypeFromGLType } from '../renderer/typedArray';
import * as Constant from '../renderer/constant';
import { Model } from '../model/Model';
import { Mesh } from '../model/Primatives';
import { Node } from '../scene/Node';
import { Matrix4 } from '../math/Matrix4';
import { FileLoader } from './Fileloader';

function GLTFLoader() {

    this.currentSceneName = 'null';

}

function errorMiss( nodeType, index ) {

    if ( index !== undefined )
        console.error( `glTF not have ${nodeType} on index ${index}` );
    else
        console.error( `glTF not have ${nodeType} property` );
    return false;

}

Object.defineProperties( GLTFLoader, {

    version: {

        get() {

            if ( this.version )
                return this.version;
            else if ( this.json ) {

                if ( ! this.json.asset )
                    return errorMiss( 'asset' );

                this.version = this.json.asset.version;
                if ( this.json.asset.minVersion )
                    this.version += `\r minVersion${this.json.asset.minVersion}`;

                return this.version;

            }

            console.warn( 'glTF not loaded.' );
            return null;

        },
    },

} );

Object.assign( GLTFLoader.prototype, {

    load( file, sceneId ) {

        const name = 'GLTFLOADER';
        const loader = new FileLoader( { file, name } );
        return loader.load()
            .then( res => this.parse( res[ name ], sceneId ) );

    },

    parse( json, sceneId ) {

        this.gltf = json;

        if ( this.gltf.asset.version !== '2.0' ) {

            console.error( `GlTFLoader only support glTF 2.0 for now! Received glTF version: ${this.version}` );
            return false;

        }

        const result = {
            nodes: this.parseScene( sceneId ),
            animations: this.parseAnimations(),
            currentSceneName: this.currentSceneName,
        };

        return this.convertToNode( result );

    },

    parseAnimations() {

        const result = [];
        const animations = this.gltf.animations;
        if ( animations )
            for ( let i = 0; i < animations.length; i ++ ) {

                const animation = animations[ i ];
                const { name, channels, samplers } = animation;
                const clips = [];
                if ( channels && samplers )
                    for ( let j = 0; j < channels.length; j ++ ) {

                        const channel = channels[ j ];
                        const sampler = samplers[ channel.sampler ];
                        if ( ! sampler ) {

                            errorMiss( `animations[${i}].channels[${j}].sampler`, channel.sampler );
                            continue;

                        }

                        const input = this.parseAccessor( sampler.input ).data;
                        const outputData = this.parseAccessor( sampler.output );
                        const output = outputData.data;
                        const numComponents = outputData.numComponents;
                        const interpolation = sampler.interpolation || 'LINEAR';
                        const gltfNodeIdx = channel.target.node;
                        const path = channel.target.path;

                        let combinedOutput = output;
                        if ( numComponents !== 1 || input.length !== output.length ) {

                            const numComp = output.length / input.length;
                            combinedOutput = [];
                            for ( let k = 0; k < input.length; k ++ )
                                combinedOutput.push( output.slice( numComp * k, numComp * ( k + 1 ) ) );

                        }

                        let nodeProperty = path;
                        const extras = {};
                        switch ( path ) {

                        case 'translation':
                            nodeProperty = 'position';
                            break;
                        case 'rotation':
                            nodeProperty = 'quaternion';
                            break;
                        case 'scale':
                            nodeProperty = 'scale';
                            break;
                        case 'weights':
                            nodeProperty = 'weights';
                            extras.uniformName = GLTFLoader.MORPH_WEIGHT_UNIFORM;
                            break;
                        default:
                            console.error( `unsupported animation sampler path ${path}` );
                            nodeProperty = false;

                        }

                        if ( ! nodeProperty ) continue;

                        const clip = {
                            times: input,
                            values: combinedOutput,
                            findFlag: 'gltfNodeIdx',
                            findValue: gltfNodeIdx,
                            targetProp: nodeProperty,
                            method: interpolation,
                            extras,
                        };

                        clips.push( clip );

                    }

                result.push( {
                    name: name || String( i ),
                    clips,
                } );

            }

        return result;

    },

    parseScene( sceneId ) {

        const loadScene = sceneId || this.gltf.scene || 0;
        const scene = this.gltf.scenes[ loadScene ];

        if ( typeof scene === 'undefined' )
            return errorMiss( 'scene', loadScene );

        this.currentSceneName = scene.name || 'No Name Scene';

        const result = [];
        const nodes = scene.nodes;
        for ( let i = 0; i < nodes.length; i ++ ) {

            const node = this.parseNode( nodes[ i ] );
            if ( node )
                result.push( node );

        }

        return result;

    },

    convertToNode( infos ) {

        const rootNode = new Node( infos.name );
        const nodes = infos.nodes;
        const animations = infos.animations;
        const textures = [];

        function parseNode( nodeInfo, parentNode ) {

            const node = new Node( nodeInfo.name );

            node.gltfNodeIdx = nodeInfo.nodeId;

            if ( nodeInfo.matrix ) {

                nodeInfo.translation = Matrix4.getTranslation( [ 0, 0, 0 ], nodeInfo.matrix ); // eslint-disable-line
                nodeInfo.rotation = Matrix4.getRotation( [ 0, 0, 0, 1 ], nodeInfo.matrix ); // eslint-disable-line
                nodeInfo.scale = Matrix4.getScaling( [ 1, 1, 1 ], nodeInfo.matrix ); // eslint-disable-line

            }

            if ( nodeInfo.translation )
                node.position = nodeInfo.translation;
            if ( nodeInfo.rotation )
                node.quaternion = nodeInfo.rotation;
            if ( nodeInfo.scale )
                node.scale = nodeInfo.scale;

            parentNode.addChild( node );

            if ( nodeInfo.primitives )
                for ( let i = 0; i < nodeInfo.primitives.length; i ++ ) {

                    const primitive = nodeInfo.primitives[ i ];
                    const mesh = new Mesh( primitive.name, primitive.attribArrays, { drawMode: primitive.drawMode } );
                    const model = new Model( mesh );
                    const uniformobj = {};
                    model.defines = primitive.defines;
                    // parse material
                    if ( primitive.material ) {

                        const { baseColorTexture, baseColorFactor, doubleSided } = primitive.material;

                        model.mesh.cullFace = ! doubleSided;

                        if ( baseColorFactor )
                            uniformobj[ GLTFLoader.BASE_COLOR_UNIFORM ] = baseColorFactor;

                        if ( baseColorTexture && baseColorTexture.texture ) {

                            baseColorTexture.isConverted = true;
                            const idx = textures.indexOf( baseColorTexture.texture );
                            if ( idx < 0 ) {

                                textures.push( baseColorTexture.texture );
                                baseColorTexture.textureIdx = textures.length - 1;
                                model.texture = textures.length - 1;

                            } else
                                model.texture = idx;

                        }

                    }

                    // morph targets
                    if ( primitive.weights )
                        uniformobj[ GLTFLoader.MORPH_WEIGHT_UNIFORM ] = primitive.weights;

                    model.setUniformObj( uniformobj );

                    if ( nodeInfo.primitives.length < 2 )
                        node.setModel( model );
                    else
                        node.addChild( model );

                }

            return node;

        }

        function trivarse( trivarseFun, parentNode, nodeInfos ) {

            for ( let i = 0; i < nodeInfos.length; i ++ ) {

                const node = trivarseFun( nodeInfos[ i ], parentNode );
                trivarse( trivarseFun, node, nodeInfos[ i ].children );

            }

        }

        trivarse( parseNode, rootNode, nodes );

        const animas = { animations, rootNode, type: 'gltf' };
        return { rootNode, textures, animations: animas };

    },

    parseNode( nodeId ) {

        // TODO camera skin
        const node = this.gltf.nodes[ nodeId ];
        if ( ! node )
            return errorMiss( 'node', nodeId );

        if ( node.isParsed )
            return node.dnode;

        const {
            name, matrix, translation, rotation, scale,
        } = node;

        const dnode = {
            name,
            matrix,
            translation,
            rotation,
            scale,
            nodeId,
        };

        if ( node.mesh !== undefined )
            dnode.primitives = this.parseMesh( node.mesh );

        dnode.children = [];
        if ( node.children )
            for ( let i = 0; i < node.children.length; i ++ )
                dnode.children.push( this.parseNode( node.children[ i ] ) );

        node.dnode = dnode;
        node.isParsed = true;

        return node.dnode;

    },

    parseMesh( meshId ) {

        const mesh = this.gltf.meshes[ meshId ];

        if ( ! mesh )
            return errorMiss( 'mesh', meshId );

        if ( mesh.isParsed )
            return mesh.dprimitives;

        const primitives = mesh.primitives;
        const dprimitives = [];
        for ( let i = 0; i < primitives.length; i ++ ) {

            const primitive = primitives[ i ];
            const {
                attributes, indices, material, mode, name, targets,
            } = primitive;

            const dprimitive = {
                attribArrays: {},
                defines: [],
            };
            let texCoordNum = 0;
            Object.keys( attributes ).forEach( ( attribute ) => {

                const accessor = this.parseAccessor( attributes[ attribute ] );

                if ( accessor ) {

                    let attribName = attribute;
                    switch ( attribute ) {

                    case 'POSITION':
                        attribName = Constant.ATTRIB_POSITION_NAME;
                        break;

                    case 'NORMAL':
                        attribName = Constant.ATTRIB_NORMAL_NAME;
                        break;

                    case 'TEXCOORD_0':
                        attribName = Constant.ATTRIB_UV_NAME;
                        texCoordNum = 1;
                        break;

                    default:
                        attribName = attribute;

                    }

                    dprimitive.attribArrays[ attribName ] = accessor;

                }

            } );

            if ( texCoordNum ) dprimitive.defines.push( GLTFLoader.getTexCoordDefine( texCoordNum ) );

            if ( indices !== undefined ) {

                const accessor = this.parseAccessor( indices );
                if ( accessor )
                    dprimitive.attribArrays.indices = accessor;

            }

            const dmaterial = this.parseMaterial( material );
            if ( dmaterial ) {

                dprimitive.material = dmaterial;
                dprimitive.defines = dprimitive.defines.concat( dmaterial.defines );

            }

            dprimitive.drawMode = mode === undefined ? 4 : mode;
            dprimitive.name = name || mesh.name || 'no name mesh';

            if ( targets ) {

                dprimitive.defines.push( GLTFLoader.getMorphTargetsDefine( targets.length ) );
                let hasPositions = false;
                let hasNormals = false;
                let hasTangents = false;
                for ( let j = 0; j < targets.length; j ++ ) {

                    const target = targets[ j ];
                    Object.keys( target ).forEach( ( attribute ) => {

                        const accessor = this.parseAccessor( target[ attribute ] );
                        if ( accessor ) {

                            let attribName;
                            switch ( attribute ) {

                            case 'POSITION':
                                attribName = GLTFLoader.MORPH_POSITION_PREFIX + j;
                                hasPositions = true;
                                break;
                            case 'NORMAL':
                                attribName = GLTFLoader.MORPH_NORMAL_PREFIX + j;
                                hasNormals = true;
                                break;
                            case 'TANGENT':
                                attribName = GLTFLoader.MORPH_TANGENT_PREFIX + j;
                                hasTangents = true;
                                break;
                            default:
                                attribName = false;

                            }

                            if ( ! attribName )
                                console.error( `glTF has unsupported morph target attribute ${attribute}` );
                            else
                                dprimitive.attribArrays[ attribName ] = accessor;

                        }

                    } );

                }

                if ( hasPositions ) dprimitive.defines.push( GLTFLoader.getMorphtargetPositionDefine() );
                if ( hasNormals ) dprimitive.defines.push( GLTFLoader.getMorphtargetNormalDefine() );
                if ( hasTangents ) dprimitive.defines.push( GLTFLoader.getMorphtargetTangentDefine() );
                dprimitive.weights = mesh.weights || new Array( targets.length ).fill( 0 );

            }

            dprimitives.push( dprimitive );

        }

        mesh.dprimitives = dprimitives;
        mesh.isParsed = true;

        return mesh.dprimitives;

    },

    parseAccessor( accessorId ) {

        const accessor = this.gltf.accessors[ accessorId ];
        if ( ! accessor )
            return errorMiss( 'accessor', accessorId );

        if ( accessor.isParsed )
            return accessor.daccessor;

        const bufferView = this.gltf.bufferViews[ accessor.bufferView ];
        if ( ! bufferView )
            return errorMiss( 'bufferView', accessor.bufferView );

        const buffer = this.parseBuffer( bufferView.buffer );
        if ( ! buffer )
            return errorMiss( 'buffer', accessor.buffer );

        const offset = ( accessor.byteOffset || 0 ) + ( bufferView.byteOffset || 0 );
        const glType = accessor.componentType;
        const arrayType = getTypedArrayTypeFromGLType( glType );
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

        let typedArray;

        const byteStride = bufferView.byteStride;
        const componentsBytes = numComponents * arrayType.BYTES_PER_ELEMENT;

        if ( byteStride && componentsBytes !== byteStride ) {

            if ( componentsBytes > byteStride ) {

                console.error( `glTF accessor ${accessorId} have components bytelength ${componentsBytes} greater than byteStride ${byteStride}` );
                return false;

            }
            const arrayLength = numComponents * accessor.count;
            typedArray = new arrayType( arrayLength ); // eslint-disable-line
            for ( let i = 0; i < accessor.count; i ++ ) {

                const componentVals = new arrayType( buffer, offset + i * byteStride, numComponents ); // eslint-disable-line
                for ( let j = 0; j < numComponents; j ++ )
                    typedArray[ i * numComponents + j ] = componentVals[ j ];

            }

        } else
            typedArray = new arrayType( buffer, offset, accessor.count * numComponents ); // eslint-disable-line

        const normalize = !! accessor.normalized;

        accessor.isParsed = true;
        accessor.computeResult = {
            typedArray, offset, glType, arrayType, numComponents,
        };
        accessor.daccessor = {
            data: typedArray, numComponents, normalize,
        };

        return accessor.daccessor;

    },

    parseBufferView( bufferViewId ) {

        const bufferView = this.gltf.bufferViews[ bufferViewId ];
        if ( ! bufferView )
            return errorMiss( 'bufferView', bufferViewId );

        if ( bufferView.isParsed )
            return bufferView.dbufferView;

        const buffer = this.parseBuffer( bufferView.buffer );
        if ( buffer ) {

            const bufferArray = new Uint8Array( buffer, bufferView.byteOffset, bufferView.byteLength );
            bufferView.dbufferView = bufferArray.buffer;
            bufferView.isParsed = true;

            return bufferView.dbufferView;

        }

        return false;

    },

    BASE64_MARKER: ';base64,',

    parseBuffer( bufferId ) {

        const buffer = this.gltf.buffers[ bufferId ];
        if ( ! buffer )
            return errorMiss( 'buffer', bufferId );

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

        if ( ! material )
            return errorMiss( 'material', materialId );

        if ( material.isParsed )
            return material.dmaterial;

        const { name, pbrMetallicRoughness, doubleSided } = material;
        const dmaterial = { name, defines: [], doubleSided: !! doubleSided };

        if ( pbrMetallicRoughness ) {

            const {
                baseColorFactor, metallicFactor, roughnessFactor, baseColorTexture, metallicRoughnessTexture,
            } = pbrMetallicRoughness;

            dmaterial.defines.push( GLTFLoader.getBaseColorFactorDefine() );

            Object.assign( dmaterial, { baseColorFactor: baseColorFactor || [ 1, 1, 1, 1 ], metallicFactor, roughnessFactor } );

            if ( baseColorTexture ) {

                const texture = this.parseTexture( baseColorTexture.index );
                if ( texture ) {

                    dmaterial.baseColorTexture = { texture, texCoord: baseColorTexture.texCoord || 0 };
                    dmaterial.defines.push( GLTFLoader.getBaseColorTextureDefine() );

                }

            }

            if ( metallicRoughnessTexture )
            // TODO
                dmaterial.metallicRoughnessTexture = metallicRoughnessTexture;


        }

        material.isParsed = true;
        material.dmaterial = dmaterial;
        return dmaterial;

    },

    parseTexture( textureId ) {

        const texture = this.gltf.textures[ textureId ];
        if ( ! texture )
            return errorMiss( 'texture', textureId );

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
        texture.dtexture = dtexture;
        return dtexture;

    },

    parseImage( imageId ) {

        const image = this.gltf.images[ imageId ];
        if ( ! image )
            return errorMiss( 'image', imageId );

        if ( image.isParsed )
            return image.dimage;

        image.isParsed = true;
        image.dimage = false;

        if ( ! image.uri && image.bufferView ) {

            const arrayBuffer = this.parseBufferView( image.bufferView );
            if ( arrayBuffer ) {

                const type = image.mimeType || 'image/jpeg';
                const arrayBufferView = new Uint8Array( arrayBuffer );
                const blob = new Blob( [ arrayBufferView ], { type } );
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL( blob );
                const img = new window.Image();
                img.src = imageUrl;

                image.dimage = img;

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

        const sampler = this.gltf.samplers[ samplerId ];
        if ( ! sampler )
            return errorMiss( 'sampler', samplerId );

        if ( sampler.isParsed )
            return sampler.dsampler;

        const {
            magFilter, minFilter, wrapS, wrapT,
        } = sampler;

        const dsampler = {
            min: minFilter, mag: magFilter, wrapS, wrapT,
        };

        sampler.dsampler = dsampler;
        sampler.isParsed = true;
        return dsampler;

    },

} );

Object.assign( GLTFLoader, {

    getTexCoordDefine( texNum ) {

        return `UV_NUM ${texNum}`;

    },

    BASE_COLOR_UNIFORM: 'u_baseColorFactor',

    getBaseColorFactorDefine() {

        return 'BASE_COLOR_FACTOR';

    },

    getBaseColorTextureDefine() {

        return 'BASE_COLOR_SAMPLER';

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

        return 'HAS_MORPH_POSITION ';

    },

    getMorphtargetNormalDefine() {

        return 'HAS_MORPH_NORMAL';

    },

    getMorphtargetTangentDefine() {

        return 'HAS_MORPH_TANGENT';

    },

    defaultMaterial: {

        name: 'GLTF_DEFAULT_MATERIAL',
        emissiveFactor: [ 0, 0, 0, 0 ],
        alphaMode: 'OPAQUE',
        alphaCutoff: 0.5,
        doubleSided: false,
        isParsed: true,
        dmaterial: { name: 'GLTF_DEFAULT_MATERIAL', defines: [], doubleSided: false },

    },

} );

export { GLTFLoader };
