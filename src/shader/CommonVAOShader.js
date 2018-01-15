import { Shader } from './Shader';
import vs from './shadersrc/commonVAO.vs.glsl';
import fs from './shadersrc/commonVAO.fs.glsl';

function CommonVAOShader( gl ) {

    Shader.call( this, gl, CommonVAOShader.vs, CommonVAOShader.fs );

    this.deactivate();

}

CommonVAOShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: CommonVAOShader,

} );

Object.assign( CommonVAOShader, {

    vs,
    fs,

} );

export { CommonVAOShader };
