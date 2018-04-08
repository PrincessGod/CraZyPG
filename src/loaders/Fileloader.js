
function FileLoader( ...files ) {

    this.files = [];
    this.addFile( ...files );

}

Object.assign( FileLoader.prototype, {

    addFile( ...files ) {

        files.forEach( ( ele ) => { // eslint-disable-line

            if ( Array.isArray( ele ) )
                return this.addFile( ...ele );

        } );

        if ( this.files.indexOf( files[ 0 ] ) < 0 )
            this.files.push( ...files );

    },

    load() {

        const promises = [];

        this.files.forEach( ( file ) => {

            const type = file.split( '.' ).pop().toLowerCase();
            const promise = FileLoader.types[ type ]( file );
            promises.push( promise );

        } );

        return Promise.all( promises );

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
                .then( response => response.json() );

        },

    },
} );

export { FileLoader };
