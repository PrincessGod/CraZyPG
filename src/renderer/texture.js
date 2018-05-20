import { isArrayBuffer, getGLTypeFromTypedArray, getTypedArrayTypeFromGLType } from '../core/typedArray';
import { isWebGL2, glEnumToString } from './utils';
import { DefaultColor, GLDataType, PixelFormat, TextureFormat, FrameBufferFormat } from '../core/constant';

const defaults = {
    textureColor: DefaultColor.Foreground,
    textureOptions: {},
};

const textureInternalFormatInfo = {};
{

    // NOTE: these properties need unique names so we can let Uglify mangle the name.
    const t = textureInternalFormatInfo;
    // unsized formats
    t[ PixelFormat.ALPHA ] = {
        textureFormat: PixelFormat.ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 1, 2, 2, 4 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.HALF_FLOAT, GLDataType.HALF_FLOAT_OES, GLDataType.FLOAT ],
    };
    t[ PixelFormat.LUMINANCE ] = {
        textureFormat: PixelFormat.LUMINANCE, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 1, 2, 2, 4 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.HALF_FLOAT, GLDataType.HALF_FLOAT_OES, GLDataType.FLOAT ],
    };
    t[ PixelFormat.LUMINANCE_ALPHA ] = {
        textureFormat: PixelFormat.LUMINANCE_ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 2, 4, 4, 8 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.HALF_FLOAT, GLDataType.HALF_FLOAT_OES, GLDataType.FLOAT ],
    };
    t[ PixelFormat.RGB ] = {
        textureFormat: PixelFormat.RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 3, 6, 6, 12, 2 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.HALF_FLOAT, GLDataType.HALF_FLOAT_OES, GLDataType.FLOAT, GLDataType.UNSIGNED_SHORT_5_6_5 ],
    };
    t[ PixelFormat.RGBA ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 8, 8, 16, 2, 2 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.HALF_FLOAT, GLDataType.HALF_FLOAT_OES, GLDataType.FLOAT, GLDataType.UNSIGNED_SHORT_4_4_4_4, GLDataType.UNSIGNED_SHORT_5_5_5_1 ],
    };

    // sized formats
    t[ PixelFormat.R8 ] = {
        textureFormat: TextureFormat.RED, colorRenderable: true, textureFilterable: true, bytesPerElement: 1, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.R8_SNORM ] = {
        textureFormat: TextureFormat.RED, colorRenderable: false, textureFilterable: true, bytesPerElement: 1, type: GLDataType.BYTE,
    };
    t[ PixelFormat.R16F ] = {
        textureFormat: TextureFormat.RED, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 4, 2 ], type: [ GLDataType.FLOAT, GLDataType.HALF_FLOAT ],
    };
    t[ PixelFormat.R32F ] = {
        textureFormat: TextureFormat.RED, colorRenderable: false, textureFilterable: false, bytesPerElement: 4, type: GLDataType.FLOAT,
    };
    t[ PixelFormat.R8UI ] = {
        textureFormat: TextureFormat.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.R8I ] = {
        textureFormat: TextureFormat.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: GLDataType.BYTE,
    };
    t[ PixelFormat.R16UI ] = {
        textureFormat: TextureFormat.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: GLDataType.UNSIGNED_SHORT,
    };
    t[ PixelFormat.R16I ] = {
        textureFormat: TextureFormat.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: GLDataType.SHORT,
    };
    t[ PixelFormat.R32UI ] = {
        textureFormat: TextureFormat.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.UNSIGNED_INT,
    };
    t[ PixelFormat.R32I ] = {
        textureFormat: TextureFormat.RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.INT,
    };
    t[ PixelFormat.RG8 ] = {
        textureFormat: TextureFormat.RG, colorRenderable: true, textureFilterable: true, bytesPerElement: 2, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.RG8_SNORM ] = {
        textureFormat: TextureFormat.RG, colorRenderable: false, textureFilterable: true, bytesPerElement: 2, type: GLDataType.BYTE,
    };
    t[ PixelFormat.RG16F ] = {
        textureFormat: TextureFormat.RG, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 8, 4 ], type: [ GLDataType.FLOAT, GLDataType.HALF_FLOAT ],
    };
    t[ PixelFormat.RG32F ] = {
        textureFormat: TextureFormat.RG, colorRenderable: false, textureFilterable: false, bytesPerElement: 8, type: GLDataType.FLOAT,
    };
    t[ PixelFormat.RG8UI ] = {
        textureFormat: TextureFormat.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.RG8I ] = {
        textureFormat: TextureFormat.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: GLDataType.BYTE,
    };
    t[ PixelFormat.RG16UI ] = {
        textureFormat: TextureFormat.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.UNSIGNED_SHORT,
    };
    t[ PixelFormat.RG16I ] = {
        textureFormat: TextureFormat.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.SHORT,
    };
    t[ PixelFormat.RG32UI ] = {
        textureFormat: TextureFormat.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: GLDataType.UNSIGNED_INT,
    };
    t[ PixelFormat.RG32I ] = {
        textureFormat: TextureFormat.RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: GLDataType.INT,
    };
    t[ PixelFormat.RGB8 ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: 3, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.SRGB8 ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.RGB565 ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 3, 2 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.UNSIGNED_SHORT_5_6_5 ],
    };
    t[ PixelFormat.RGB8_SNORM ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: GLDataType.BYTE,
    };
    t[ PixelFormat.R11F_G11F_B10F ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6, 4 ], type: [ GLDataType.FLOAT, GLDataType.HALF_FLOAT, GLDataType.UNSIGNED_INT_10F_11F_11F_REV ],
    };
    t[ PixelFormat.RGB9_E5 ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6, 4 ], type: [ GLDataType.FLOAT, GLDataType.HALF_FLOAT, GLDataType.UNSIGNED_INT_5_9_9_9_REV ],
    };
    t[ PixelFormat.RGB16F ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6 ], type: [ GLDataType.FLOAT, GLDataType.HALF_FLOAT ],
    };
    t[ PixelFormat.RGB32F ] = {
        textureFormat: TextureFormat.RGB, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: GLDataType.FLOAT,
    };
    t[ PixelFormat.RGB8UI ] = {
        textureFormat: TextureFormat.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.RGB8I ] = {
        textureFormat: TextureFormat.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: GLDataType.BYTE,
    };
    t[ PixelFormat.RGB16UI ] = {
        textureFormat: TextureFormat.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: GLDataType.UNSIGNED_SHORT,
    };
    t[ PixelFormat.RGB16I ] = {
        textureFormat: TextureFormat.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: GLDataType.SHORT,
    };
    t[ PixelFormat.RGB32UI ] = {
        textureFormat: TextureFormat.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: GLDataType.UNSIGNED_INT,
    };
    t[ PixelFormat.RGB32I ] = {
        textureFormat: TextureFormat.RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: GLDataType.INT,
    };
    t[ PixelFormat.RGBA8 ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.SRGB8_ALPHA8 ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.RGBA8_SNORM ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: 4, type: GLDataType.BYTE,
    };
    t[ PixelFormat.RGB5_A1 ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 2, 4 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.UNSIGNED_SHORT_5_5_5_1, GLDataType.UNSIGNED_INT_2_10_10_10_REV ],
    };
    t[ PixelFormat.RGBA4 ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 2 ], type: [ GLDataType.UNSIGNED_BYTE, GLDataType.UNSIGNED_SHORT_4_4_4_4 ],
    };
    t[ PixelFormat.RGB10_A2 ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: GLDataType.UNSIGNED_INT_2_10_10_10_REV,
    };
    t[ PixelFormat.RGBA16F ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 16, 8 ], type: [ GLDataType.FLOAT, GLDataType.HALF_FLOAT ],
    };
    t[ PixelFormat.RGBA32F ] = {
        textureFormat: PixelFormat.RGBA, colorRenderable: false, textureFilterable: false, bytesPerElement: 16, type: GLDataType.FLOAT,
    };
    t[ PixelFormat.RGBA8UI ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.UNSIGNED_BYTE,
    };
    t[ PixelFormat.RGBA8I ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.BYTE,
    };
    t[ PixelFormat.RGB10_A2UI ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.UNSIGNED_INT_2_10_10_10_REV,
    };
    t[ PixelFormat.RGBA16UI ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: GLDataType.UNSIGNED_SHORT,
    };
    t[ PixelFormat.RGBA16I ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: GLDataType.SHORT,
    };
    t[ PixelFormat.RGBA32I ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: GLDataType.INT,
    };
    t[ PixelFormat.RGBA32UI ] = {
        textureFormat: TextureFormat.RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: GLDataType.UNSIGNED_INT,
    };
    // Sized Internal
    t[ FrameBufferFormat.DEPTH_COMPONENT16 ] = {
        textureFormat: PixelFormat.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [ 2, 4 ], type: [ GLDataType.UNSIGNED_SHORT, GLDataType.UNSIGNED_INT ],
    };
    t[ FrameBufferFormat.DEPTH_COMPONENT24 ] = {
        textureFormat: PixelFormat.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.UNSIGNED_INT,
    };
    t[ FrameBufferFormat.DEPTH_COMPONENT32F ] = {
        textureFormat: PixelFormat.DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.FLOAT,
    };
    t[ FrameBufferFormat.DEPTH24_STENCIL8 ] = {
        textureFormat: PixelFormat.DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.UNSIGNED_INT_24_8,
    };
    t[ FrameBufferFormat.DEPTH32F_STENCIL8 ] = {
        textureFormat: PixelFormat.DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: GLDataType.FLOAT_32_UNSIGNED_INT_24_8_REV,
    };

    Object.keys( t ).forEach( ( internalFormat ) => {

        const info = t[ internalFormat ];
        info.bytesPerElementMap = {};
        if ( Array.isArray( info.bytesPerElement ) )
            info.bytesPerElement.forEach( ( bytesPerElement, ndx ) => {

                const type = info.type[ ndx ];
                info.bytesPerElementMap[ type ] = bytesPerElement;

            } );
        else {

            const { type } = info;
            info.bytesPerElementMap[ type ] = info.bytesPerElement;

        }

    } );

}

