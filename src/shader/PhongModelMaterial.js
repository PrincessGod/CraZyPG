import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/phong.vs.glsl';
import fs from './shadersrc/phong.fs.glsl';

function PhongModelShader() {

    Shader.call( this, vs, fs, { useLight: true } );

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
        specularTexture,
    } = opt;
    this.baseTexture = baseTexture;
    this.specular = specular || [ 1, 1, 1 ];
    this.shininess = shininess || 10;
    this.emissive = emissive || [ 0, 0, 0 ];
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;

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

} );

export { PhongModelMaterial };
