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

    generator: {

        get() {

            return this._generator;

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

        const { version, generator } = this.gltf.asset;
        this._generator = generator;
        if ( version !== '2.0' ) {

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

                        if ( ! input || ! output ) continue;

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
                            findFlag: GLTFLoader.GLTF_NODE_INDEX_PROPERTY,
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

        this.currentSceneName = scene.name || 'GLTF_NO_NAME_SCENE';

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
        const skins = [];

        function parseNode( nodeInfo, parentNode ) {

            const node = new Node( nodeInfo.name );

            node[ GLTFLoader.GLTF_NODE_INDEX_PROPERTY ] = nodeInfo.nodeId;

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

            if ( nodeInfo.primitives ) {

                const models = [];
                for ( let i = 0; i < nodeInfo.primitives.length; i ++ ) {

                    const primitive = nodeInfo.primitives[ i ];
                    const { attribArrays, modelName, drawMode } = primitive;
                    if ( ! primitive.attribArrays.mesh ) {

                        const mesh = new Mesh( primitive.meshName, attribArrays );
                        primitive.attribArrays = { attribArrays, mesh };

                    }

                    const model = new Model( primitive.attribArrays.mesh );
                    model.name = modelName;
                    model.drawMode = drawMode;

                    const uniformobj = {};
                    const skinDefines = ( nodeInfo.skin && nodeInfo.skin.defines ) || [];
                    model.defines = primitive.defines.concat( skinDefines );
                    // parse material
                    if ( primitive.material ) {

                        const {
                            baseColorTexture, baseColorFactor, metallicFactor, roughnessFactor, doubleSided,
                            metallicRoughnessTexture, normalTexture, occlusionTexture, emissiveTexture,
                        } = primitive.material;

                        model.mesh.cullFace = ! doubleSided;

                        uniformobj[ GLTFLoader.BASE_COLOR_UNIFORM ] = baseColorFactor;
                        uniformobj[ GLTFLoader.METALROUGHNESS_UNIFORM ] = [ metallicFactor, roughnessFactor ];

                        if ( baseColorTexture && baseColorTexture.texture ) {

                            const idx = textures.indexOf( baseColorTexture.texture );
                            if ( idx < 0 ) {

                                textures.push( baseColorTexture.texture );
                                baseColorTexture.textureIdx = textures.length - 1;

                            }
                            if ( ! model.textures ) model.textures = {};
                            if ( baseColorFactor.textureIdx === undefined ) baseColorFactor.textureIdx = idx;
                            model.textures[ GLTFLoader.BASE_COLOR_TEXTURE_UNIFORM ] = baseColorTexture.textureIdx;

                        }

                        if ( metallicRoughnessTexture && metallicRoughnessTexture.texture ) {

                            const idx = textures.indexOf( metallicRoughnessTexture.texture );
                            if ( idx < 0 ) {

                                textures.push( metallicRoughnessTexture.texture );
                                metallicRoughnessTexture.textureIdx = textures.length - 1;

                            }
                            if ( ! model.textures ) model.textures = {};
                            if ( metallicRoughnessTexture.textureIdx === undefined ) metallicRoughnessTexture.textureIdx = idx;
                            model.textures[ GLTFLoader.METALROUGHNESS_TEXTURE_UNIFORM ] = metallicRoughnessTexture.textureIdx;

                        }

                        if ( normalTexture && normalTexture.texture ) {

                            const idx = textures.indexOf( normalTexture.texture );
                            if ( idx < 0 ) {

                                textures.push( normalTexture.texture );
                                normalTexture.textureIdx = textures.length - 1;

                            }
                            if ( ! model.textures ) model.textures = {};
                            if ( normalTexture.textureIdx === undefined ) normalTexture.textureIdx = idx;
                            model.textures[ GLTFLoader.NORMAL_TEXTURE_UNIFORM ] = normalTexture.textureIdx;
                            uniformobj[ GLTFLoader.NORMAL_SCALE_UNIFORM ] = normalTexture.scale;

                        }

                        if ( occlusionTexture && occlusionTexture.texture ) {

                            const idx = textures.indexOf( occlusionTexture.texture );
                            if ( idx < 0 ) {

                                textures.push( occlusionTexture.texture );
                                occlusionTexture.textureIdx = textures.length - 1;

                            }
                            if ( ! model.textures ) model.textures = {};
                            if ( occlusionTexture.textureIdx === undefined ) occlusionTexture.textureIdx = idx;
                            model.textures[ GLTFLoader.OCCLUSION_TEXTURE_UNIFORM ] = occlusionTexture.textureIdx;
                            uniformobj[ GLTFLoader.OCCLUSION_FACTOR_UNIFORM ] = occlusionTexture.strength;

                        }

                        if ( emissiveTexture && emissiveTexture.texture ) {

                            const idx = textures.indexOf( emissiveTexture.texture );
                            if ( idx < 0 ) {

                                textures.push( emissiveTexture.texture );
                                emissiveTexture.textureIdx = textures.length - 1;

                            }
                            if ( ! model.textures ) model.textures = {};
                            if ( emissiveTexture.textureIdx === undefined ) emissiveTexture.textureIdx = idx;
                            model.textures[ GLTFLoader.EMISSIVE_TEXTURE_UNIFORM ] = emissiveTexture.textureIdx;
                            uniformobj[ GLTFLoader.EMISSIVE_FACTOR_UNIFORM ] = emissiveTexture.emissiveFactor;

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

                    models.push( model );

                }

                if ( nodeInfo.skin ) {

                    node.skin = Object.assign( nodeInfo.skin, { models } );
                    skins.push( node.skin );

                }

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

        // apply skins
        if ( skins.length ) {

            const skinsNum = skins.length;
            const updateJointUniformFuncs = [];
            for ( let i = 0; i < skins.length; i ++ ) {

                const {
                    joints, skeleton, inverseBindMatrices, models,
                } = skins[ i ];

                const jointNum = joints.length;
                const globalJointTransformNodes = [];
                for ( let j = 0; j < jointNum; j ++ )
                    globalJointTransformNodes[ j ] = rootNode.findInChildren( GLTFLoader.GLTF_NODE_INDEX_PROPERTY, joints[ j ] );

                let globalTransformNode = false;
                if ( skeleton !== GLTFLoader.SCENE_ROOT_SKELETON )
                    globalTransformNode = rootNode.findInChildren( GLTFLoader.GLTF_NODE_INDEX_PROPERTY, skeleton );
                else
                    globalTransformNode = rootNode;

                const frag = new Array( 16 );
                updateJointUniformFuncs[ i ] = function updateJointUniformFunc() {

                    let jointMats = [];
                    for ( let n = 0; n < jointNum; n ++ ) {

                        Matrix4.invert( frag, globalTransformNode.transform.getWorldMatrix() );
                        Matrix4.mult( frag, frag, globalJointTransformNodes[ n ].transform.getWorldMatrix() );
                        if ( inverseBindMatrices !== GLTFLoader.IDENTITY_INVERSE_BIND_MATRICES )
                            Matrix4.mult( frag, frag, inverseBindMatrices[ n ] );
                        jointMats = jointMats.concat( frag );

                    }

                    const uniformObj = {};
                    uniformObj[ GLTFLoader.JOINT_MATRICES_UNIFORM ] = jointMats;
                    models.forEach( model => model.setUniformObj( uniformObj ) );

                };

            }

            rootNode.afterUpdateMatrix = function () {

                for ( let i = 0; i < skinsNum; i ++ )
                    updateJointUniformFuncs[ i ]();

            };

        }

        const animas = { animations, rootNode, type: 'gltf' };
        return { rootNode, textures, animations: animas };

    },

    parseNode( nodeId ) {

        // TODO camera
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

        if ( node.skin !== undefined ) {

            const skin = this.parseSkin( node.skin );
            if ( skin )
                dnode.skin = skin;

        }

        dnode.children = [];
        if ( node.children )
            for ( let i = 0; i < node.children.length; i ++ )
                dnode.children.push( this.parseNode( node.children[ i ] ) );

        node.dnode = dnode;
        node.isParsed = true;

        return node.dnode;

    },

    parseSkin( skinId ) {

        const skin = this.gltf.skins[ skinId ];

        if ( ! skin )
            return errorMiss( 'skin', skinId );

        if ( skin.isParsed )
            return skin.dskin;

        const {
            name, joints, inverseBindMatrices, skeleton,
        } = skin;

        if ( ! joints )
            return errorMiss( 'skin.joints', skinId );

        skin.isParsed = true;
        skin.dskin = false;
        let dskin = { name, joints, defines: [ GLTFLoader.getJointsNumDefine( joints.length ) ] };
        dskin.skeleton = skeleton === undefined ? GLTFLoader.SCENE_ROOT_SKELETON : skeleton;
        dskin.inverseBindMatrices = GLTFLoader.IDENTITY_INVERSE_BIND_MATRICES;

        if ( inverseBindMatrices !== undefined ) {

            const accessor = this.parseAccessor( inverseBindMatrices );
            if ( accessor ) {

                const array = accessor.data;
                const matrices = [];
                for ( let i = 0; i < array.length / 16; i ++ )
                    matrices.push( new Float32Array( array.buffer, 16 * i * Float32Array.BYTES_PER_ELEMENT, 16 ) );

                dskin.inverseBindMatrices = matrices;

            } else
                dskin = false;

        }

        skin.dskin = dskin;
        return skin.dskin;

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
            let hasNormal = false;
            let hasTangent = false;
            let texCoordNum = 0;
            let jointVec8 = false;
            Object.keys( attributes ).forEach( ( attribute ) => {

                const accessor = this.parseAccessor( attributes[ attribute ] );

                if ( accessor ) {

                    let attribName;
                    switch ( attribute ) {

                    case 'POSITION':
                        attribName = Constant.ATTRIB_POSITION_NAME;
                        break;

                    case 'NORMAL':
                        attribName = Constant.ATTRIB_NORMAL_NAME;
                        hasNormal = true;
                        break;

                    case 'TANGENT':
                        attribName = Constant.ATTRIB_TANGENT_NAME;
                        hasTangent = true;
                        break;

                    case 'TEXCOORD_0':
                        attribName = Constant.ATTRIB_UV_NAME;
                        texCoordNum ++;
                        break;

                    case 'TEXCOORD_1':
                        attribName = Constant.ATTRIB_UV_1_NAME;
                        texCoordNum ++;
                        break;

                    case 'JOINTS_0':
                        attribName = Constant.ATTRIB_JOINT_0_NAME;
                        break;

                    case 'JOINTS_1':
                        attribName = Constant.ATTRIB_JOINT_1_NAME;
                        jointVec8 = true;
                        break;

                    case 'WEIGHTS_0':
                        attribName = Constant.ATTRIB_WEIGHT_0_NAME;
                        break;

                    default:
                        attribName = attribute;

                    }

                    dprimitive.attribArrays[ attribName ] = accessor;

                }

            } );

            if ( hasNormal ) dprimitive.defines.push( GLTFLoader.getHasNormalDefine() );
            if ( hasTangent ) dprimitive.defines.push( GLTFLoader.getHasTangentDefine() );
            if ( texCoordNum ) dprimitive.defines.push( GLTFLoader.getTexCoordDefine( texCoordNum ) );
            if ( jointVec8 ) dprimitive.defines.push( GLTFLoader.getJointVec8Define() );

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
            dprimitive.meshName = name || GLTFLoader.getMeshNameCounter();
            dprimitive.modelName = mesh.name || GLTFLoader.getModelNameCounter();

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
        if ( ! bufferView )
            return errorMiss( 'bufferView', bufferViewId );

        if ( bufferView.isParsed )
            return bufferView.dbufferView;

        bufferView.isParsed = true;
        bufferView.dbufferVie = false;

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

        const {
            name, pbrMetallicRoughness, doubleSided, normalTexture, occlusionTexture, emissiveTexture, emissiveFactor,
        } = material;
        const dmaterial = { name, defines: [], doubleSided: !! doubleSided };

        if ( pbrMetallicRoughness ) {

            const {
                baseColorFactor, metallicFactor, roughnessFactor, baseColorTexture, metallicRoughnessTexture,
            } = pbrMetallicRoughness;

            Object.assign( dmaterial, { baseColorFactor: baseColorFactor || [ 1, 1, 1, 1 ], metallicFactor: metallicFactor || 1, roughnessFactor: roughnessFactor || 1 } );

            if ( baseColorTexture ) {

                const texture = this.parseTexture( baseColorTexture.index );
                if ( texture ) {

                    dmaterial.baseColorTexture = { texture, texCoord: baseColorTexture.texCoord || 0 };
                    dmaterial.defines.push( GLTFLoader.getBaseColorTextureDefine() );

                }

            }

            if ( metallicRoughnessTexture ) {

                const texture = this.parseTexture( metallicRoughnessTexture.index );
                if ( texture )
                    dmaterial.metallicRoughnessTexture = { texture, texCoord: metallicRoughnessTexture.texCoord || 0 };
                dmaterial.defines.push( GLTFLoader.getMetalRoughnessDefine() );

            }

        } else
            Object.assign( dmaterial, {
                baseColorFactor: [ 1, 1, 1, 1 ],
                metallicFactor: 1,
                roughnessFactor: 1,
            } );

        if ( normalTexture ) {

            const texture = this.parseTexture( normalTexture.index );
            if ( texture ) {

                dmaterial.normalTexture = { texture, texCoord: normalTexture.texCoord || 0, scale: normalTexture.scale || 1 };
                dmaterial.defines.push( GLTFLoader.getNormalMapDefine() );

            }

        }

        if ( occlusionTexture ) {

            const texture = this.parseTexture( occlusionTexture.index );
            if ( texture ) {

                dmaterial.occlusionTexture = { texture, texCoord: occlusionTexture.texCoord || 0, strength: occlusionTexture.strength || 1 };
                dmaterial.defines.push( GLTFLoader.getOcclusionMapDefine() );

            }

        }

        if ( emissiveTexture && emissiveFactor ) {

            const texture = this.parseTexture( emissiveTexture.index );
            if ( texture ) {

                dmaterial.emissiveTexture = { texture, texCoord: emissiveTexture.texCoord || 0, emissiveFactor };
                dmaterial.defines.push( GLTFLoader.getEmissiveMapDefine() );

            }

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

        if ( samplerId === undefined ) return { minMag: Constant.NEAREST, wrap: Constant.REPEAT };
        const sampler = this.gltf.samplers[ samplerId ];
        if ( ! sampler )
            return errorMiss( 'sampler', samplerId );

        if ( sampler.isParsed )
            return sampler.dsampler;

        const {
            magFilter, minFilter, wrapS, wrapT,
        } = sampler;

        const dsampler = {
            min: minFilter || Constant.LINEAR,
            max: magFilter || Constant.LINEAR,
            wrapS: wrapS || Constant.REPEAT,
            wrapT: wrapT || Constant.REPEAT,
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

        return 'HAS_MORPH_POSITION ';

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

    defaultMaterial: {

        name: 'GLTF_DEFAULT_MATERIAL',
        emissiveFactor: [ 0, 0, 0 ],
        alphaMode: 'OPAQUE',
        alphaCutoff: 0.5,
        doubleSided: false,
        isParsed: true,
        dmaterial: {
            name: 'GLTF_DEFAULT_MATERIAL',
            defines: [],
            doubleSided: false,
            baseColorFactor: [ 1, 1, 1, 1 ],
            metallicFactor: 1,
            roughnessFactor: 1,
            emissiveFactor: [ 0, 0, 0 ],
        },

    },

} );

export { GLTFLoader };
