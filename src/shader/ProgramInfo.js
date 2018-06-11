/* eslint prefer-template: 0 */
import { ShaderFactory } from './ShaderFactory';

function getHTMLElementSrc( id ) {

    const ele = document.getElementById( id );

    if ( ! ele || ele.textContent === '' )
        throw Error( `${id} shader element does not exist or have text.` );

    const idx = ele.textContent.indexOf( '#version 300 es' );

    if ( idx < 0 )
        throw Error( 'expect glsl version is "300 es"' );

    return ele.textContent.slice( idx );

}

function getShaderSrc( src ) {

    if ( typeof src !== 'string' )
        throw TypeError( 'shader source expect to be String' );

    if ( src.length < 30 )
        return getHTMLElementSrc( src );

    return src;

}

// opts{ transformFeedbackVaryings, validateProgram }
function ProgramInfo( vs, fs, opts = {} ) {

    this._vs = getShaderSrc( vs );
    this._fs = getShaderSrc( fs );
    this.opts = opts;
    this.needUpdate = true;

}

Object.assign( ProgramInfo.prototype, {

    setSetters( attrib, uniform ) {

        this._attribSetters = attrib;
        this._uniformSetters = uniform;

    },

    compile( primitive, material ) {

        const primitiveDefine = ShaderFactory.parseDefineObjFromPrimitive( primitive );
        const materialDefine = ShaderFactory.parseDefineObjFromMaterial( material );
        this._defines = Object.assign( primitiveDefine, materialDefine );
        this._vs = ShaderFactory.parseVersion( material.version ) +
            ShaderFactory.parseShaderName( material.name ) + '\n' +
            ShaderFactory.parseDefineObj( this._defines ) + '\n' +
            ShaderFactory.parsePrecision( material.vertexPrecision ) + '\n' +
            ShaderFactory.parseIncludes( this._vs );

        this._fs = ShaderFactory.parseVersion( material.version ) +
            ShaderFactory.parseShaderName( material.name ) + '\n' +
            ShaderFactory.parseDefineObj( this._defines ) + '\n' +
            ShaderFactory.parsePrecision( material.fragmentPrecision ) + '\n' +
            ShaderFactory.parseIncludes( this._fs );

    },

} );

Object.defineProperties( ProgramInfo.prototype, {

    vs: {

        get() {

            return this._vs;

        },

    },

    fs: {

        get() {

            return this._fs;

        },

    },

    attribSetters: {

        get() {

            return this._attribSetters;

        },

    },

    uniformSetters: {

        get() {

            return this._uniformSetters;

        },

    },

    defines: {

        get() {

            return this._defines;

        },

    },

} );

export { ProgramInfo };
