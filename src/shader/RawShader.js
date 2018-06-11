import { Shader } from './Shader';
import { ProgramInfo } from './ProgramInfo';

// opts { ...ProgramInfo.opts,  }
function RawShader( vs, fs, opts ) {

    Shader.call( this, vs, fs, opts );
    this._currentProgramInfo = new ProgramInfo( vs, fs, opts );

}

RawShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: RawShader,

    getProgramInfo( ) {

        return this._currentProgramInfo;

    },


} );

export { RawShader };
