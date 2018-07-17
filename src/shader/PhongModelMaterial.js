import { Shader } from './Shader';
import { Material } from './Material';
import { EnvTexture } from '../core/constant';
import vs from './shadersrc/phong.vs.glsl';
import fs from './shadersrc/phong.fs.glsl';

function PhongModelShader() {

    Shader.call( this, vs, fs, { useLight: true, validateProgram: false } );

}

PhongModelShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: PhongModelShader,

} );

// {}
function PhongModelMaterial( opts = {} ) {

    const defaultOpt = { name: 'PhongModelMaterial' };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, PhongModelShader, opt );

    const {
        baseTexture, specular, shininess, emissive, emissiveTexture,
        specularTexture, normalTexture, normalScale, bumpTexture, bumpScale,
        aoTexture, aoTextureIntensity, displacementTexture, displacementScale, displacementBias,
        envTexture, envMode, envType, envBlend, reflectivity, refractionRatio,
        alphaTexture, alphaMask, lightTexture, lightTextureIntensity,
    } = opt;
    this.baseTexture = baseTexture;
    this.specular = specular || [ 1, 1, 1 ];
    this.shininess = shininess || 10;
    this.emissive = emissive || [ 0, 0, 0 ];
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.normalTexture = normalTexture;
    this.normalScale = normalScale || [ 1, 1 ];
    this.bumpTexture = bumpTexture;
    this.bumpScale = bumpScale || 1;
    this.aoTextureIntensity = aoTextureIntensity || 1;
    this.aoTexture = aoTexture;
    this.displacementTexture = displacementTexture;
    this.displacementScale = displacementScale === undefined ? 1.0 : displacementScale;
    this.displacementBias = displacementBias === undefined ? 0 : displacementBias;
    this.envTexture = envTexture;
    this.envMode = envMode || EnvTexture.REFLECTION;
    this.envType = envType || EnvTexture.CUBE;
    this.envBlend = envBlend || EnvTexture.MULTIPLY;
    this.reflectivity = reflectivity !== undefined ? reflectivity : 1;
    this.refractionRatio = refractionRatio !== undefined ? refractionRatio : 0.98;
    this.alphaTexture = alphaTexture;
    this.alphaMask = alphaMask;
    this.lightTexture = lightTexture;
    this.lightTextureIntensity = lightTextureIntensity !== undefined ? lightTextureIntensity : 1;


}

PhongModelMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: PhongModelMaterial,

} );

Object.defineProperties( PhongModelMaterial.prototype, {

    baseTexture: {

        get() {

            return this._baseTexture;

        },

        set( v ) {

            this._baseTexture = v;
            this.setUniformObj( { u_baseTexture: v } );

        },

    },

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

    specular: {

        get() {

            return this._specular;

        },

        set( v ) {

            this._specular = v;
            this.setUniformObj( { u_specular: v } );

        },

    },

    shininess: {

        get() {

            return this._shininess;

        },

        set( v ) {

            this._shininess = v;
            this.setUniformObj( { u_shininess: v } );

        },

    },

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

    displacementTexture: {

        get() {

            return this._displacementTexture;

        },

        set( v ) {

            this._displacementTexture = v;
            this.setUniformObj( { u_displacementTexture: v } );

        },

    },

    displacementScale: {

        get() {

            return this._displacementScale;

        },

        set( v ) {

            this._displacementScale = v;
            this.setUniformObj( { u_displacementScale: v } );

        },

    },

    displacementBias: {

        get() {

            return this._displacementBias;

        },

        set( v ) {

            this._displacementBias = v;
            this.setUniformObj( { u_displacementBias: v } );

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

    alphaTexture: {

        get() {

            return this._alphaTexture;

        },

        set( v ) {

            this._alphaTexture = v;
            this.setUniformObj( { u_alphaTexture: v } );

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

export { PhongModelMaterial };
