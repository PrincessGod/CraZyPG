import { PixelFormat, GLDataType, FrameBufferFormat, TextureFormat, TextureType } from '../core/constant';
import { isTypedArray, getGLTypeFromTypedArray } from '../core/typedArray';

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

function getFormatAndTypeFromInternalFormat( internalFromat ) {

    const info = textureInternalFormatInfo[ internalFromat ];

    if ( ! info )
        throw new Error( 'unknown internal format' );


    return {
        format: info.textureFormat,
        type: Array.isArray( info.type ) ? info.type[ 0 ] : info.type,
    };

}

function getTextureTypeFromArrayType( src, defaultType ) {

    if ( isTypedArray( src ) )
        return getGLTypeFromTypedArray( src );

    return defaultType || GLDataType.UNSIGNED_BYTE;

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

function guessDimensions( target, width, height, numElements ) {

    let rwidth = width;
    let rheight = height;
    const faces = target === TextureType.TEXTURE_CUBE_MAP ? 6 : 1;
    const singleFace = numElements / faces;
    if ( ! width && ! height ) {

        const size = Math.sqrt( singleFace );
        if ( size % 1 === 0 ) {

            rwidth = size;
            rheight = size;

        } else {

            rwidth = singleFace % 1 === 0 ? singleFace : numElements;
            rheight = 1;

        }

    } else if ( ! height ) {

        rheight = singleFace % width;
        if ( rheight % 1 )
            throw new Error( 'can\'t guess dimensions' );

    } else if ( ! width ) {

        rwidth = singleFace % height;
        if ( rwidth % 1 )
            throw new Error( 'can\'t guess dimensions' );

    }

    return {
        width: rwidth,
        height: rheight,
    };

}

function getDimensions( target, width, height, depth, numElements ) {

    if ( numElements % 1 !== 0 )
        throw new Error( 'can\'t guess dimensions' );

    let guessWidth = width;
    let guessHeight = height;
    let guessDepth = depth;
    let dimensions;
    if ( target === TextureType.TEXTURE_3D )
        if ( ! width && ! height && ! depth ) {

            const size = Math.cbrt( numElements );
            if ( size % 1 !== 0 )
                throw new Error( `can't guess size of array of numElements: ${numElements}` );
            guessWidth = size;
            guessHeight = size;
            guessDepth = size;

        } else if ( width && ( ! height || ! depth ) ) {

            dimensions = guessDimensions( target, height, depth, numElements / width );
            guessHeight = dimensions.width;
            guessDepth = dimensions.height;

        } else if ( height && ( ! width || ! depth ) ) {

            dimensions = guessDimensions( target, width, depth, numElements / height );
            guessWidth = dimensions.width;
            guessDepth = dimensions.height;

        } else {

            dimensions = guessDimensions( target, width, height, numElements / depth );
            guessWidth = dimensions.width;
            guessHeight = dimensions.height;

        }
    else {

        dimensions = guessDimensions( target, width, height, numElements );
        guessWidth = dimensions.width;
        guessHeight = dimensions.height;

    }

    return {
        width: guessWidth,
        height: guessHeight,
        depth: guessDepth,
    };

}

function canGenerateMipmap( internalFormat ) {

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

export {
    canFilter,
    getDimensions,
    canGenerateMipmap,
    getTextureTypeFromArrayType,
    getFormatAndTypeFromInternalFormat,
    getBytesPerElementForInternalFromat,
};
