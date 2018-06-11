import { RawShader } from './RawShader';
import { Material } from './Material';
import vs from './shadersrc/singleTexture.vs.glsl';
import fs from './shadersrc/singleTexture.fs.glsl';

function FlatTextureShader() {

    RawShader.call( this, vs, fs );

}

FlatTextureShader.prototype = Object.assign( Object.create( RawShader.prototype ), {

    constructor: FlatTextureShader,

} );

// { texture }
function FlatTextureMaterial( opts = {} ) {

    Material.call( this, FlatTextureShader, opts );
    if ( opts.texture )
        this.setUniformObj( { u_texture: opts.texture } );

}

FlatTextureMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: FlatTextureMaterial,

} );

export { FlatTextureMaterial };
