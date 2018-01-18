import { Shader } from './Shader';
import vs from './shadersrc/colorPoint.vs.glsl';
import fs from './shadersrc/colorPoint.fs.glsl';

function ColorPointShader( gl, camera, pointSize = 5.0, color = [ 255 / 255, 105 / 255, 180 / 255, 125 / 255 ] ) {

    Shader.call( this, gl, ColorPointShader.vs, ColorPointShader.fs );

    this.setCamera( camera );
    this.setPointSize( pointSize );

    this.setColor( color );

    this.deactivate();

}

ColorPointShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: ColorPointShader,

    setColor( color ) {

        this.setUniformObj( { u_color: color } );

        if ( color[ 3 ] !== 1 )
            this.blend = true;
        else
            this.blend = false;

        return this;

    },

    setPointSize( size ) {

        this.setUniformObj( { u_pSize: size } );
        return this;

    },

} );

Object.assign( ColorPointShader, {

    vs,
    fs,

} );

export { ColorPointShader };
