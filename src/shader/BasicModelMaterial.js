import { EnvTexture } from '../core/constant';
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

    const {
        baseTexture, envTexture, envMode, envType, envBlend,
        reflectivity, refractionRatio, alphaTexture, alphaMask, specularTexture,
        lightTexture, lightTextureIntensity, aoTexture, aoTextureIntensity,
    } = opt;
    this.baseTexture = baseTexture;
    this.envTexture = envTexture;
    this.envMode = envMode || EnvTexture.REFLECTION;
    this.envType = envType || EnvTexture.CUBE;
    this.envBlend = envBlend || EnvTexture.MULTIPLY;
    this.reflectivity = reflectivity !== undefined ? reflectivity : 1;
    this.refractionRatio = refractionRatio !== undefined ? refractionRatio : 0.98;
    this.alphaTexture = alphaTexture;
    this.alphaMask = alphaMask;
    this.specularTexture = specularTexture;
    this.lightTexture = lightTexture;
    this.lightTextureIntensity = lightTextureIntensity !== undefined ? lightTextureIntensity : 1;
    this.aoTexture = aoTexture;
    this.aoTextureIntensity = aoTextureIntensity !== undefined ? aoTextureIntensity : 1;

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

    alphaTexture: {

        get() {

            return this._alphaTexture;

        },

        set( v ) {

            this._alphaTexture = v;
            this.setUniformObj( { u_alphaTexture: v } );

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

    aoTexture: {

        get() {

            return this._aoTexture;

        },

        set( v ) {

            this._aoTexture = v;
            this.setUniformObj( { u_aoTexture: v } );

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

} );

export { BasicModelMaterial };
