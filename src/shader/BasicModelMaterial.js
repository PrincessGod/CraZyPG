import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/basic.vs.glsl';
import fs from './shadersrc/basic.fs.glsl';

function BasicModelShader() {

    Shader.call( this, vs, fs, { validateProgram: false } );

}

BasicModelShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: BasicModelShader,

} );

// {}
function BasicModelMaterial( opts = {} ) {

    const defaultOpt = { name: 'BasicModelMaterial' };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, BasicModelShader, opt );

    const { baseTexture, envTexture } = opt;
    this.baseTexture = baseTexture;
    this.envTexture = envTexture;

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

    envTexture: {

        get() {

            return this._envTexture;

        },

        set( v ) {

            this._envTexture = v;
            this.setUniformObj( { u_envTexture: v } );

        },

    },

} );

export { BasicModelMaterial };
