import { createProgram, createUniformSetters, setUniforms, createAttributesSetters } from '../renderer/program';
import * as Constant from '../renderer/constant';
import { _privates } from '../core/properties';
import { Matrix4 } from '../CZPG';

function Shader( gl, vs, fs ) {

    this.program = createProgram( gl, vs, fs );

    if ( this.program !== null ) {

        this.gl = gl;
        gl.useProgram( this.program );

        this.attribSetters = createAttributesSetters( gl, this.program );
        this.uniformSetters = createUniformSetters( gl, this.program );

        this.currentUniformObj = {};
        this.uniformObj = {};

    }

}

function equalSign( a, b ) {

    return a === b;

}

Object.assign( Shader.prototype, {

    activate() {

        this.gl.useProgram( this.program );
        _privates.currentShader = this;
        return this;

    },

    deactivate() {

        this.gl.useProgram( null );
        _privates.currentShader = null;
        return this;

    },

    setUniformObjProp( prop, value, equalsFun = equalSign ) {

        if ( this.currentUniformObj[ prop ] === undefined || ! equalsFun( this.currentUniformObj[ prop ], value ) || value instanceof WebGLTexture ) {

            this.uniformObj[ prop ] = value;
            this.currentUniformObj[ prop ] = value;

            if ( equalsFun === Matrix4.equals )
                this.currentUniformObj[ prop ] = Matrix4.clone( value );

            if ( Array.isArray( value ) )
                this.currentUniformObj[ prop ] = value.slice();

        }

    },

    setUniformObj( obj ) {

        Object.keys( obj ).forEach( ( prop ) => {

            if ( obj[ prop ].length === 16 && typeof obj[ prop ][ 0 ] === 'number' )
                this.setUniformObjProp( prop, obj[ prop ], Matrix4.equals );
            else
                this.setUniformObjProp( prop, obj[ prop ] );

        } );
        return this;

    },

    setUniforms( uniforms ) {

        setUniforms( this.uniformSetters, uniforms );
        return this;

    },

    setProjMatrix( mat4Array ) {

        this.setUniformObjProp( Constant.UNIFORM_PROJ_MAT_NAME, mat4Array, Matrix4.equals );
        return this;

    },

    setViewMatrix( mat4Array ) {

        this.setUniformObjProp( Constant.UNIFORM_VIEW_MAT_NAME, mat4Array, Matrix4.equals );
        return this;

    },

    setWorldMatrix( mat4Array ) {

        this.setUniformObjProp( Constant.UNIFORM_WORLD_MAT_NAME, mat4Array, Matrix4.equals );
        return this;

    },

    setCamera( camera ) {

        this.setProjMatrix( camera.projMat );
        this.setViewMatrix( camera.viewMat );
        return this;

    },

    dispose() {

        if ( this.gl.getParameter( this.gl.CURRENT_PROGRAM ) === this.program )
            this.gl.useProgram( null );

        this.gl.deleteProgram( this.program );

    },

    preRender() {

        if ( _privates.currentShader !== this ) {

            this.activate();
            Object.keys( this.currentUniformObj ).forEach( ( prop ) => {

                if ( this.currentUniformObj[ prop ] instanceof WebGLTexture )
                    this.uniformObj[ prop ] = this.currentUniformObj[ prop ];

            } );

        }

        this.setUniforms( this.uniformObj );
        this.uniformObj = {};

        return this;

    },

    renderModel( model ) {

        if ( ! model.mesh.bufferInfo )
            model.createBufferInfo( this.gl );

        if ( ! model.mesh.vao )
            model.createVAO( this.gl, this.program );

        if ( model.mesh.cullFace === false ) this.gl.disable( this.gl.CULL_FACE );

        if ( model.mesh.blend ) this.gl.enable( this.gl.BLEND );

        this.setWorldMatrix( model.transform.getMatrix() );
        this.preRender(); // set uniforms

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