function empty() {
}

function getFormatAndTypeFromInternalFormat( internalFormat ) {

    const info = textureInternalFormatInfo[ internalFormat ];

    if ( ! info )
        throw new Error( 'unknown internal format' );


    return {
        format: info.textureFormat,
        type: Array.isArray( info.type ) ? info.type[ 0 ] : info.type,
    };

}

function make1Pixel( color ) {

    const colorUsed = color || defaults.textureColor;
    if ( isArrayBuffer( colorUsed ) ) return colorUsed;
    return new Uint8Array( [ colorUsed[ 0 ], colorUsed[ 1 ], colorUsed[ 2 ], colorUsed[ 3 ] ] );

}

function setTextureTo1PixelColor( gl, tex, options ) {

    const opts = options || defaults.textureOptions;
    const target = opts.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    if ( opts.color === false ) return;

    const color = make1Pixel( options.color );
    if ( target === gl.TEXTURE_CUBE_MAP )
        for ( let i = 0; i < 6; i ++ )
            gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color );
    else if ( target === gl.TEXTURE_3D || target === gl.TEXTURE_2D_ARRAY )
        gl.texImage3D( target, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color );
    else
        gl.texImage2D( target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color );

}

const getDefaultCrossOrigin = ( function () {

    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; // eslint-disable-line
    const regex = new RegExp( expression );

    return function getDefaultCrossOrigin( url ) { // eslint-disable-line

        if ( url.match( regex ) && ( new URL( url ) ).origin !== window.location.origin )
            return 'anonymous';

        return undefined;

    };

}() );

