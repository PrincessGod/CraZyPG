import { Shader } from './Shader';

function DynamicSkyboxShader( gl, camera, dayTex, nightTex ) {

    Shader.call( this, gl, DynamicSkyboxShader.vs, DynamicSkyboxShader.fs );

    this.camera = camera;

    this.setUniformObj( { u_dayTex: dayTex, u_nightTex: nightTex, u_rate: 0.5 } );

    this.deactivate();

}

DynamicSkyboxShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: DynamicSkyboxShader,

    setRate( r ) {

        this.setUniformObj( { u_rate: r } );
        return this;

    },

    updateCamera() {

        this.setProjMatrix( this.camera.projMat );
        this.setViewMatrix( this.camera.getOrientMatrix() );
        return this;

    },

} );

Object.assign( DynamicSkyboxShader, {

    vs: '#version 300 es\n' +
        'in vec4 a_position;\n' +
        '\n' +
        'uniform mat4 u_worldMat;\n' +
        'uniform mat4 u_viewMat;\n' +
        'uniform mat4 u_projMat;\n' +
        '\n' +
        'out highp vec3 v_uv;\n' +
        '\n' +
        'void main() {\n' +
        '   v_uv = a_position.xyz;\n' +
        '   gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position.xyz, 1.0);\n' +
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
        '   finalColor = mix( texture(u_dayTex, v_uv), texture(u_nightTex, v_uv), u_rate);\n' +
        '}',

} );

export { DynamicSkyboxShader };
