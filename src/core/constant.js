function makeReadonlyObj( obj ) {

    const result = {};
    Object.keys( obj ).forEach( ( key ) => {

        Object.defineProperty( result, key, {
            value: obj[ key ],
            writable: false,
            configurable: false,
            enumerable: true,
        } );

    } );
    return result;

}

export const ShaderParams = makeReadonlyObj( {

    ATTRIB_POSITION_NAME: 'a_position',
    ATTRIB_POSITION_LOC: 0,
    ATTRIB_UV_NAME: 'a_uv',
    ATTRIB_UV_LOC: 1,
    ATTRIB_NORMAL_NAME: 'a_normal',
    ATTRIB_NORMAL_LOC: 2,
    ATTRIB_BARYCENTRIC_NAME: 'a_barycentric',
    ATTRIB_BARYCENTRIC_LOC: 4,
    ATTRIB_JOINT_0_NAME: 'a_joint',
    ATTRIB_WEIGHT_0_NAME: 'a_weight',
    ATTRIB_UV2_NAME: 'a_uv2',
    ATTRIB_COLOR_NAME: 'a_color',
    UNIFORM_Model_MAT_NAME: 'u_modelMat',
    UNIFORM_VIEW_MAT_NAME: 'u_viewMat',
    UNIFORM_PROJ_MAT_NAME: 'u_projMat',
    UNIFORM_MVP_MAT_NAME: 'u_mvpMat',
    UNIFORM_MV_MAT_NAME: 'u_mvMat',
    UNIFORM_NORMAL_MAT_NAME: 'u_normMat',
    UNIFORM_BASE_TEXTURE_NAME: 'u_baseTexture',
    UNIFORM_PREFIX: 'u_',
    UNIFORM_CAMPOS: 'u_camPos',

} );

export const IndicesKey = 'indices';

export const DefaultColor = makeReadonlyObj( {

    Foreground: new Uint8Array( [ 255, 105, 180, 255 ] ),
    ForegroundNormalized: new Float32Array( [ 255 / 255, 105 / 255, 180 / 255, 255 / 255 ] ),
    Background: new Uint8Array( [ 255, 255, 255, 255 ] ),
    BackgroundNormalized: new Float32Array( [ 1, 1, 1, 1 ] ),

} );

export const BeginMode = makeReadonlyObj( {

    POINTS: 0x0000,
    LINES: 0x0001,
    LINE_LOOP: 0x0002,
    LINE_STRIP: 0x0003,
    TRIANGLES: 0x0004,
    TRIANGLE_STRIP: 0x0005,
    TRIANGLE_FAN: 0x0006,

} );

export const BufferParams = makeReadonlyObj( {

    STREAM_DRAW: 0x88E0,
    STATIC_DRAW: 0x88E4,
    DYNAMIC_DRAW: 0x88E8,

    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,

} );

export const TextureFilter = makeReadonlyObj( {

    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_NEAREST: 9985,
    LINEAR_MIPMAP_LINEAR: 9987,

} );

export const TextureType = makeReadonlyObj( {

    TEXTURE_2D: 0x0DE1,
    TEXTURE_3D: 0x806F,
    TEXTURE_CUBE_MAP: 0x8513,
    TEXTURE_2D_ARRAY: 0x8C1A,

} );

export const TextureCubeFace = makeReadonlyObj( {

    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A,

} );

export const TextureWrapMode = makeReadonlyObj( {

    REPEAT: 0x2901,
    CLAMP_TO_EDGE: 0x812F,
    MIRRORED_REPEAT: 0x8370,

} );

export const GLDataType = makeReadonlyObj( {

    BYTE: 0x1400,
    UNSIGNED_BYTE: 0x1401,
    SHORT: 0x1402,
    UNSIGNED_SHORT: 0x1403,
    INT: 0x1404,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,
    HALF_FLOAT: 0x140B,
    HALF_FLOAT_OES: 0x8D61,
    UNSIGNED_INT_2_10_10_10_REV: 0x8368,
    UNSIGNED_INT_10F_11F_11F_REV: 0x8C3B,
    UNSIGNED_INT_5_9_9_9_REV: 0x8C3E,
    FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8DAD,
    UNSIGNED_INT_24_8: 0x84FA,

} );

export const PixelFormat = makeReadonlyObj( {

    // share with TextureFormat
    DEPTH_COMPONENT: 0x1902,
    ALPHA: 0x1906,
    RGB: 0x1907,
    RGBA: 0x1908,
    LUMINANCE: 0x1909,
    LUMINANCE_ALPHA: 0x190A,

    // private
    R8: 0x8229,
    R8_SNORM: 0x8F94,
    R16F: 0x822D,
    R32F: 0x822E,
    R8UI: 0x8232,
    R8I: 0x8231,
    RG16UI: 0x823A,
    RG16I: 0x8239,
    RG32UI: 0x823C,
    RG32I: 0x823B,
    RG8: 0x822B,
    RG8_SNORM: 0x8F95,
    RG16F: 0x822F,
    RG32F: 0x8230,
    RG8UI: 0x8238,
    RG8I: 0x8237,
    R16UI: 0x8234,
    R16I: 0x8233,
    R32UI: 0x8236,
    R32I: 0x8235,
    RGB8: 0x8051,
    SRGB8: 0x8C41,
    RGB565: 0x8D62,
    RGB8_SNORM: 0x8F96,
    R11F_G11F_B10F: 0x8C3A,
    RGB9_E5: 0x8C3D,
    RGB16F: 0x881B,
    RGB32F: 0x8815,
    RGB8UI: 0x8D7D,
    RGB8I: 0x8D8F,
    RGB16UI: 0x8D77,
    RGB16I: 0x8D89,
    RGB32UI: 0x8D71,
    RGB32I: 0x8D83,
    RGBA8: 0x8058,
    SRGB8_ALPHA8: 0x8C43,
    RGBA8_SNORM: 0x8F97,
    RGB5_A1: 0x8057,
    RGBA4: 0x8056,
    RGB10_A2: 0x8059,
    RGBA16F: 0x881A,
    RGBA32F: 0x8814,
    RGBA8UI: 0x8D7C,
    RGBA8I: 0x8D8E,
    RGB10_A2UI: 0x906F,
    RGBA16UI: 0x8D76,
    RGBA16I: 0x8D88,
    RGBA32I: 0x8D82,
    RGBA32UI: 0x8D70,

} );

