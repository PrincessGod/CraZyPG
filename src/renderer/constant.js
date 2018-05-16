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
