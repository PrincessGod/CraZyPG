import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/normal.vs.glsl';
import fs from './shadersrc/normal.fs.glsl';

function NormalModelShader() {

    Shader.call( this, vs, fs );

}

NormalModelShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: NormalModelShader,

} );

function NormalModelMaterial( opts = {} ) {

    const defaultOpt = { name: 'NormalModelMaterial' };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, NormalModelShader, opt );

    const {
        normalTexture, normalScale, bumpTexture, bumpScale,
    } = opt;
    this.normalTexture = normalTexture;
    this.normalScale = normalScale || [ 1, 1 ];
    this.bumpTexture = bumpTexture;
    this.bumpScale = bumpScale || 1;

}

NormalModelMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: NormalModelMaterial,

} );

Object.defineProperties( NormalModelMaterial.prototype, {

    normalTexture: {

        get() {

            return this._normalTexture;

        },

        set( v ) {

            this._normalTexture = v;
            this.setUniformObj( { u_normalTexture: v } );

        },

    },

    normalScale: {

        get() {

            return this._normalScale;

        },

        set( v ) {

            this._normalScale = v;
            this.setUniformObj( { u_normalScale: v } );

        },

    },

    bumpTexture: {

        get() {

            return this._bumpTexture;

        },

        set( v ) {

            this._bumpTexture = v;
            this.setUniformObj( { u_bumpTexture: v } );

        },

    },

    bumpScale: {

        get() {

            return this._bumpScale;

        },

        set( v ) {

            this._bumpScale = v;
            this.setUniformObj( { u_bumpScale: v } );

        },

    },

} );

export { NormalModelMaterial };
