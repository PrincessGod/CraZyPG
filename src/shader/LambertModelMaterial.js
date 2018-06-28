import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/lambert.vs.glsl';
import fs from './shadersrc/lambert.fs.glsl';

function LambertModelShader() {

    Shader.call( this, vs, fs, { useLight: true } );

}

LambertModelShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: LambertModelShader,

} );

// {}
function LambertModelMaterial( opts = {} ) {

    const defaultOpt = { name: 'LambertModelMaterial' };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, LambertModelShader, opt );

    const { emissive, baseTexture } = opt;
    this.emissive = emissive || [ 0, 0, 0 ];
    this.baseTexture = baseTexture;

}

LambertModelMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: LambertModelMaterial,

} );

Object.defineProperties( LambertModelMaterial.prototype, {

    emissive: {

        get() {

            return this._emissive;

        },

        set( v ) {

            this._emissive = v;
            this.setUniformObj( { u_emissive: v } );

        },

    },

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

export { LambertModelMaterial };
