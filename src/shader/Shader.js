import { createProgram, createUniformSetters, setUniforms, createAttributesSetters } from '../renderer/program';
import * as Constant from '../renderer/constant';

function Shader( gl, vs, fs ) {

    this.program = createProgram( gl, vs, fs );

    if ( this.program !== null ) {

        this.gl = gl;
        gl.useProgram( this.program );
        this.attribSetters = createAttributesSetters( gl, this.program );
        this.uniformSetters = createUniformSetters( gl, this.program );

    }

}

Object.assign( Shader.prototype, {

    activate() {

        this.gl.useProgram( this.program );
        return this;

    },

    deactivate() {

        this.gl.useProgram( null );
        return this;

    },

    setUniforms( uniforms ) {

        setUniforms( this.uniformSetters, uniforms );

    },

    setProjMatrix( mat4Array ) {

        this.setUniforms( Object.defineProperty( {}, Constant.UNIFORM_PROJ_MAT_NAME, { value: mat4Array, enumerable: true } ) );
        return this;

    },

    setViewMatrix( mat4Array ) {

        this.setUniforms( Object.defineProperty( {}, Constant.UNIFORM_VIEW_MAT_NAME, { value: mat4Array, enumerable: true } ) );
        return this;

    },

    setWorldMatrix( mat4Array ) {

        this.setUniforms( Object.defineProperty( {}, Constant.UNIFORM_WORLD_MAT_NAME, { value: mat4Array, enumerable: true } ) );
        return this;

    },

    dispose() {

        if ( this.gl.getParameter( this.gl.CURRENT_PROGRAM ) === this.program )
            this.gl.useProgram( null );

        this.gl.deleteProgram( this.program );

    },

    preRender() {}, // eslint-disable-line

    renderModel( model ) {

        if ( ! model.mesh.bufferInfo )
            model.createBufferInfo( this.gl );

        if ( ! model.mesh.vao )
            model.createVAO( this.gl, this.program );

        if ( model.mesh.cullFace === false ) this.gl.disable( this.gl.CULL_FACE );

        if ( model.mesh.blend ) this.gl.enable( this.gl.BLEND );

        this.setWorldMatrix( model.transform.getMatrix() );
        this.gl.bindVertexArray( model.mesh.vao );

        const bufferInfo = model.mesh.bufferInfo;
        if ( bufferInfo.indices || bufferInfo.elementType )
            this.gl.drawElements( model.mesh.drawMode, bufferInfo.numElements, bufferInfo.elementType === undefined ? this.gl.UNSIGNED_SHORT : bufferInfo.elementType, 0 ); // eslint-disable-line
        else
            this.gl.drawArrays( model.mesh.drawMode, 0, bufferInfo.numElements );

        this.gl.bindVertexArray( null );

        if ( model.mesh.cullFace === false ) this.gl.enable( this.gl.CULL_FACE );

        if ( model.mesh.blend ) this.gl.disable( this.gl.BLEND );

        return this;

    },

} );

export { Shader };
