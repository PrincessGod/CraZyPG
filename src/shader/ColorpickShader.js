import { Shader } from './Shader';
import vs from './shadersrc/colorpick.vs.glsl';
import fs from './shadersrc/colorpick.fs.glsl';

function ColorpickShader( gl, camera ) {

    Shader.call( this, gl, ColorpickShader.vs, ColorpickShader.fs );

    this.camera = camera;

    this.setColors( { u_color: [ 0.0, 0.0, 0.0 ] } );

    this.deactivate();

}

ColorpickShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: ColorpickShader,

    setColors( colors ) {

        this.setUniformObj( { u_colors: colors } );

        if ( colors[ 3 ] !== 1 || colors[ 7 ] !== 1 )
            this.blend = true;
        else
            this.blend = false;

        return this;

    },

} );

Object.assign( ColorpickShader, {

    vs,
    fs,

} );

export { ColorpickShader };
