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
        emissive, baseTexture, specular, shininess,
    } = opt;
    this.emissive = emissive || [ 0, 0, 0 ];
    this.baseTexture = baseTexture;
    this.specular = specular || [ 1, 1, 1 ];
    this.shininess = shininess || 10;

}

PhongModelMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: PhongModelMaterial,

} );

Object.defineProperties( PhongModelMaterial.prototype, {

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
