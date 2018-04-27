
function FileLoader( files ) {

    this.files = [];
    this.items = [];
    this.addFiles( files );

}

Object.assign( FileLoader, {

    getFilename( url ) {

        if ( url ) {

            const m = url.toString().match( /.*\/(.+?)\./ );
            if ( m && m.length > 1 )
                return m[ 1 ];

        }
        return '';

    },

    getExtension( url ) {

        return url.split( '.' ).pop().toLowerCase();

    },

    getBasename( url ) {

        return url.split( /[\\/]/ ).pop();

    },

    getBasepath( url ) {

        const basename = FileLoader.getBasename( url );
        return url.slice( 0, url.length - basename.length );

    },

} );

Object.assign( FileLoader.prototype, {

    addFiles( files ) {

        if ( files && ! Array.isArray( files ) )
            return this.addFile( files );

        return files && files.forEach( ( file ) => {

            if ( Array.isArray( file ) )
                return this.addFiles( file );
            return this.addFile( file );

        } );

    },

    addFile( filepath ) {

        const file = filepath.file || filepath;
        const type = filepath.type || FileLoader.getExtension( file );
        const name = filepath.name || FileLoader.getFilename( file );
        if ( this.files.indexOf( file ) < 0 ) {

            this.files.push( file );
            this.items.push( { file, type, name } );

        }

    },

    load() {

        const promises = [];
        const names = [];

        this.items.forEach( ( item ) => {

            const { name, file, type } = item;
            if ( ! FileLoader.types[ type ] )
                throw new Error( `unsupport file format ".${type}", file path: ${file}` );

            const promise = FileLoader.types[ type ]( file );
            promises.push( promise );
            names.push( name );

        } );

        return Promise.all( promises )
            .then( ( files ) => {

                const result = {};
                files.forEach( ( file, idx ) => {

                    result[ names[ idx ] ] = file;

                } );

                return Promise.resolve( result );

            } );

    },

} );

Object.assign( FileLoader, {

    decodeText( array ) {

        if ( typeof TextDecoder !== 'undefined' )
            return new TextDecoder().decode( array );

        let s = '';
        for ( let i = 0, il = array.length; i < il; i ++ )
            s += String.fromCharCode( array[ i ] );

        return decodeURIComponent( escape( s ) );

    },

    types: {

        obj( file ) {

            return fetch( file )
                .then( response => response.text() );

        },

        gltf( file ) {

            return fetch( file )
                .then( response => response.json() )
                .then( ( json ) => {

                    const buffers = json.buffers;
                    const loader = new FileLoader();
                    const basepath = FileLoader.getBasepath( file );

                    for ( let i = 0; i < buffers.length; i ++ ) {

                        const uri = buffers[ i ].uri;
                        if ( uri.startsWith( 'data:' ) ) continue;

                        const filepath = basepath + uri;
                        loader.addFile( { file: filepath, type: 'gltf_bin', name: uri } );

                    }

                    const images = json.images || [];
                    const imageRes = {};
                    for ( let i = 0; i < images.length; i ++ ) {

                        const uri = images[ i ].uri;
                        if ( ! uri || uri.startsWith( 'data:' ) ) continue;

                        const filepath = basepath + uri;
                        imageRes[ uri ] = filepath;

                    }

                    return loader.load().then( ( files ) => {

                        Object.assign( files, imageRes );
                        json.resources = files; // eslint-disable-line
                        return json;

                    } );

                } );

        },

        gltf_bin( file ) {

            return fetch( file )
                .then( response => response.arrayBuffer() );

        },

        glb( file ) {

            return fetch( file )
                .then( response => response.arrayBuffer() )
                .then( ( arrayBuffer ) => {

                    const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
                    const BINARY_EXTENSION_HEADER_LENGTH = 12;
                    const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

                    let content = null;
                    let body = null;

                    const headerView = new DataView( arrayBuffer, 0, BINARY_EXTENSION_HEADER_LENGTH );

                    this.header = {
                        magic: FileLoader.decodeText( new Uint8Array( arrayBuffer.slice( 0, 4 ) ) ),
                        version: headerView.getUint32( 4, true ),
                        length: headerView.getUint32( 8, true ),
                    };

                    if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC )
                        throw new Error( 'GLTFLoader: Unsupported glTF-Binary header.' );
                    else if ( this.header.version < 2.0 )
                        throw new Error( 'GLTFLoader: Legacy binary file detected. Use LegacyGLTFLoader instead.' );

                    const chunkView = new DataView( arrayBuffer, BINARY_EXTENSION_HEADER_LENGTH );
                    let chunkIndex = 0;

                    while ( chunkIndex < chunkView.byteLength ) {

                        const chunkLength = chunkView.getUint32( chunkIndex, true );
                        chunkIndex += 4;

                        const chunkType = chunkView.getUint32( chunkIndex, true );
                        chunkIndex += 4;

                        if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

                            const contentArray = new Uint8Array( arrayBuffer, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
                            content = FileLoader.decodeText( contentArray );

                        } else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

                            const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
                            body = arrayBuffer.slice( byteOffset, byteOffset + chunkLength );

                        }

                        chunkIndex += chunkLength;

                    }

                    if ( content ) {

                        const json = JSON.parse( content );
                        if ( json.buffers && body )
                            for ( let i = 0; i < json.buffers.length; i ++ ) {

                                const buffer = json.buffers[ i ];
                                if ( typeof buffer.uri === 'undefined' ) {

                                    buffer.isParsed = true;
                                    buffer.dbuffer = body;

                                }

                            }

                        // load outer resource
                        const buffers = json.buffers;
                        const loader = new FileLoader();
                        const basepath = FileLoader.getBasepath( file );

                        for ( let i = 0; i < buffers.length; i ++ ) {

                            if ( buffers[ i ].isParsed ) continue;
                            const uri = buffers[ i ].uri;
                            if ( uri.startsWith( 'data:' ) ) continue;

                            const filepath = basepath + uri;
                            loader.addFile( { file: filepath, type: 'gltf_bin', name: uri } );

                        }

                        const images = json.images || [];
                        const imageRes = {};
                        for ( let i = 0; i < images.length; i ++ ) {

                            const uri = images[ i ].uri;
                            if ( ! uri || uri.startsWith( 'data:' ) ) continue;

                            const filepath = basepath + uri;
                            imageRes[ uri ] = filepath;

                        }

                        return loader.load().then( ( files ) => {

                            Object.assign( files, imageRes );
                                    json.resources = files; // eslint-disable-line
                            return json;

                        } );

                    }

                    throw new Error( 'GLTFLoader: bin file do not have gltf json.' );

                } );

        },

    },
} );

export { FileLoader };