function loadImage( url, crossOrigin, callback ) {

    const cb = callback || empty;
    let img = new Image();
    const cors = crossOrigin !== undefined ? crossOrigin : getDefaultCrossOrigin( url );
    if ( cors !== undefined )
        img.crossOrigin = cors;


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
    return img;

}

const lastPackState = {};

function savePatcState( gl, options ) {

    if ( options.colorspaceConversion !== undefined ) {

        lastPackState.colorspaceConversion = gl.getParameter( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL );
        gl.pixelStorei( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, options.colorspaceConversion );

    }
    if ( options.premultiplyAlpha !== undefined ) {

        lastPackState.premultiplyAlpha = gl.getParameter( gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL );
        gl.pixelStorei( gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha );

    }
    if ( options.flipY !== undefined ) {

        lastPackState.flipY = gl.getParameter( gl.UNPACK_FLIP_Y_WEBGL );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, options.flipY );

    }

}

function restorePackState( gl, options ) {

    if ( options.colorspaceConversion !== undefined )
        gl.pixelStorei( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, lastPackState.colorspaceConversion );
    if ( options.premultiplyAlpha !== undefined )
        gl.pixelStorei( gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL, lastPackState.premultiplyAlpha );
    if ( options.flipY !== undefined )
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, lastPackState.flipY );

}

