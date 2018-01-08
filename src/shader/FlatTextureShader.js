import { Shader } from './Shader';
import vs from './shadersrc/singleTexture.vs';
import fs from './shadersrc/singleTexture.fs';

function FlatTextureShader( gl, camera, texture ) {

    Shader.call( this, gl, FlatTextureShader.vs, FlatTextureShader.fs );

    this.camera = camera;

    this.setUniformObj( { u_texture: texture } );

    this.deactivate();

}

FlatTextureShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: FlatTextureShader,

    setTexture( tex ) {

        this.setUniformObj( { u_texture: tex } );
        return this;

    },

} );

Object.assign( FlatTextureShader, {

    vs,
    fs,

} );

export { FlatTextureShader };
