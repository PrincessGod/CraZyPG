import { Shader } from './Shader';
import vs from './shadersrc/colorpick.vs.glsl';
import fs from './shadersrc/colorpick.fs.glsl';

function ColorpickShader( gl ) {

    Shader.call( this, gl, ColorpickShader.vs, ColorpickShader.fs );

    this.setColor( [ 0.0, 0.0, 0.0 ] );

    this.deactivate();

}

ColorpickShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: ColorpickShader,

    setColor( color ) {

        this.setUniformObj( { u_color: color } );
        return this;

    },

} );

Object.assign( ColorpickShader, {

    vs,
    fs,

} );

export { ColorpickShader };
