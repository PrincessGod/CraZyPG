import { Shader } from './Shader';

function ColorLineShader( gl, camera, colors = [ 255 / 255, 105 / 255, 180 / 255, 255 / 255, 255 / 255, 182 / 255, 193 / 255, 80 / 255 ] ) {

    Shader.call( this, gl, ColorLineShader.vs, ColorLineShader.fs );

    this.camera = camera;

    this.setColors( colors );

    this.deactivate();

}

ColorLineShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: ColorLineShader,

    setColors( colors ) {

        this.setUniformObj( { u_colors: colors } );

        if ( colors[ 3 ] !== 1 || colors[ 7 ] !== 1 )
            this.blend = true;
        else
            this.blend = false;

        return this;

    },

} );

Object.assign( ColorLineShader, {

    vs: '#version 300 es\n' +
        'in vec3 a_position;\n' +
        '\n' +
        'uniform mat4 u_worldMat;\n' +
        'uniform mat4 u_viewMat;\n' +
        'uniform mat4 u_projMat;\n' +
        'uniform vec4 u_colors[2];\n' +
        '\n' +
        'out vec4 v_color;\n' +
        '\n' +
        'void main() {\n' +
        '   v_color = u_colors[gl_VertexID % 2];\n' +
        '   gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position.xyz, 1.0);\n' +
        '}',

    fs: '#version 300 es\n' +
        'precision mediump float;\n' +
        '\n' +
        'in vec4 v_color;\n' +
        '\n' +
        'out vec4 finalColor;\n' +
        'void main() {\n' +
        '   finalColor = v_color;\n' +
        '}',

} );

export { ColorLineShader };
