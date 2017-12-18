import { isArrayBuffer, getGLTypeFromTypedArray, getTypedArrayTypeFromGLType } from './typedArray';
import { isWebgl2, glEnumToString } from './utils';

const defaults = {
    textureColor: new Uint8Array( [ 255, 105, 180, 255 ] ),
    textureOptions: {},
    crossOrigin: undefined,
};

/* PixelFormat */
const ALPHA = 0x1906;
const RGB = 0x1907;
const RGBA = 0x1908;
const LUMINANCE = 0x1909;
const LUMINANCE_ALPHA = 0x190A;
const DEPTH_COMPONENT = 0x1902;
const DEPTH_STENCIL = 0x84F9;

const R8 = 0x8229;
const R8_SNORM = 0x8F94;
const R16F = 0x822D;
const R32F = 0x822E;
const R8UI = 0x8232;
const R8I = 0x8231;
const RG16UI = 0x823A;
const RG16I = 0x8239;
const RG32UI = 0x823C;
const RG32I = 0x823B;
const RG8 = 0x822B;
const RG8_SNORM = 0x8F95;
const RG16F = 0x822F;
const RG32F = 0x8230;
const RG8UI = 0x8238;
const RG8I = 0x8237;
const R16UI = 0x8234;
const R16I = 0x8233;
const R32UI = 0x8236;
const R32I = 0x8235;
const RGB8 = 0x8051;
const SRGB8 = 0x8C41;
const RGB565 = 0x8D62;
const RGB8_SNORM = 0x8F96;
const R11F_G11F_B10F = 0x8C3A;
const RGB9_E5 = 0x8C3D;
const RGB16F = 0x881B;
const RGB32F = 0x8815;
const RGB8UI = 0x8D7D;
const RGB8I = 0x8D8F;
const RGB16UI = 0x8D77;
const RGB16I = 0x8D89;
const RGB32UI = 0x8D71;
const RGB32I = 0x8D83;
const RGBA8 = 0x8058;
const SRGB8_ALPHA8 = 0x8C43;
const RGBA8_SNORM = 0x8F97;
const RGB5_A1 = 0x8057;
const RGBA4 = 0x8056;
const RGB10_A2 = 0x8059;
const RGBA16F = 0x881A;
const RGBA32F = 0x8814;
const RGBA8UI = 0x8D7C;
const RGBA8I = 0x8D8E;
const RGB10_A2UI = 0x906F;
const RGBA16UI = 0x8D76;
const RGBA16I = 0x8D88;
const RGBA32I = 0x8D82;
const RGBA32UI = 0x8D70;

const DEPTH_COMPONENT16 = 0x81A5;
const DEPTH_COMPONENT24 = 0x81A6;
const DEPTH_COMPONENT32F = 0x8CAC;
const DEPTH32F_STENCIL8 = 0x8CAD;
const DEPTH24_STENCIL8 = 0x88F0;

/* DataType */
const BYTE = 0x1400;
const UNSIGNED_BYTE = 0x1401;
const SHORT = 0x1402;
const UNSIGNED_SHORT = 0x1403;
const INT = 0x1404;
const UNSIGNED_INT = 0x1405;
const FLOAT = 0x1406;
const UNSIGNED_SHORT_4_4_4_4 = 0x8033;
const UNSIGNED_SHORT_5_5_5_1 = 0x8034;
const UNSIGNED_SHORT_5_6_5 = 0x8363;
const HALF_FLOAT = 0x140B;
const HALF_FLOAT_OES = 0x8D61; // Thanks Khronos for making this different >:(
const UNSIGNED_INT_2_10_10_10_REV = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD;
const UNSIGNED_INT_24_8 = 0x84FA;

const RG = 0x8227;
const RG_INTEGER = 0x8228;
const RED = 0x1903;
const RED_INTEGER = 0x8D94;
const RGB_INTEGER = 0x8D98;
const RGBA_INTEGER = 0x8D99;

