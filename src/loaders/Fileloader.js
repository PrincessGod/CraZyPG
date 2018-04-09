
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

                    return loader.load().then( ( files ) => {

                        json.resources = files; // eslint-disable-line
                        return json;

                    } );

                } );

        },

        gltf_bin( file ) {

            return fetch( file )
                .then( response => response.arrayBuffer() );

        },

    },
} );

export { FileLoader };
