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
    UNIFORM_WORLD_MAT_NAME: 'u_worldMat',
    UNIFORM_VIEW_MAT_NAME: 'u_viewMat',
    UNIFORM_PROJ_MAT_NAME: 'u_projMat',
    UNIFORM_MVP_MAT_NAME: 'u_mvpMat',
    UNIFORM_VP_MAT_NAME: 'u_vpMat',
    UNIFORM_NORMAL_MAT_NAME: 'u_normMat',
    UNIFORM_MAIN_TEXTURE_NAME: 'u_texture',
    UNIFORM_PREFIX: 'u_',
    UNIFORM_CAMPOS: 'u_camPos',
    ATTRIB_JOINT_0_NAME: 'a_joint',
    ATTRIB_WEIGHT_0_NAME: 'a_weight',
    ATTRIB_UV_1_NAME: 'a_uv1',
    ATTRIB_JOINT_1_NAME: 'a_joint1',
    ATTRIB_WEIGHT_1_NAME: 'a_weight1',
    ATTRIB_TANGENT_NAME: 'a_tangent',
    ATTRIB_VERTEX_COLOR_NAME: 'a_color',

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

} );

export const TextureFilters = makeReadonlyObj( {

    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_NEAREST: 9985,
    LINEAR_MIPMAP_LINEAR: 9987,

} );

export const DefaultColor = makeReadonlyObj( {

    Foreground: new Uint8Array( [ 255, 105, 180, 255 ] ),
    ForegroundNormalized: new Float32Array( [ 255 / 255, 105 / 255, 180 / 255, 255 / 255 ] ),
    Background: new Uint8Array( [ 255, 255, 255, 255 ] ),
    BackgroundNormalized: new Float32Array( [ 1, 1, 1, 1 ] ),

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

export const TextureType = makeReadonlyObj( {

    TEXTURE_2D: 0x0DE1,
    TEXTURE_CUBE_MAP: 0x8513,

} );

export const TextureCubeFaces = makeReadonlyObj( {

    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A,

} );
