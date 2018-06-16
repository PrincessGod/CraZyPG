import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/basic.vs.glsl';
import fs from './shadersrc/basic.fs.glsl';

function BasicModelShader() {

    Shader.call( this, vs, fs );

}

BasicModelShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: BasicModelShader,

} );

// {}
function BasicModelMaterial( opts = {} ) {

    const defaultOpt = { name: 'BasicModelMaterial' };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, BasicModelShader, opt );

    const { baseTexture } = opt;
    this.baseTexture = baseTexture;

}

BasicModelMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: BasicModelMaterial,

} );

Object.defineProperties( BasicModelMaterial.prototype, {

    baseTexture: {

        get() {

            return this._baseTexture;

        },

        set( v ) {

            this._baseTexture = v;
            this.setUniformObj( { u_baseTexture: v } );

        },

    },

} );

export { BasicModelMaterial };
