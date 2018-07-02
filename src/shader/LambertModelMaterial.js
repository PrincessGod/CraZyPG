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

    const {
        emissive, baseTexture, emissiveTexture, specularTexture,
        aoIntensity, aoTexture,
    } = opt;
    this.baseTexture = baseTexture;
    this.emissive = emissive || [ 0, 0, 0 ];
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.aoIntensity = aoIntensity || 1;
    this.aoTexture = aoTexture;

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

    emissiveTexture: {

        get() {

            return this._emissiveTexture;

        },

        set( v ) {

            this._emissiveTexture = v;
            this.setUniformObj( { u_emissiveTexture: v } );

        },

    },

    specularTexture: {

        get() {

            return this._specularTexture;

        },

        set( v ) {

            this._specularTexture = v;
            this.setUniformObj( { u_specularTexture: v } );

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

    aoIntensity: {

        get() {

            return this._aoIntensity;

        },

        set( v ) {

            this._aoIntensity = v;
            this.setUniformObj( { u_aoIntensity: v } );

        },

    },

    aoTexture: {

        get() {

            return this._aoTexture;

        },

        set( v ) {

            this._aoTexture = v;
            this.setUniformObj( { u_aoTexture: v } );

        },

    },

} );

export { LambertModelMaterial };
