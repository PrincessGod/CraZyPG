import { getTypedArrayTypeFromGLType } from '../renderer/typedArray';
import { Mesh } from '../model/Primatives';
import * as Constant from '../renderer/constant';

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

    load( json, sceneId ) {

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

        this.currentSceneName = scene.name || 'No Name';

        const nodes = scene.nodes;
        const result = {
            meshes: [],
        };
        result.name = this.currentSceneName;

        for ( let i = 0; i < nodes.length; i ++ ) {

            const mesh = this.parseNode( nodes[ i ] );
            if ( mesh )
                result.meshes.push( mesh );

        }

        return result;

    },

    parseNode( nodeId ) {

        // TODO camera skin
        const node = this.gltf.nodes[ nodeId ];
        if ( ! node )
            return errorMiss( 'node', nodeId );

        if ( node.isParsed )
            return node.dmesh;

        if ( node.mesh !== undefined ) {

            const primitives = this.parseMesh( node.mesh );
            if ( primitives )

                for ( let i = 0; i < primitives.length; i ++ ) {

                    const primitive = primitives[ i ];
                    const dmesh = new Mesh( primitive.name, primitive.attribArrays, { drawMode: primitive.drawMode } );
                    node.dmesh = dmesh;

                }


        }

        if ( node.children ) {

            if ( ! node.dmesh.dchildren )
                node.dmesh.dchildren = [];

            for ( let i = 0; i < node.children.length; i ++ )
                node.dmesh.dchildren.push( this.parseNode( node.children( i ) ) );

        }

        node.isParsed = true;

        return node.dmesh;

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
            dprimitive.name = name || 'no name mesh';

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
        const bytesPerElement = arrayType.BYTES_PER_ELEMENT;
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

        let byteLength = - 1;
        if ( bufferView.byteStride )
            byteLength = bufferView.byteStride * accessor.count;
        else
            byteLength = accessor.count * numComponents * bytesPerElement;

        if ( byteLength < 0 ) {

            console.error( ` glTF parse error when compute byteLength on accessor ${accessorId}, error value: ${byteLength}` );
            return false;

        }
        if ( byteLength !== bufferView.byteLength )
            console.error( `glTF has different byteLength at accessor ${accessorId}, compute byteLength: ${byteLength}, accessor byteLength: ${accessor.byteLength}` );

        const arrayLength = byteLength / bytesPerElement;
        const typedArray = new arrayType( buffer.dbuffer, offset, arrayLength ); // eslint-disable-line

        accessor.isParsed = true;
        accessor.computeResult = {
            typedArray, offset, glType, arrayType, numComponents, byteLength,
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
