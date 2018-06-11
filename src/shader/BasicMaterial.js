import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/basic.vs.glsl';
import fs from './shadersrc/basic.fs.glsl';

function BasicShader() {

    Shader.call( this, vs, fs );

}

BasicShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: BasicShader,

} );

// {}
function BasicMaterial( opts = {} ) {

    const defaultOpt = { name: 'BasicMaterial', baseColor: [ 1, 1, 1, 1 ] };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, BasicShader, opt );

    const { baseColor, baseTexture } = opt;
    this.baseColor = baseColor;
    this.baseTexture = baseTexture;

}

BasicMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: BasicMaterial,

} );

Object.defineProperties( BasicMaterial.prototype, {

    baseColor: {

        get() {

            return this._baseColor;

        },

        set( v ) {

            this._baseColor = v;
            this.setUniformObj( { u_baseColor: v } );

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

export { BasicMaterial };