const textureInternalFormatInfo = {};
{

    // NOTE: these properties need unique names so we can let Uglify mangle the name.
    const t = textureInternalFormatInfo;
    // unsized formats
    t[ ALPHA ] = {
        textureFormat: ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 1, 2, 2, 4 ], type: [ UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT ],
    };
    t[ LUMINANCE ] = {
        textureFormat: LUMINANCE, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 1, 2, 2, 4 ], type: [ UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT ],
    };
    t[ LUMINANCE_ALPHA ] = {
        textureFormat: LUMINANCE_ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 2, 4, 4, 8 ], type: [ UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT ],
    };
    t[ RGB ] = {
        textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 3, 6, 6, 12, 2 ], type: [ UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT, UNSIGNED_SHORT_5_6_5 ],
    };
    t[ RGBA ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 8, 8, 16, 2, 2 ], type: [ UNSIGNED_BYTE, HALF_FLOAT, HALF_FLOAT_OES, FLOAT, UNSIGNED_SHORT_4_4_4_4, UNSIGNED_SHORT_5_5_5_1 ],
    };

    // sized formats
    t[ R8 ] = {
        textureFormat: RED, colorRenderable: true, textureFilterable: true, bytesPerElement: 1, type: UNSIGNED_BYTE,
    };
    t[ R8_SNORM ] = {
        textureFormat: RED, colorRenderable: false, textureFilterable: true, bytesPerElement: 1, type: BYTE,
    };
    t[ R16F ] = {
        textureFormat: RED, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 4, 2 ], type: [ FLOAT, HALF_FLOAT ],
    };
    t[ R32F ] = {
        textureFormat: RED, colorRenderable: false, textureFilterable: false, bytesPerElement: 4, type: FLOAT,
    };
    t[ R8UI ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: UNSIGNED_BYTE,
    };
    t[ R8I ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: BYTE,
    };
    t[ R16UI ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: UNSIGNED_SHORT,
    };
    t[ R16I ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: SHORT,
    };
    t[ R32UI ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT,
    };
    t[ R32I ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: INT,
    };
    t[ RG8 ] = {
        textureFormat: RG, colorRenderable: true, textureFilterable: true, bytesPerElement: 2, type: UNSIGNED_BYTE,
    };
    t[ RG8_SNORM ] = {
        textureFormat: RG, colorRenderable: false, textureFilterable: true, bytesPerElement: 2, type: BYTE,
    };
    t[ RG16F ] = {
        textureFormat: RG, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 8, 4 ], type: [ FLOAT, HALF_FLOAT ],
    };
    t[ RG32F ] = {
        textureFormat: RG, colorRenderable: false, textureFilterable: false, bytesPerElement: 8, type: FLOAT,
    };
    t[ RG8UI ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: UNSIGNED_BYTE,
    };
    t[ RG8I ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: BYTE,
    };
    t[ RG16UI ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_SHORT,
    };
    t[ RG16I ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: SHORT,
    };
    t[ RG32UI ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: UNSIGNED_INT,
    };
    t[ RG32I ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: INT,
    };
    t[ RGB8 ] = {
        textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: 3, type: UNSIGNED_BYTE,
    };
    t[ SRGB8 ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: UNSIGNED_BYTE,
    };
    t[ RGB565 ] = {
        textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 3, 2 ], type: [ UNSIGNED_BYTE, UNSIGNED_SHORT_5_6_5 ],
    };
    t[ RGB8_SNORM ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: BYTE,
    };
    t[ R11F_G11F_B10F ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6, 4 ], type: [ FLOAT, HALF_FLOAT, UNSIGNED_INT_10F_11F_11F_REV ],
    };
    t[ RGB9_E5 ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6, 4 ], type: [ FLOAT, HALF_FLOAT, UNSIGNED_INT_5_9_9_9_REV ],
    };
    t[ RGB16F ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6 ], type: [ FLOAT, HALF_FLOAT ],
    };
    t[ RGB32F ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: FLOAT,
    };
    t[ RGB8UI ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: UNSIGNED_BYTE,
    };
    t[ RGB8I ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: BYTE,
    };
    t[ RGB16UI ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: UNSIGNED_SHORT,
    };
    t[ RGB16I ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: SHORT,
    };
    t[ RGB32UI ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: UNSIGNED_INT,
    };
    t[ RGB32I ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: INT,
    };
    t[ RGBA8 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_BYTE,
    };
    t[ SRGB8_ALPHA8 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_BYTE,
    };
    t[ RGBA8_SNORM ] = {
        textureFormat: RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: 4, type: BYTE,
    };
    t[ RGB5_A1 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 2, 4 ], type: [ UNSIGNED_BYTE, UNSIGNED_SHORT_5_5_5_1, UNSIGNED_INT_2_10_10_10_REV ],
    };
    t[ RGBA4 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 2 ], type: [ UNSIGNED_BYTE, UNSIGNED_SHORT_4_4_4_4 ],
    };
    t[ RGB10_A2 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_INT_2_10_10_10_REV,
    };
    t[ RGBA16F ] = {
        textureFormat: RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 16, 8 ], type: [ FLOAT, HALF_FLOAT ],
    };
    t[ RGBA32F ] = {
        textureFormat: RGBA, colorRenderable: false, textureFilterable: false, bytesPerElement: 16, type: FLOAT,
    };
    t[ RGBA8UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_BYTE,
    };
    t[ RGBA8I ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: BYTE,
    };
    t[ RGB10_A2UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT_2_10_10_10_REV,
    };
    t[ RGBA16UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: UNSIGNED_SHORT,
    };
    t[ RGBA16I ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: SHORT,
    };
    t[ RGBA32I ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: INT,
    };
    t[ RGBA32UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: UNSIGNED_INT,
    };
    // Sized Internal
    t[ DEPTH_COMPONENT16 ] = {
        textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [ 2, 4 ], type: [ UNSIGNED_SHORT, UNSIGNED_INT ],
    };
    t[ DEPTH_COMPONENT24 ] = {
        textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT,
    };
    t[ DEPTH_COMPONENT32F ] = {
        textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: FLOAT,
    };
    t[ DEPTH24_STENCIL8 ] = {
        textureFormat: DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT_24_8,
    };
    t[ DEPTH32F_STENCIL8 ] = {
        textureFormat: DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: FLOAT_32_UNSIGNED_INT_24_8_REV,
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

function getFormatAndTypeFromInternalFormat( internalFromat ) {

    const info = textureInternalFormatInfo[ internalFromat ];

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

function loadImage( url, crossOrigin, callback ) {

    const cb = callback || empty;
    let img = new Image();
    const cors = crossOrigin !== undefined ? crossOrigin : defaults.crossOrigin;
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

    if ( ! isWebgl2( gl ) )
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

const ctx = document.createElement( 'canvas' ).getContext( '2d' );

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

function getBytesPerElementForInternalFromat( internalFromat, type ) {

    const info = textureInternalFormatInfo[ internalFromat ];
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
    const internalFromat = opts.internalFormat || opts.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    const format = opts.format || formatType.format;
    const type = opts.format || getTextureTypeFromArrayType( gl, src, formatType.type );
    let typedSrc = src;
    if ( ! isArrayBuffer( typedSrc ) ) {

        const Type = getTypedArrayTypeFromGLType( type );
        typedSrc = new Type( src );

    } else if ( typedSrc instanceof Uint8ClampedArray )
        typedSrc = new Uint8Array( typedSrc.buffer );

    const bytesPerElement = getBytesPerElementForInternalFromat( internalFromat, type );
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
            gl.texImage2D( f.face, level, internalFromat, width, height, 0, format, type, data );

        } );

    } else if ( target === gl.TEXTURE_3D )
        gl.texImage3D( target, level, internalFromat, width, height, depth, 0, format, type, typedSrc );
    else
        gl.texImage2D( target, level, internalFromat, width, height, 0, format, type, typedSrc );


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
    const internalFromat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
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

                        gl.texImage2D( otherTarget, level, internalFromat, format, type, img );

                    } );
                else
                    gl.texImage2D( faceTarget, level, internalFromat, format, type, img );

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
    const internalFromat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
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
                    gl.texImage3D( target, level, internalFromat, width, height, depth, 0, format, type, null );

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

function createTexture( gl, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    const tex = gl.createTexture();
    const target = opts.target || gl.TEXTURE_2D;
    let width = opts.width || 1;
    let height = opts.height || 1;
    const internalFromat = opts.internalFromat || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    let type = opts.type || formatType.type;
    gl.bindTexture( target, tex );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

    const { src } = opts;
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
    if ( shouldAutoSetTextureFiltering( options ) )
        setTextureFiltering( gl, tex, opts, width, height, internalFromat, type );

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

export { createTexture, createTextures };
