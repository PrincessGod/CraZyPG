import { Shader } from './Shader';

function FlatTextureShader( gl, camera, texture ) {

    Shader.call( this, gl, FlatTextureShader.vs, FlatTextureShader.fs );

    this.camera = camera;

    this.setUniformObj( { u_texture: texture } );

    this.deactivate();

}

FlatTextureShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: FlatTextureShader,

    setTexture( tex ) {

        this.setUniformObj( { u_texture: tex } );
        return this;

    },

} );

Object.assign( FlatTextureShader, {

    vs: '#version 300 es\n' +
        'in vec3 a_position;\n' +
        'in vec2 a_uv;\n' +
        '\n' +
        'uniform mat4 u_worldMat;\n' +
        'uniform mat4 u_viewMat;\n' +
        'uniform mat4 u_projMat;\n' +
        '\n' +
        'out highp vec2 v_uv;\n' +
        '\n' +
        'void main() {\n' +
        '   v_uv = a_uv;\n' +
        '   gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position, 1.0);\n' +
        '}',

    fs: '#version 300 es\n' +
        'precision mediump float;\n' +
        '\n' +
        'in highp vec2 v_uv;\n' +
        '\n' +
        'uniform sampler2D u_texture;\n' +
        '\n' +
        'out vec4 finalColor;\n' +
        '\n' +
        'void main() {\n' +
        '   finalColor = texture(u_texture, vec2(v_uv.s, v_uv.t));\n' +
        '}',

} );

export { FlatTextureShader };