export const TextureFormat = makeReadonlyObj( {

    RG: 0x8227,
    RG_INTEGER: 0x8228,
    RED: 0x1903,
    RED_INTEGER: 0x8D94,
    RGB_INTEGER: 0x8D98,
    RGBA_INTEGER: 0x8D99,

} );

export const FrameBufferFormat = makeReadonlyObj( {

    DEPTH_COMPONENT16: 0x81A5,
    DEPTH_COMPONENT24: 0x81A6,
    DEPTH_COMPONENT32F: 0x8CAC,
    DEPTH32F_STENCIL8: 0x8CAD,
    DEPTH24_STENCIL8: 0x88F0,

    STENCIL_INDEX: 0x1901,
    STENCIL_INDEX8: 0x8D48,
    DEPTH_STENCIL: 0x84F9,

} );

export const UniformTypes = makeReadonlyObj( {

    FLOAT: 0x1406,
    INT: 0x1404,
    FLOAT_VEC2: 0x8B50,
    FLOAT_VEC3: 0x8B51,
    FLOAT_VEC4: 0x8B52,
    INT_VEC2: 0x8B53,
    INT_VEC3: 0x8B54,
    INT_VEC4: 0x8B55,
    BOOL: 0x8B56,
    BOOL_VEC2: 0x8B57,
    BOOL_VEC3: 0x8B58,
    BOOL_VEC4: 0x8B59,
    FLOAT_MAT2: 0x8B5A,
    FLOAT_MAT3: 0x8B5B,
    FLOAT_MAT4: 0x8B5C,
    SAMPLER_2D: 0x8B5E,
    SAMPLER_CUBE: 0x8B60,
    SAMPLER_3D: 0x8B5F,
    SAMPLER_2D_SHADOW: 0x8B62,
    FLOAT_MAT2x3: 0x8B65,
    FLOAT_MAT2x4: 0x8B66,
    FLOAT_MAT3x2: 0x8B67,
    FLOAT_MAT3x4: 0x8B68,
    FLOAT_MAT4x2: 0x8B69,
    FLOAT_MAT4x3: 0x8B6A,
    SAMPLER_2D_ARRAY: 0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,
    SAMPLER_CUBE_SHADOW: 0x8DC5,
    UNSIGNED_INT: 0x1405,
    UNSIGNED_INT_VEC2: 0x8DC6,
    UNSIGNED_INT_VEC3: 0x8DC7,
    UNSIGNED_INT_VEC4: 0x8DC8,
    INT_SAMPLER_2D: 0x8DCA,
    INT_SAMPLER_3D: 0x8DCB,
    INT_SAMPLER_CUBE: 0x8DCC,
    INT_SAMPLER_2D_ARRAY: 0x8DCF,
    UNSIGNED_INT_SAMPLER_2D: 0x8DD2,
    UNSIGNED_INT_SAMPLER_3D: 0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7,

} );

export const BlendEquation = makeReadonlyObj( {

    FUNC_ADD: 0x8006,
    FUNC_SUBTRACT: 0x800A,
    FUNC_REVERSE_SUBTRACT: 0x800B,
    MIN: 0x8007,
    MAX: 0x8008,

} );

export const BlendFactor = makeReadonlyObj( {

    ZERO: 0,
    ONE: 1,
    SRC_COLOR: 0x0300,
    ONE_MINUS_SRC_COLOR: 0x0301,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    DST_ALPHA: 0x0304,
    ONE_MINUS_DST_ALPHA: 0x0305,
    DST_COLOR: 0x0306,
    ONE_MINUS_DST_COLOR: 0x0307,
    SRC_ALPHA_SATURATE: 0x0308,
    CONSTANT_COLOR: 0x8001,
    ONE_MINUS_CONSTANT_COLOR: 0x8002,
    CONSTANT_ALPHA: 0x8003,
    ONE_MINUS_CONSTANT_ALPHA: 0x8004,

} );

export const CullFaceMode = makeReadonlyObj( {

    FRONT: 0x0404,
    BACK: 0x0405,
    FRONT_AND_BACK: 0x0408,

} );

export const Condition = makeReadonlyObj( {

    NEVER: 0x0200,
    LESS: 0x0201,
    EQUAL: 0x0202,
    LEQUAL: 0x0203,
    GREATER: 0x0204,
    NOTEQUAL: 0x0205,
    GEQUAL: 0x0206,
    ALWAYS: 0x0207,

} );

export const FrontFace = makeReadonlyObj( {

    CW: 0x0900,
    CCW: 0x0901,

} );

export const EnvTexture = makeReadonlyObj( {

    REFLECTION: 1,
    REFRACTION: 2,

    CUBE: 3,

    MULTIPLY: 4,
    MIX: 5,
    ADD: 6,

} );
