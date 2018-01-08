import { Shader } from './Shader';
import vs from './shadersrc/colorLine.vs';
import fs from './shadersrc/colorLine.fs';

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

    vs,
    fs,

} );

export { ColorLineShader };
