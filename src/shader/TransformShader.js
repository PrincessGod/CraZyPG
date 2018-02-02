import { Shader } from './Shader';
import { createTransformFeedbackInfo, createTransformFeedback } from '../renderer/program';
import { createBufferInfoFromArrays } from '../renderer/attributes';

function TransformShader( gl, vs, fs, transformFeedbackVaryings, transformFeedbackMode ) {

    Shader.call( this, gl, vs, fs, { transformFeedbackVaryings, transformFeedbackMode } );

    this.transformfeedbackInfo = createTransformFeedbackInfo( gl, this.program );
    this._customAttrib = true;
    this.deactivate();

}

TransformShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: TransformShader,

    createBufferInfo( attribArrays ) {

        Object.keys( attribArrays ).forEach( ( prop ) => {

            const options = attribArrays[ prop ];
            if ( typeof options === 'number' )
                attribArrays[ prop ] = { data: options, drawType: this.gl.STREAM_COPY }; // eslint-disable-line
            else
                attribArrays[ prop ].drawType = this.gl.STREAM_COPY; // eslint-disable-line

        } );
        return createBufferInfoFromArrays( this.gl, attribArrays );

    },

    createTransformFeedback( bufferInfo ) {

        return createTransformFeedback( this.gl, this.program, this.transformfeedbackInfo, bufferInfo );

    },

    transform( transformFeedback, model ) {

        this.gl.enable( this.gl.RASTERIZER_DISCARD );

        this.activate();
        this.gl.bindTransformFeedback( this.gl.TRANSFORM_FEEDBACK, transformFeedback );
        this.gl.beginTransformFeedback( model.mesh.drawMode );
        Shader.prototype.renderModel.call( this, model );
        this.gl.endTransformFeedback();
        this.gl.bindTransformFeedback( this.gl.TRANSFORM_FEEDBACK, null );

        this.gl.disable( this.gl.RASTERIZER_DISCARD );

        return this;

    },

} );

export { TransformShader };
