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

        const loader = new FileLoader( file );
        return loader.load()
            .then( res => this.parse( res[ 0 ], sceneId ) );

    },

    parse( json, sceneId ) {

        this.gltf = json;

        if ( this.gltf.asset.version !== '2.0' ) {

            console.error( `GlTFLoader only support glTF 2.0 for now! Received glTF version: ${this.version}` );
            return false;

        }

        return this.parseScene( sceneId );

    },

    parseScene( sceneId ) {

        const loadScene = sceneId || this.gltf.scene || 0;
        const scene = this.gltf.scenes[ loadScene ];

        if ( typeof scene === 'undefined' )
            return errorMiss( 'scene', loadScene );

        this.currentSceneName = scene.name || 'No Name Scene';

        const nodes = scene.nodes;
        const result = {
            nodes: [],
        };
        result.name = this.currentSceneName;

        for ( let i = 0; i < nodes.length; i ++ ) {

            const node = this.parseNode( nodes[ i ] );
            if ( node )
                result.nodes.push( node );

        }

        return this.convertToNode( result );

    },

    convertToNode( infos ) {

        const root = new Node( infos.name );
        const nodes = infos.nodes;

        function parseNode( nodeInfo, parentNode ) {

            const node = new Node( nodeInfo.name );

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

        trivarse( parseNode, root, nodes );

        return root;

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
            name, matrix, translation, rotation, scale,
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
            return mesh.dprimatives;

        const primitives = mesh.primitives;
        mesh.dprimitives = [];
        for ( let i = 0; i < primitives.length; i ++ ) {

            const primitive = primitives[ i ];
            const {
                attributes, indices, material, mode, name,
            } = primitive;

            const dprimitive = {
                attribArrays: {},
            };
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

                    default:
                        attribName = attribute;

                    }

                    dprimitive.attribArrays[ attribName ] = accessor;

                }

            } );

            if ( indices !== undefined ) {

                const accessor = this.parseAccessor( indices );
                if ( accessor )
                    dprimitive.attribArrays.indices = accessor;

            }

            // TODO parse material
            dprimitive.material = material;

            dprimitive.drawMode = mode === undefined ? 4 : mode;
            dprimitive.name = name || mesh.name || 'no name mesh';

            mesh.dprimitives.push( dprimitive );

        }

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

        const typedArray = new arrayType( buffer.dbuffer, offset, accessor.count * numComponents ); // eslint-disable-line

        accessor.isParsed = true;
        accessor.computeResult = {
            typedArray, offset, glType, arrayType, numComponents,
        };
        accessor.daccessor = {
            data: typedArray, numComponents,
        };

        return accessor.daccessor;

    },

    BASE64_MARKER: ';base64,',

    parseBuffer( bufferId ) {

        const buffer = this.gltf.buffers[ bufferId ];
        if ( ! buffer )
            return errorMiss( 'buffer', bufferId );

        if ( buffer.isParsed )
            return buffer;

        if ( buffer.uri.substr( 0, 5 ) !== 'data:' )
            // TODO out side bin file
            return false;

        const base64Idx = buffer.uri.indexOf( this.BASE64_MARKER ) + this.BASE64_MARKER.length;
        const blob = window.atob( buffer.uri.substr( base64Idx ) );
        const bytes = new Uint8Array( blob.length );
        for ( let i = 0; i < blob.length; i ++ )
            bytes[ i ] = blob.charCodeAt( i );

        buffer.dbuffer = bytes.buffer;
        buffer.isParsed = true;
        return buffer;

    },

} );

export { GLTFLoader };
