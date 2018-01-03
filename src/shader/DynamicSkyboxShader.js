import { Shader } from './Shader';

function DynamicSkyboxShader( gl, projMat, dayTex, nightTex ) {

    Shader.call( this, gl, DynamicSkyboxShader.vs, DynamicSkyboxShader.fs );

    this.setProjMatrix( projMat );

    this.dayTex = dayTex;
    this.nightTex = nightTex || dayTex;

    gl.useProgram( null );

}

DynamicSkyboxShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: DynamicSkyboxShader,

    setRate( r ) {

        this.setUniforms( { u_rate: r } );
        return this;

    },

    preRender() {

        this.setUniforms( { u_dayTex: this.dayTex, u_nightTex: this.nightTex } );
        return this;

    },

} );

Object.assign( DynamicSkyboxShader, {

    vs: '#version 300 es\n' +
        'in vec4 a_position;\n' +
        '\n' +
        'uniform mat4 u_world;\n' +
        'uniform mat4 u_view;\n' +
        'uniform mat4 u_proj;\n' +
        '\n' +
        'out highp vec3 v_uv;\n' +
        '\n' +
        'void main() {\n' +
            'v_uv = a_position.xyz;\n' +
            'gl_Position = u_proj * u_view * u_world * vec4(a_position.xyz, 1.0);\n' +
        '}',

    fs: '#version 300 es\n' +
        'precision mediump float;\n' +
        '\n' +
        'in highp vec3 v_uv;\n' +
        '\n' +
        'uniform samplerCube u_dayTex;\n' +
        'uniform samplerCube u_nightTex;\n' +
        'uniform float u_rate;\n' +
        '\n' +
        'out vec4 finalColor;\n' +
        'void main() {\n' +
            'finalColor = mix( texture(u_dayTex, v_uv), texture(u_nightTex, v_uv), u_rate);\n' +
        '}',

} );

export { DynamicSkyboxShader };
