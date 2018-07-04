import { objEqual } from '../core/utils';
import { ShaderFactory } from './ShaderFactory';
import { ProgramInfo } from './ProgramInfo';

// opts { ...ProgramInfo.opts, useLight  }
function Shader( vs, fs, opts = {} ) {

    this._vs = vs;
    this._fs = fs;
    this._opts = opts;
    this._useLight = !! opts.useLight;
    this._currentProgramInfo = null;
    this._programInfos = [];

}

Object.assign( Shader.prototype, {

    getProgramInfo( primitive, material, lightDefine, fogDefine, rendererDefine ) {

        let target;
        const primitiveDefine = ShaderFactory.parseDefineObjFromPrimitive( primitive );
        const materialDefine = ShaderFactory.parseDefineObjFromMaterial( material );
        const defines = Object.assign( primitiveDefine, materialDefine, this._useLight ? lightDefine : {}, material.fog ? fogDefine : {}, rendererDefine );
        for ( let i = 0; i < this._programInfos.length; i ++ )
            if ( objEqual( defines, this._programInfos[ i ].defines ) ) {

                target = this._programInfos[ i ];
                if ( target !== this._currentProgramInfo )
                    this._currentProgramInfo = target;

            }

        if ( ! target ) {

            const programInfo = new ProgramInfo( this._vs, this._fs );
            programInfo.compile( material, defines );
            this._currentProgramInfo = programInfo;
            this._programInfos.push( programInfo );

        }

        return this._currentProgramInfo;

    },

    preRender() {

        return this;

    },

    afterRender() {

        return this;

    },

} );

Object.defineProperties( Shader.prototype, {

} );

export { Shader };