function getCubeFacesOrder( gl, options ) {

    const opts = options || {};
    return opts.cubeFaceOrder || [
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];

}

function getCubeFacesWithIdx( gl, options ) {

    const faces = getCubeFacesOrder( gl, options );

    const facesWithIdx = faces.map( ( face, idx ) => ( { face, idx } ) );

    facesWithIdx.sort( ( a, b ) => ( a.face - b.face ) );

    return facesWithIdx;

}

function shouldAutoSetTextureFiltering( options ) {

    return options.auto === true || ( options.auto === undefined && options.level === undefined );

}

function isPowerOf2( value ) {

    return ( value & ( value - 1 ) ) === 0;

}

function canGenerateMipmap( gl, width, height, internalFormat ) {

    if ( ! isWebGL2( gl ) )
        return isPowerOf2( width ) && isPowerOf2( height );

    const info = textureInternalFormatInfo[ internalFormat ];
    if ( ! info )
        throw new Error( 'unknown internal format' );
    return info.colorRenderable && info.textureFilterable;

}

function canFilter( internalFormat ) {

    const info = textureInternalFormatInfo[ internalFormat ];
    if ( ! info )
        throw new Error( 'unknow internal format' );

    return info.textureFilterable;

}

function setTextureFiltering( gl, tex, options, widthP, heightP, internalFormatP, typeP ) {

    const opts = options || defaults.textureOptions;
    const internalFormat = internalFormatP || gl.RGBA;
    const type = typeP || gl.UNSIGNED_SHORT;
    const target = opts.target || gl.TEXTURE_2D;
    const width = widthP || opts.width;
    const height = heightP || opts.height;
    gl.bindTexture( target, tex );
    if ( canGenerateMipmap( gl, width, height, internalFormat, type ) )
        gl.generateMipmap( target );
    else {

        const filtering = canFilter( internalFormat ) ? gl.LINEAR : gl.NEAREST;
        gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, filtering );
        gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, filtering );
        gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

}

const WebGLSamplerCtor = window.WebGLSampler || function NoWebGLSampler() {};

function setTextureSamplerParameters( gl, target, parameteriFn, options ) {

    if ( options.minMag ) {

        parameteriFn.call( gl, target, gl.TEXTURE_MIN_FILTER, options.minMag );
        parameteriFn.call( gl, target, gl.TEXTURE_MAG_FILTER, options.minMag );

    }

    if ( options.min )
        parameteriFn.call( gl, target, gl.TEXTURE_MIN_FILTER, options.min );

    if ( options.mag )
        parameteriFn.call( gl, target, gl.TEXTURE_MAG_FILTER, options.mag );

    if ( options.wrap ) {

        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_S, options.wrap );
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_T, options.wrap );
        if ( target === gl.TEXTURE_3D || target instanceof WebGLSamplerCtor )
            parameteriFn.call( gl, target, gl.TEXTURE_WRAP_R, options.wrap );

    }

    if ( options.wrapR )
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_R, options.wrapR );

    if ( options.wrapS )
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_S, options.wrapS );

    if ( options.wrapT )
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_T, options.wrapT );

    if ( options.minLod )
        parameteriFn.call( gl, target, gl.TEXTURE_MIN_LOD, options.minLod );

    if ( options.maxLod )
        parameteriFn.call( gl, target, gl.TEXTURE_MAX_LOD, options.maxLod );

    if ( options.baseLevel )
        parameteriFn.call( gl, target, gl.TEXTURE_BASE_LEVEL, options.baseLevel );

    if ( options.maxLevel )
        parameteriFn.call( gl, target, gl.TEXTURE_MAX_LEVEL, options.maxLevel );

}

function setTextureParameters( gl, tex, options ) {

    const target = options.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    setTextureSamplerParameters( gl, target, gl.texParameteri, options );

}

