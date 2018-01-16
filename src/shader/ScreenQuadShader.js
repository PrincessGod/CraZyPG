import { Shader } from './Shader';
import vs from './shadersrc/screenQuad.vs.glsl';
import fs from './shadersrc/screenQuad.fs.glsl';

function ScreenQuadShader( gl ) {

    Shader.call( this, gl, ScreenQuadShader.vs, ScreenQuadShader.fs );

    this.setFlipy( true );

    this.deactivate();

}

ScreenQuadShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: ScreenQuadShader,

    setFlipy( flip ) {

        this.setUniformObj( { u_flipy: !! flip } );

    },

} );

Object.assign( ScreenQuadShader, {

    vs,
    fs,

} );

export { ScreenQuadShader };
