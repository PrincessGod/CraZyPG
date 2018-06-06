import { Shader } from './Shader';
import vs from './shadersrc/gridaxis.vs.glsl';
import fs from './shadersrc/gridaxis.fs.glsl';

function GridAxisShader( gl ) {

    Shader.call( this, gl, GridAxisShader.vs, GridAxisShader.fs );

    this.setUniformObj( { u_colors: [ 0.5, 0.5, 0.5, 1, 0, 0, 0, 1, 0, 0, 0, 1 ] } );

    this.deactivate();

}

GridAxisShader.prototype = Object.assign( Object.create( Shader.prototype ), {
    constructor: GridAxisShader,
} );

Object.assign( GridAxisShader, {

    vs,
    fs,

} );

export { GridAxisShader };
