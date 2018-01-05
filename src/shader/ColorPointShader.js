import { Shader } from './Shader';

function ColorPointShader( gl, camera, pointSize, color ) {

    Shader.call( this, gl, ColorPointShader.vs, ColorPointShader.fs );

    this.camera = camera;

    this.setUniformObj( { u_color: color || [ 255 / 255, 105 / 255, 180 / 255, 125 / 255 ], u_pSize: pointSize || 5.0 } );

    this.deactivate();

}

ColorPointShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: ColorPointShader,

    setColor( color ) {

        this.setUniformObj( { u_color: color } );
        return this;

    },

    setPointSize( size ) {

        this.setUniformObj( { u_pSize: size } );
        return this;

    },

} );

Object.assign( ColorPointShader, {

    vs: '#version 300 es\n' +
        'in vec3 a_position;\n' +
        '\n' +
        'uniform mat4 u_worldMat;\n' +
        'uniform mat4 u_viewMat;\n' +
        'uniform mat4 u_projMat;\n' +
        'uniform float u_pSize;\n' +
        '\n' +
        'void main() {\n' +
        '   gl_PointSize = u_pSize;\n' +
        '   gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position.xyz, 1.0);\n' +
        '}',

    fs: '#version 300 es\n' +
        'precision mediump float;\n' +
        '\n' +
        'uniform vec4 u_color;\n' +
        '\n' +
        'out vec4 finalColor;\n' +
        'void main() {\n' +
        '   finalColor = u_color;\n' +
        '}',

} );

export { ColorPointShader };