const ctx = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ).getContext( '2d' );

function setTextureFromElement( gl, tex, element, options ) {

    const opts = options || defaults.textureOptions;
    const target = opts.target || gl.TEXTURE_2D;
    const level = opts.level || 0;
    let { width, height } = element;
    const internalFormat = opts.internalFormat || opts.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = opts.format || formatType.format;
    const type = opts.type || formatType.type;

    savePatcState( gl, opts );
    gl.bindTexture( target, tex );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        const imgWidth = element.width;
        const imgHeight = element.height;
        let size;
        let slices;
        if ( imgWidth / 6 === imgHeight ) {

            size = imgHeight;
            slices = [ 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0 ];

        } else if ( imgHeight / 6 === imgWidth ) {

            size = imgWidth;
            slices = [ 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5 ];

        } else if ( imgWidth / 3 === imgHeight / 2 ) {

            size = imgWidth / 3;
            slices = [ 0, 0, 1, 0, 2, 0, 0, 1, 1, 1, 2, 1 ];

        } else if ( imgWidth / 2 === imgHeight / 3 ) {

            size = imgWidth / 2;
            slices = [ 0, 0, 1, 0, 0, 1, 1, 1, 0, 2, 1, 2 ];

        } else
            throw new Error( `can't guess cube map from element: ${element.src ? element.src : element.nodeName}` );

        ctx.canvas.width = size;
        ctx.canvas.height = size;
        width = size;
        height = size;

        getCubeFacesWithIdx( gl, options ).forEach( ( f ) => {

            const xOffset = slices[ ( f.idx * 2 ) + 0 ] * size;
            const yOffset = slices[ ( f.idx * 2 ) + 1 ] * size;
            ctx.drawImage( element, xOffset, yOffset, size, size, 0, 0, size, size );
            gl.texImage2D( f.face, level, internalFormat, format, type, ctx.canvas );

        } );

        ctx.canvas.width = 1;
        ctx.canvas.height = 1;

    } else if ( target === gl.TEXTURE_3D ) {

        const smallest = Math.min( element.width, element, height );
        const largest = Math.max( element.width, element.height );
        const depth = largest / smallest;
        if ( depth % 1 !== 0 )
            throw new Error( 'can not compute TEXTURE_3D dimensions of element' );

        const xMult = element.width === largest ? 1 : 0;
        const yMult = element.height === largest ? 1 : 0;
        gl.texImage3D( target, level, internalFormat, smallest, smallest, smallest, 0, format, type, null );
        ctx.canvas.width = smallest;
        ctx.canvas.height = smallest;
        for ( let d = 0; d < depth; d ++ ) {

            const srcX = d * smallest * xMult;
            const srcY = d * smallest * yMult;
            const srcW = smallest;
            const srcH = smallest;
            const dstX = 0;
            const dstY = 0;
            const dstW = smallest;
            const dstH = smallest;
            ctx.drawImage( element, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH );
            gl.texSubImage3D( target, level, 0, 0, d, smallest, smallest, 1, format, type, ctx.canvas );

        }

        ctx.canvas.width = 1;
        ctx.canvas.height = 1;

    } else
        gl.texImage2D( target, level, internalFormat, format, type, element );

    restorePackState( gl, options );

    if ( shouldAutoSetTextureFiltering( opts ) )
        setTextureFiltering( gl, tex, options, width, height, internalFormat, type );

    setTextureParameters( gl, tex, options );
    return tex;

}

function loadTextureFromUrl( gl, tex, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    setTextureTo1PixelColor( gl, tex, opts );
    const asyncOpts = Object.assign( {}, opts );
    const img = loadImage( opts.src, asyncOpts.crossOrigin, ( err, imgBK ) => {

        if ( err )
            cb( err, tex, img );
        else {

            setTextureFromElement( gl, tex, imgBK, asyncOpts );
            cb( null, tex, imgBK );

        }

    } );
    return img;

}

function getTextureTypeFromArrayType( gl, src, defaultType ) {

    if ( isArrayBuffer( src ) )
        return getGLTypeFromTypedArray( src );

    return defaultType || gl.UNSIGNED_BYTE;

}

