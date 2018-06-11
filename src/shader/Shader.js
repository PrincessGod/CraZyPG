import { PMath } from '../math/Math';
import { Matrix3 } from '../math/Matrix3';
import { Matrix4 } from '../math/Matrix4';
import { objEqual } from '../core/utils';
import { ShaderFactory } from './ShaderFactory';
import { ProgramInfo } from './ProgramInfo';

function equalSign( a, b ) {

    return a === b;

}

// opts { ...ProgramInfo.opts,  }
function Shader( vs, fs, opts ) {

    this._vs = vs;
    this._fs = fs;
    this._opts = opts;
    this._currentProgramInfo = null;
    this._programInfos = [];
    this._currentUniformObj = {};
    this._uniformObjs = [];
    this._uniformObj = {};

}

Object.assign( Shader.prototype, {

    setUniformObjProp( prop, value, equalsFun = equalSign ) {

        if ( this._currentUniformObj[ prop ] === undefined || ! equalsFun( this._currentUniformObj[ prop ], value ) ) {

            this._uniformObj[ prop ] = value;
            this._currentUniformObj[ prop ] = value;

            if ( equalsFun === Matrix4.equals )
                this._currentUniformObj[ prop ] = Matrix4.clone( value );
            else if ( equalsFun === Matrix3.equals )
                this._currentUniformObj[ prop ] = Matrix3.clone( value );
            else if ( Array.isArray( value ) )
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

            if ( obj[ prop ].length === 16 && typeof obj[ prop ][ 0 ] === 'number' )
                this.setUniformObjProp( prop, obj[ prop ], Matrix4.equals );
            else if ( obj[ prop ].length === 9 && typeof obj[ prop ][ 0 ] === 'number' )
                this.setUniformObjProp( prop, obj[ prop ], Matrix3.equals );
            else if ( obj[ prop ].length && typeof obj[ prop ][ 0 ] === 'number' )
                this.setUniformObjProp( prop, obj[ prop ], PMath.arrayEquals );
            else
                this.setUniformObjProp( prop, obj[ prop ] );

        } );
        return this;

    },

    getProgramInfo( primitive, material ) {

        let target;
        const primitiveDefine = ShaderFactory.parseDefineObjFromPrimitive( primitive );
        const materialDefine = ShaderFactory.parseDefineObjFromMaterial( material );
        const defines = Object.assign( primitiveDefine, materialDefine );
        for ( let i = 0; i < this._programInfos.length; i ++ )
            if ( objEqual( defines, this._programInfos[ i ].defines ) ) {

                target = this._programInfos[ i ];
                if ( target !== this._currentProgramInfo ) {

                    this._currentProgramInfo = target;
                    this._currentUniformObj = this._uniformObjs[ this._programInfos.indexOf( this._currentProgramInfo ) ];
                    this._uniformObj = this._currentUniformObj;

                }

            }

        if ( ! target ) {

            const programInfo = new ProgramInfo( this._vs, this._fs );
            programInfo.compile( primitive, material );
            this._currentProgramInfo = programInfo;
            this._programInfos.push( programInfo );
            this._uniformObjs.push( this._currentUniformObj );
            this._currentUniformObj = {};

        }

        return this._currentProgramInfo;

    },

    preRender() {

        return this;

    },

    afterRender() {

        this._uniformObj = {};
        return this;

    },

} );

Object.defineProperties( Shader.prototype, {

    uniformObj: {

        get() {

            return this._uniformObj;

        },

    },

} );

export { Shader };
