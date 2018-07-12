import { Shader } from './Shader';
import { Material } from './Material';
import { EnvTexture } from '../core/constant';
import vs from './shadersrc/lambert.vs.glsl';
import fs from './shadersrc/lambert.fs.glsl';

function LambertModelShader() {

    Shader.call( this, vs, fs, { useLight: true, validateProgram: false } );

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
        aoTexture, aoTextureIntensity, alphaTexture, alphaMask,
        envTexture, envMode, envType, envBlend, reflectivity, refractionRatio,
        lightTexture, lightTextureIntensity,
    } = opt;
    this.baseTexture = baseTexture;
    this.emissive = emissive || [ 0, 0, 0 ];
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.aoTexture = aoTexture;
    this.aoTextureIntensity = aoTextureIntensity || 1;
    this.alphaTexture = alphaTexture;
    this.alphaMask = alphaMask;
    this.envTexture = envTexture;
    this.envMode = envMode || EnvTexture.REFLECTION;
    this.envType = envType || EnvTexture.CUBE;
    this.envBlend = envBlend || EnvTexture.MULTIPLY;
    this.reflectivity = reflectivity !== undefined ? reflectivity : 1;
    this.refractionRatio = refractionRatio !== undefined ? refractionRatio : 0.98;
    this.lightTexture = lightTexture;
    this.lightTextureIntensity = lightTextureIntensity !== undefined ? lightTextureIntensity : 1;

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

    alphaTexture: {

        get() {

            return this._alphaTexture;

        },

        set( v ) {

            this._alphaTexture = v;
            this.setUniformObj( { u_alphaTexture: v } );

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

    aoTextureIntensity: {

        get() {

            return this._aoTextureIntensity;

        },

        set( v ) {

            this._aoTextureIntensity = v;
            this.setUniformObj( { u_aoTextureIntensity: v } );

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

    envTexture: {

        get() {

            return this._envTexture;

        },

        set( v ) {

            this._envTexture = v;
            this.setUniformObj( { u_envTexture: v } );

        },

    },

    reflectivity: {

        get() {

            return this._reflectivity;

        },

        set( v ) {

            this._reflectivity = v;
            this.setUniformObj( { u_reflectivity: v } );

        },

    },

    refractionRatio: {

        get() {

            return this._refractionRatio;

        },

        set( v ) {

            this._refractionRatio = v;
            this.setUniformObj( { u_refractionRatio: v } );

        },

    },

    lightTexture: {

        get() {

            return this._lightTexture;

        },

        set( v ) {

            this._lightTexture = v;
            this.setUniformObj( { u_lightTexture: v } );

        },

    },

    lightTextureIntensity: {

        get() {

            return this._lightTextureIntensity;

        },

        set( v ) {

            this._lightTextureIntensity = v;
            this.setUniformObj( { u_lightTextureIntensity: v } );

        },

    },

} );

export { LambertModelMaterial };