function getBytesPerElementForInternalFromat( internalFormat, type ) {

    const info = textureInternalFormatInfo[ internalFormat ];
    if ( ! info )
        throw new Error( 'unknown internal format' );
    const bytesPerElement = info.bytesPerElementMap[ type ];
    if ( bytesPerElement === undefined )
        throw new Error( 'unknown internal format' );
    return bytesPerElement;

}

function guessDimensions( gl, target, width, height, numElements ) {

    if ( numElements % 1 !== 0 )
        throw new Error( 'can\'t guess dimensions' );

    let cWith;
    let cHeight;
    if ( ! width && ! height ) {

        const size = Math.sqrt( numElements / ( target === gl.TEXTURE_CUBE_MAP ? 6 : 1 ) );
        if ( size % 1 === 0 ) {

            cWith = size;
            cHeight = size;

        } else {

            cWith = numElements;
            cHeight = 1;

        }

    } else if ( ! height ) {

        cHeight = numElements / width;
        if ( cHeight % 1 )
            throw new Error( 'can\'t guess dimensions' );

    } else if ( ! width ) {

        cWith = numElements / height;
        if ( cWith % 1 )
            throw new Error( 'can\'t guess dimensions' );

    }

    return {
        width: cWith,
        height: cHeight,
    };

}

function setTextureFromArray( gl, tex, src, options ) {

    const opts = options || defaults.textureOptions;
    const target = opts.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    let { width, height, depth } = opts;
    const level = opts.level || 0;
    const internalFormat = opts.internalFormat || opts.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = opts.format || formatType.format;
    const type = opts.format || getTextureTypeFromArrayType( gl, src, formatType.type );
    let typedSrc = src;
    if ( ! isArrayBuffer( typedSrc ) ) {

        const Type = getTypedArrayTypeFromGLType( type );
        typedSrc = new Type( src );

    } else if ( typedSrc instanceof Uint8ClampedArray )
        typedSrc = new Uint8Array( typedSrc.buffer );

    const bytesPerElement = getBytesPerElementForInternalFromat( internalFormat, type );
    const numElements = typedSrc.byteLength / bytesPerElement;
    if ( numElements % 1 )
        throw new Error( `length wrong for format: ${glEnumToString( gl, format )}` );

    let dimensions;
    if ( target === gl.TEXTURE_3D )
        if ( ! width && ! height && ! depth ) {

            const size = Math.cbrt( numElements );
            if ( size % 1 !== 0 )
                throw new Error( `can't guess size of array of numElements: ${numElements}` );
            width = size;
            height = size;
            depth = size;

        } else if ( width && ( ! height || ! depth ) ) {

            dimensions = guessDimensions( gl, target, height, depth, numElements / width );
            height = dimensions.width;
            depth = dimensions.height;

        } else if ( height && ( ! width || ! depth ) ) {

            dimensions = guessDimensions( gl, target, width, depth, numElements / height );
            width = dimensions.width;
            depth = dimensions.height;

        } else {

            dimensions = guessDimensions( gl, target, width, height, numElements / depth );
            width = dimensions.width;
            height = dimensions.height;

        }
    else {

        dimensions = guessDimensions( gl, target, width, height, numElements );
        width = dimensions.width;
        height = dimensions.height;

    }


    gl.pixelStorei( gl.UNPACK_ALIGNMENT, opts.unpackAlignment || 1 );
    savePatcState( gl, options );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        const elementsPerElement = bytesPerElement / typedSrc.BYTES_PER_ELEMENT;
        const faceSize = ( numElements / 6 ) * elementsPerElement;

        getCubeFacesWithIdx( gl, options ).forEach( ( f ) => {

            const offset = faceSize * f.idx;
            const data = typedSrc.subarray( offset, offset + faceSize );
            gl.texImage2D( f.face, level, internalFormat, width, height, 0, format, type, data );

        } );

    } else if ( target === gl.TEXTURE_3D )
        gl.texImage3D( target, level, internalFormat, width, height, depth, 0, format, type, typedSrc );
    else
        gl.texImage2D( target, level, internalFormat, width, height, 0, format, type, typedSrc );


    restorePackState( gl, options );
    return {
        width,
        height,
        depth,
        type,
    };

}

