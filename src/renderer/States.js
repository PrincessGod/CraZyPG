
const cached = {

    pixelStorei: {},
    lastPixelStorei: {},

};

function States( gl ) {

    this._gl = gl;

    const { pixelStorei, lastPixelStorei } = cached;

    pixelStorei.unpackAlignment = gl.getParameter( gl.UNPACK_ALIGNMENT );
    pixelStorei.colorspaceConversion = gl.getParameter( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL );
    pixelStorei.premultiplyAlpha = gl.getParameter( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL );
    pixelStorei.flipY = gl.getParameter( gl.UNPACK_FLIP_Y_WEBGL );
    lastPixelStorei.unpackAlignment = pixelStorei.unpackAlignment;
    lastPixelStorei.colorspaceConversion = pixelStorei.colorspaceConversion;
    lastPixelStorei.premultiplyAlpha = pixelStorei.premultiplyAlpha;
    lastPixelStorei.flipY = pixelStorei.flipY;

}

Object.assign( States.prototype, {

    savePixelStoreStates( opts ) {

        if ( opts.unpackAlignment !== undefined && opts.unpackAlignment !== cached.pixelStorei.unpackAlignment ) {

            cached.lastPixelStorei.unpackAlignment = cached.pixelStorei.unpackAlignment;
            this._gl.pixelStorei( this._gl.UNPACK_ALIGNMENT, opts.unpackAlignment );
            cached.pixelStorei.unpackAlignment = opts.unpackAlignment;

        }
        if ( opts.colorspaceConversion !== undefined && opts.colorspaceConversion !== cached.pixelStorei.colorspaceConversion ) {

            cached.lastPixelStorei.colorspaceConversion = cached.pixelStorei.colorspaceConversion;
            this._gl.pixelStorei( this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, opts.colorspaceConversion );
            cached.pixelStorei.colorspaceConversion = opts.colorspaceConversion;

        }
        if ( opts.premultiplyAlpha !== undefined && opts.premultiplyAlpha !== cached.pixelStorei.premultiplyAlpha ) {

            cached.lastPixelStorei.premultiplyAlpha = cached.pixelStorei.premultiplyAlpha;
            this._gl.pixelStorei( this._gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL, opts.premultiplyAlpha );
            cached.pixelStorei.premultiplyAlpha = opts.premultiplyAlpha;

        }
        if ( opts.flipY !== undefined && opts.flipY !== cached.pixelStorei.flipY ) {

            cached.lastPixelStorei.flipY = cached.pixelStorei.flipY;
            this._gl.pixelStorei( this._gl.UNPACK_FLIP_Y_WEBGL, opts.flipY );
            cached.pixelStorei.flipY = opts.flipY;

        }

    },

    restorePixelStoreState() {

        if ( cached.pixelStorei.unpackAlignment !== cached.lastPixelStorei.unpackAlignment ) {

            this._gl.pixelStorei( this._gl.UNPACK_ALIGNMENT, cached.lastPixelStorei.unpackAlignment );
            cached.pixelStorei.unpackAlignment = cached.lastPixelStorei.unpackAlignment;

        }
        if ( cached.pixelStorei.colorspaceConversion !== cached.lastPixelStorei.colorspaceConversion ) {

            this._gl.pixelStorei( this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, cached.lastPixelStorei.colorspaceConversion );
            cached.pixelStorei.colorspaceConversion = cached.lastPixelStorei.colorspaceConversion;

        }
        if ( cached.pixelStorei.premultiplyAlpha !== cached.lastPixelStorei.premultiplyAlpha ) {

            this._gl.pixelStorei( this._gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL, cached.lastPixelStorei.premultiplyAlpha );
            cached.pixelStorei.premultiplyAlpha = cached.lastPixelStorei.premultiplyAlpha;

        }
        if ( cached.pixelStorei.flipY !== cached.lastPixelStorei.flipY ) {

            this._gl.pixelStorei( this._gl.UNPACK_FLIP_Y_WEBGL, cached.lastPixelStorei.flipY );
            cached.pixelStorei.flipY = cached.lastPixelStorei.flipY;

        }

    },

} );

export { States };
