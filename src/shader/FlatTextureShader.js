import { Shader } from './Shader';
import vs from './shadersrc/singleTexture.vs.glsl';
import fs from './shadersrc/singleTexture.fs.glsl';

function FlatTextureShader( gl, camera, texture ) {

    Shader.call( this, gl, FlatTextureShader.vs, FlatTextureShader.fs );

    this.camera = camera;

    this.setUniformObj( { u_texture: texture } );

    this.deactivate();

}

FlatTextureShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: FlatTextureShader,

} );

Object.assign( FlatTextureShader, {

    vs,
    fs,

} );

export { FlatTextureShader };