function loadCubeMapFromUrls( gl, tex, options, callback ) {

    const cb = callback || empty;
    const urls = options.src;
    if ( urls.length !== 6 )
        throw new Error( 'there must be 6 urls for a cubemap' );
    const level = options.level || 0;
    const internalFormat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = options.format || formatType.format;
    const type = options.type || gl.UNSIGNED_BYTE;
    const target = options.target || gl.TEXTURE_2D;
    if ( target !== gl.TEXTURE_CUBE_MAP )
        throw new Error( 'target must be TEXTURE_CUBE_MAP' );

    setTextureTo1PixelColor( gl, tex, options );

    const opts = Object.assign( {}, options );
    let numToLoad = 6;
    const errors = [];
    const faces = getCubeFacesOrder( gl, opts );
    let imgs;

    function uploadImg( faceTarget ) {

        return function ( err, img ) {

            numToLoad -= 1;
            if ( err )
                errors.push( err );
            else {

                savePatcState( gl, opts );
                gl.bindTexture( target, tex );
                if ( numToLoad === 5 )
                    getCubeFacesOrder( gl ).forEach( ( otherTarget ) => {

                        gl.texImage2D( otherTarget, level, internalFormat, format, type, img );

                    } );
                else
                    gl.texImage2D( faceTarget, level, internalFormat, format, type, img );

                restorePackState( gl, opts );
                if ( shouldAutoSetTextureFiltering( opts ) )
                    gl.generateMipmap( target );

            }

            if ( numToLoad === 0 )
                cb( errors.length ? errors : undefined, imgs, tex );

        };

    }

    imgs = urls.map( ( url, idx ) => loadImage( url, opts.crossOrigin, uploadImg( faces[ idx ] ) ) );

}

function loadSlicesFromUrls( gl, tex, options, callback ) {

    const cb = callback || empty;
    const urls = options.src;
    const internalFormat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = options.format || formatType.format;
    const type = options.type || gl.UNSIGNED_BYTE;
    const target = options.target || gl.TEXTURE_2D_ARRAY;
    if ( target !== gl.TEXTURE_3D && target !== gl.TEXTURE_2D_ARRAY )
        throw new Error( 'target must be TEXTURE_3D or TEXTURE_2D_ARRAY' );

    setTextureTo1PixelColor( gl, tex, options );

    const opts = Object.assign( {}, options );
    let numToLoad = urls.length;
    const errors = [];
    let imgs;
    const level = opts.level || 0;
    let width = opts.width;
    let height = opts.height;
    const depth = urls.length;
    let firstImage = true;

    function uploadImg( slice ) {

        return function ( err, img ) {

            numToLoad -= 1;
            if ( err )
                errors.push( err );
            else {

                savePatcState( gl, opts );
                gl.bindTexture( target, tex );

                if ( firstImage ) {

                    firstImage = false;
                    width = opts.width || img.width;
                    height = opts.width || img.width;
                    gl.texImage3D( target, level, internalFormat, width, height, depth, 0, format, type, null );

                    for ( let s = 0; s < depth; s ++ )
                        gl.texSubImage3D( target, level, 0, 0, s, width, height, 1, format, type, img );

                } else {

                    let src = img;
                    if ( img.width !== width || img.height !== height ) {

                        src = ctx.canvas;
                        ctx.canvas.width = width;
                        ctx.canvas.height = height;
                        ctx.drawImage( img, 0, 0, width, height );

                    }

                    gl.texSubImage3D( target, level, 0, 0, slice, width, height, 1, format, type, src );

                    if ( src === ctx.canvas ) {

                        ctx.canvas.width = 0;
                        ctx.canvas.height = 0;

                    }

                }

                restorePackState( gl, opts );
                if ( shouldAutoSetTextureFiltering( opts ) )
                    gl.generateMipmap( target );


            }

            if ( numToLoad === 0 )
                cb( errors.length ? errors : undefined, imgs, tex );

        };

    }

    imgs = urls.map( ( url, idx ) => loadImage( url, opts.crossOrigin, uploadImg( idx ) ) );

}

