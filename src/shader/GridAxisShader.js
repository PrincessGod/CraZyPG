import { Shader } from './Shader';

function GridAxisShader( gl, projMat ) {

    Shader.call( this, gl, GridAxisShader.vs, GridAxisShader.fs );

    this.setProjMatrix( projMat );
    this.setUniformObj( { u_colors: [ 0.5, 0.5, 0.5, 1, 0, 0, 0, 1, 0, 0, 0, 1 ] } );

    this.deactivate();

}

GridAxisShader.prototype = Object.assign( Object.create( Shader.prototype ), {
    constructor: GridAxisShader,
} );

Object.assign( GridAxisShader, {

    vs: '#version 300 es\n' +
        'in vec3 a_position;\n' +
        'layout(location=4) in float a_color;\n' +
        '\n' +
        'uniform mat4 u_worldMat;\n' +
        'uniform mat4 u_viewMat;\n' +
        'uniform mat4 u_projMat;\n' +
        'uniform vec3 u_colors[4];\n' +
        '\n' +
        'out vec3 v_color;\n' +
        '\n' +
        'void main() {\n' +
        '    v_color = u_colors[int(a_color)];\n' +
        '    gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position, 1.0);\n' +
        '}',

    fs: '#version 300 es\n' +
        'precision mediump float;\n' +
        '\n' +
        'in vec3 v_color;\n' +
        'out vec4 finalColor;\n' +
        '\n' +
        'void main() {\n' +
        '    finalColor = vec4(v_color, 1.0);\n' +
        '}',

} );

export { GridAxisShader };
