const FileLoader = {};

Object.assign( FileLoader, {

    load( path ) {

        return fetch( path )
            .then( response => response.text() );

    },

} );

export { FileLoader };
