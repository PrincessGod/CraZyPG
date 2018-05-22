function ImageLoader() {

    this.crossOrigin = 'Anonymous';

}

Object.assign( ImageLoader.prototype, {

    load( url, cb ) {

        let img = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' );
        if ( this.crossOrigin )
            img.crossOrigin = this.crossOrigin;

        function clearEventHandlers() {

            img.removeEventListener( 'error', onError ); // eslint-disable-line
            img.removeEventListener( 'load', onLoad ); // eslint-disable-line
            img = null;

        }

        function onError() {

            const msg = `couldn't load image: ${url}`;
            cb( msg, img );
            clearEventHandlers();

        }

        function onLoad() {

            cb( null, img );
            clearEventHandlers();

        }

        img.addEventListener( 'error', onError );
        img.addEventListener( 'load', onLoad );
        img.src = url;

    },

    setCrossOrigin( cros ) {

        this.crossOrigin = cros;
        return this;

    },

} );

export { ImageLoader };
