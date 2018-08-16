/* eslint prefer-template: 0 */
import { PMath } from '../math/Math';
import { ShaderFactory } from './ShaderFactory';

function equalSign( a, b ) {

    return a === b;

}

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

let programId = 0;

// opts{ transformFeedbackVaryings, validateProgram }
function ProgramInfo( vs, fs, opts = {} ) {

    Object.defineProperty( this, 'id', { value: programId ++, writable: false } );
    this._vs = getShaderSrc( vs );
    this._fs = getShaderSrc( fs );
    this.opts = opts;
    this._currentUniformObj = {};
    this._uniformObj = {};
    this.needUpdate = true;

}

Object.assign( ProgramInfo.prototype, {

    setSetters( attrib, uniform ) {

        this._attribSetters = attrib;
        this._uniformSetters = uniform;

    },

    setUniformObjProp( prop, value, equalsFun = equalSign ) {

        if ( this._currentUniformObj[ prop ] === undefined || ! equalsFun( this._currentUniformObj[ prop ], value ) ) {

            this._uniformObj[ prop ] = value;
            this._currentUniformObj[ prop ] = value;

            if ( Array.isArray( value ) )
                this._currentUniformObj[ prop ] = value.slice();
            else if ( equalsFun === PMath.arrayEquals )
                this._currentUniformObj[ prop ] = PMath.arrayClone( value );

        } else if ( value.textureInfo && value.textureInfo.needUpdate ) {

            this._uniformObj[ prop ] = value;
            this._currentUniformObj[ prop ] = value;

        }

    },

    setUniformObj( obj ) {

        Object.keys( obj ).forEach( ( prop ) => {

            if ( obj[ prop ].length && typeof obj[ prop ][ 0 ] === 'number' )
                this.setUniformObjProp( prop, obj[ prop ], PMath.arrayEquals );
            else
                this.setUniformObjProp( prop, obj[ prop ] );

        } );
        return this;

    },

    afterUpdateUniform() {

        this._uniformObj = {};
        return this;

    },

    compile( material, defines ) {

        this._defines = defines;
        this._vs = ShaderFactory.parseVersion( material.version ) +
            ShaderFactory.parseShaderName( material.name ) + '\n' +
            ShaderFactory.parsePrecision( material.vertexPrecision ) + '\n' +
            ShaderFactory.parseDefineObj( this._defines ) + '\n' +
            ShaderFactory.parseIncludes( this._vs );

        this._fs = ShaderFactory.parseVersion( material.version ) +
            ShaderFactory.parseShaderName( material.name ) + '\n' +
            ShaderFactory.parsePrecision( material.fragmentPrecision ) + '\n' +
            ShaderFactory.parseDefineObj( this._defines ) + '\n' +
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

    currentUniformObj: {

        get() {

            return this._currentUniformObj;

        },

    },

    uniformObj: {

        get() {

            return this._uniformObj;

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
