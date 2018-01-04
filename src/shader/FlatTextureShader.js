import { Shader } from './Shader';

function FlatTextureShader( gl, projMat, texture ) {

    Shader.call( this, gl, FlatTextureShader.vs, FlatTextureShader.fs );

    this.setProjMatrix( projMat );
    this.texture = texture;

    gl.useProgram( null );

}

FlatTextureShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: FlatTextureShader,

    setTexture( tex ) {

        this.texture = tex;
        return this;

    },

    preRender() {

        this.setUniforms( { u_texture: this.texture } );
        return this;

    },

} );

Object.assign( FlatTextureShader, {

    vs: '#version 300 es\n' +
        'in vec3 a_position;\n' +
        'in vec2 a_uv;\n' +
        '\n' +
        'uniform mat4 u_world;\n' +
        'uniform mat4 u_view;\n' +
        'uniform mat4 u_proj;\n' +
        '\n' +
        'out highp vec2 v_uv;\n' +
        '\n' +
        'void main() {\n' +
        '   v_uv = a_uv;\n' +
        '   gl_Position = u_proj * u_view * u_world * vec4(a_position, 1.0);\n' +
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