function setEmptyTexture( gl, tex, options ) {

    const target = options.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    const level = options.level || 0;
    const internalFormat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = options.format || formatType.format;
    const type = options.type || formatType.type;

    savePatcState( gl, options );

    if ( target === gl.TEXTURE_CUBE_MAP )
        for ( let ii = 0; ii < 6; ++ ii )
            gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_X + ii, level, internalFormat, options.width, options.height, 0, format, type, null );
    else if ( target === gl.TEXTURE_3D )
        gl.texImage3D( target, level, internalFormat, options.width, options.height, options.depth, 0, format, type, null );
    else
        gl.texImage2D( target, level, internalFormat, options.width, options.height, 0, format, type, null );

    restorePackState( gl, options );

}

function createTexture( gl, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    const tex = gl.createTexture();
    const target = opts.target || gl.TEXTURE_2D;
    let width = opts.width || 1;
    let height = opts.height || 1;
    const internalFormat = opts.internalFormat || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    let type = opts.type || formatType.type;
    gl.bindTexture( target, tex );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

    const src = opts.src;
    if ( src )
        if ( typeof ( src ) === 'string' ) {

            loadTextureFromUrl( gl, tex, opts, cb );

        } else if ( isArrayBuffer( src ) ||
            ( Array.isArray( src ) && (
                typeof src[ 0 ] === 'number' ||
                Array.isArray( src[ 0 ] ) ||
                isArrayBuffer( src[ 0 ] )
            ) ) ) {

            const dimensions = setTextureFromArray( gl, tex, src, opts );
            width = dimensions.width;
            height = dimensions.height;
            type = dimensions.type;

        } else if ( Array.isArray( src ) && typeof ( src[ 0 ] ) === 'string' ) {

            if ( target === gl.TEXTURE_CUBE_MAP )
                loadCubeMapFromUrls( gl, tex, options, cb );
            else
                loadSlicesFromUrls( gl, tex, opts, cb );

        } else if ( src instanceof HTMLElement ) {

            setTextureFromElement( gl, tex, src, opts );
            width = src.width;
            height = src.height;

        } else {

            throw new Error( 'unsupported src type' );

        }
    else
        setEmptyTexture( gl, tex, opts );

    if ( shouldAutoSetTextureFiltering( options ) )
        setTextureFiltering( gl, tex, opts, width, height, internalFormat, type );

    setTextureParameters( gl, tex, opts );

    return tex;

}

function isAsyncSrc( src ) {

    return typeof src === 'string' ||
           ( Array.isArray( src ) && typeof src[ 0 ] === 'string' );

}

function createTextures( gl, textureOptions, callback ) {

    const cb = callback || empty;
    let numLoading = 0;
    const errors = [];
    const textures = [];
    const images = {};

    function callCallbackWhenReady() {

        if ( numLoading === 0 )
            setTimeout( () => {

                cb( errors.length ? errors : undefined, textures, images );

            }, 0 );

    }

    Object.keys( textureOptions ).forEach( ( name ) => {

        const options = textureOptions[ name ];

        let onLoadFn;
        if ( isAsyncSrc( options.src ) ) {

            onLoadFn = function ( err, tex, img ) {

                images[ name ] = img;
                numLoading -= 1;
                if ( err )
                    errors.push( err );

                callCallbackWhenReady();

            };

            numLoading += 1;

        }

        textures[ name ] = createTexture( gl, options, onLoadFn );

    } );

    callCallbackWhenReady();

    return textures;

}

function resizeTexture( gl, tex, options, width = options.width, height = options.height ) {

    const target = options.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    const level = options.level || 0;
    const internalFormat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = options.format || formatType.format;
    let type;
    const src = options.src;

    if ( src && ( isArrayBuffer( src ) || ( Array.isArray( src ) && typeof ( src[ 0 ] ) === 'number' ) ) )
        type = options.type || getTextureTypeFromArrayType( gl, src, formatType.type );
    else
        type = options.type || formatType.type;

    if ( target === gl.TEXTURE_CUBE_MAP )
        for ( let i = 0; i < 6; i ++ )
            gl.texImage2D( gl.TEXTURE_CUBE_MAP_NEGATIVE_X + i, level, internalFormat, width, height, 0, format, type, null );
    else
        gl.texImage2D( target, level, internalFormat, width, height, 0, format, type, null );

}

export { createTexture, createTextures, resizeTexture };
