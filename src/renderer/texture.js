import { isArrayBuffer } from './typedArray';

const defaults = {
    textureColor: new Uint8Array( [ 255, 182, 193, 255 ] ),
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

/* TextureWrapMode */
const REPEAT = 0x2901;
const MIRRORED_REPEAT = 0x8370;

/* TextureMagFilter */
const NEAREST = 0x2600;

/* TextureMinFilter */
const NEAREST_MIPMAP_NEAREST = 0x2700;
const LINEAR_MIPMAP_NEAREST = 0x2701;
const NEAREST_MIPMAP_LINEAR = 0x2702;
const LINEAR_MIPMAP_LINEAR = 0x2703;

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

function loadTextureFromUrl( gl, tex, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    setTextureTo1PixelColor( gl, tex, opts );
    const asyncOpts = Object.assign( {}, opts );

}

function createTexture( gl, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    const tex = gl.createTexture();
    const target = opts.target || gl.TEXTURE_2D;
    const width = opts.width || 1;
    const height = opts.height || 1;
    const internalFromat = opts.internalFromat || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    const type = opts.type || formatType.type;
    gl.bindTexture( target, tex );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        gl.textParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.textParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

    const { src } = options;
    if ( src )
        if ( typeof src === 'string' ) {

        }


}


// function createTextures( gl, textureOptions, callback ) {
//     let cb = callback || empty;
//     let numLoading = 0;
//     const errors = [];
//     const textures = [];
//     const images = {};

//     Object.keys(textureOptions).forEach(name => {
//         const options = textureOptions[name];

//         let onLoadFn;
//     })

// }

