/* eslint no-loop-func: 0  */

function ImageLoader() {

    this.crossOrigin = 'Anonymous';

}

Object.assign( ImageLoader.prototype, {

    load( url, cb ) {

        const crossOrigin = this.crossOrigin;

        function loadImg( src, cbb ) {

            let img = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' );
            if ( crossOrigin )
                img.crossOrigin = crossOrigin;

            function clearEventHandlers() {

                img.removeEventListener( 'error', onError ); // eslint-disable-line
                img.removeEventListener( 'load', onLoad ); // eslint-disable-line
                img = null;

            }

            function onError() {

                const msg = `couldn't load image: ${src}`;
                cbb( msg, img );
                clearEventHandlers();

            }

            function onLoad() {

                cbb( null, img );
                clearEventHandlers();

            }

            img.addEventListener( 'error', onError );
            img.addEventListener( 'load', onLoad );
            img.src = src;

        }

        function loadImgs( src, cbb ) {

            let urls = [];
            if ( ! Array.isArray( src[ 0 ] ) )
                urls.push( src );
            else
                urls = src;

            let loading = urls[ 0 ].length * urls[ 0 ][ 0 ].length;
            let loaded = 0;
            const results = [];
            for ( let x = 0; x < urls.length; x ++ ) {

                results.push( [] );
                for ( let y = 0; y < urls[ x ].length; y ++ )

                    loadImg( urls[ x ][ y ], ( err, img ) => {

                        loading -= 1;
                        loaded += 1;
                        if ( ! err ) {

                            results[ x ][ y ] = img;
                            cbb( err, {
                                results, img, x, y, loading, loaded,
                            } );

                        }

                    } );

            }

        }

        if ( typeof url === 'string' )
            return loadImg( url, cb );
        else if ( Array.isArray( url ) )
            return loadImgs( url, cb );

        throw Error( `unsupported url: ${url}` );

    },

    setCrossOrigin( cros ) {

        this.crossOrigin = cros;
        return this;

    },

} );

export { ImageLoader };
