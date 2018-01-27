import { createProgram, createUniformSetters, setUniforms, createAttributesSetters, createUniformBlockSpec, createUniformBlockInfos, setBlockUniformsForProgram } from '../renderer/program';
import * as Constant from '../renderer/constant';
import { _privates } from '../core/properties';
import { PMath } from '../math/Math';
import { Matrix3 } from '../math/Matrix3';
import { Matrix4 } from '../math/Matrix4';

function Shader( gl, vs, fs ) {

    this.cullFace = true;
    this.blend = false;
    this.depth = true;
    this.sampleBlend = false;
    this.shaders = [ vs, fs ];
    this.program = null;
    this.programs = [];
    this.programMap = [];
    this.gl = gl;
    this.camera = null;
    this.currentUniformObj = {};
    this.uniformObj = {};
    this.programInfos = [];
    this.uniformObjs = [];
    this._programUpdated = false;

    this.setDefines();

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

        if ( this.currentUniformObj[ prop ] === undefined || ! equalsFun( this.currentUniformObj[ prop ], value ) ) {

            this.uniformObj[ prop ] = value;
            this.currentUniformObj[ prop ] = value;

            if ( equalsFun === Matrix4.equals )
                this.currentUniformObj[ prop ] = Matrix4.clone( value );
            else if ( equalsFun === Matrix3.equals )
                this.currentUniformObj[ prop ] = Matrix3.clone( value );
            else if ( Array.isArray( value ) )
                this.currentUniformObj[ prop ] = value.slice();
            else if ( equalsFun === PMath.arrayEquals )
                this.currentUniformObj[ prop ] = PMath.arrayClone( value );

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

    setUniforms( uniforms ) {

        setUniforms( this.uniformSetters, uniforms );
        return this;

    },

    setBlockUniforms( uniforms ) {

        setBlockUniformsForProgram( this.gl, this.uniformBlockSpec, this.uniformBlockInfos, uniforms );
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

    setTexture( tex ) {

        this.setUniformObj( { texture: tex } );
        return this;

    },

    setCamera( camera ) {

        this.camera = camera;

    },

    updateCamera() {

        if ( ! this.camera ) return this;

        if ( this._needCamPos )
            this.setUniformObjProp( Constant.UNIFORM_CAMPOS, this.camera.position.getArray(), PMath.arrayEquals );

        this.setProjMatrix( this.camera.projMat );
        this.setViewMatrix( this.camera.viewMat );
        return this;

    },

    dispose() {

        if ( this.gl.getParameter( this.gl.CURRENT_PROGRAM ) === this.program )
            this.gl.useProgram( null );

        this.gl.deleteProgram( this.program );

    },

    preRender() {

        if ( this._programUpdated ) {

            this.activate();
            this.updateCamera();
            this.uniformObj = this.currentUniformObj;
            this._programUpdated = false;

        } else if ( _privates.currentShader !== this ) {

            this.activate();
            this.updateCamera();
            Object.keys( this.currentUniformObj ).forEach( ( prop ) => {

                if ( this.currentUniformObj[ prop ] instanceof WebGLTexture )
                    this.uniformObj[ prop ] = this.currentUniformObj[ prop ];

            } );

        }

        if ( this._needMVPMat && ( Object.hasOwnProperty.call( this.uniformObj, Constant.UNIFORM_WORLD_MAT_NAME )
            || Object.hasOwnProperty.call( this.uniformObj, Constant.UNIFORM_VIEW_MAT_NAME )
            || Object.hasOwnProperty.call( this.uniformObj, Constant.UNIFORM_PROJ_MAT_NAME ) ) ) {

            this.currentUniformObj.temp = Matrix4.mult( Matrix4.identity(), this.currentUniformObj[ Constant.UNIFORM_PROJ_MAT_NAME ], this.currentUniformObj[ Constant.UNIFORM_VIEW_MAT_NAME ] );
            this.currentUniformObj.temp = Matrix4.mult( this.currentUniformObj.temp, this.currentUniformObj.temp, this.currentUniformObj[ Constant.UNIFORM_WORLD_MAT_NAME ] );
            this.setUniformObjProp( Constant.UNIFORM_MVP_MAT_NAME, this.currentUniformObj.temp, Matrix4.equals );

        }


        this.setUniforms( this.uniformObj );
        this.setBlockUniforms( this.uniformObj );
        this.uniformObj = {};

        return this;

    },

    renderModel( model ) {

        if ( ! model.mesh.bufferInfo )
            model.createBufferInfo( this.gl );

        if ( ! model.mesh.vao )
            model.createVAO( this.gl, this._customAttrib ? this : undefined );

        if ( this.cullFace === false || model.mesh.cullFace === false ) this.gl.disable( this.gl.CULL_FACE );

        if ( this.blend || model.mesh.blend ) this.gl.enable( this.gl.BLEND );

        if ( this.depth === false || model.mesh.depth === false ) this.gl.depthMask( false );

        if ( this.sampleBlend || model.mesh.sampleBlend ) this.gl.enable( this.gl.SAMPLE_ALPHA_TO_COVERAGE );

        model.preRender();
        this.setWorldMatrix( model.transform.getMatrix() );
        if ( this._needNormMat )
            this.setUniformObjProp( Constant.UNIFORM_NORMAL_MAT_NAME, model.normMat, Matrix3.equals );

        this.preRender(); // set uniforms

        this.gl.bindVertexArray( model.mesh.vao );

        const bufferInfo = model.mesh.bufferInfo;
        if ( bufferInfo.indices || bufferInfo.elementType )
            this.gl.drawElements( model.mesh.drawMode, bufferInfo.numElements, bufferInfo.elementType === undefined ? this.gl.UNSIGNED_SHORT : bufferInfo.elementType, 0 ); // eslint-disable-line
        else
            this.gl.drawArrays( model.mesh.drawMode, 0, bufferInfo.numElements );

        this.gl.bindVertexArray( null );

        if ( this.cullFace === false || model.mesh.cullFace === false ) this.gl.enable( this.gl.CULL_FACE );

        if ( this.blend || model.mesh.blend ) this.gl.disable( this.gl.BLEND );

        if ( this.depth === false || model.mesh.depth === false ) this.gl.depthMask( true );

        if ( this.sampleBlend || model.mesh.sampleBlend ) this.gl.disable( this.gl.SAMPLE_ALPHA_TO_COVERAGE );

        return this;

    },

    setDefines( ...defines ) {

        if ( defines && defines.length === 1 && ( defines[ 0 ] === undefined || defines[ 0 ] === null ) )
            defines = []; // eslint-disable-line

        if ( defines.length > 0 ) {

            let index = - 1;
            const currentProgNum = this.programMap.length;
            for ( let i = 0; i < currentProgNum; i ++ ) {

                const defs = this.programMap[ i ];
                let equals = false;

                if ( defs.length === defines.length ) {

                    equals = true;
                    for ( let j = 0; j < defines.length; j ++ )
                        if ( defs.indexOf( defines[ j ] ) < 0 ) {

                            equals = false;
                            break;

                        }

                }

                if ( equals ) {

                    index = i;
                    break;

                }

            }

            if ( index < 0 ) {

                this.programs[ currentProgNum ] = createProgram( this.gl, ...Shader.injectDefines( this.shaders, ...defines ) );
                this.program = this.programs[ currentProgNum ];
                this.programMap[ currentProgNum ] = defines;
                this.updateProgram( currentProgNum );
                return this;

            }

            if ( this.program === this.programs[ index ] )
                return this;

            this.program = this.programs[ index ];
            this.updateProgram( index );
            return this;

        }


        if ( this.programMap.length > 0 ) {

            if ( this.program === this.programs[ 0 ] )
                return this;

            this.program = this.programs[ 0 ];
            this.updateProgram( 0 );
            return this;

        }

        this.programs[ 0 ] = createProgram( this.gl, ...this.shaders );
        this.program = this.programs[ 0 ];
        this.programMap[ 0 ] = [];
        this.updateProgram( 0 );
        return this;

    },

    updateProgram( index = - 1 ) {

        if ( index > - 1 && index < this.programInfos.length ) {

            this.attribSetters = this.programInfos[ index ].attribSetters;
            this.uniformSetters = this.programInfos[ index ].uniformSetters;
            this.uniformBlockSpec = this.programInfos[ index ].uniformBlockSpec;
            this.uniformBlockInfos = this.programInfos[ index ].uniformBlockInfos;
            this._needMVPMat = this.programInfos[ index ]._needMVPMat;
            this._needCamPos = this.programInfos[ index ]._needCamPos;
            this._needNormMat = this.programInfos[ index ]._needNormMat;
            this._customAttrib = this.programInfos[ index ]._customAttrib;

        } else {

            this.gl.useProgram( this.program );
            this.attribSetters = createAttributesSetters( this.gl, this.program );
            this.uniformSetters = createUniformSetters( this.gl, this.program );
            this.uniformBlockSpec = createUniformBlockSpec( this.gl, this.program );
            this.uniformBlockInfos = createUniformBlockInfos( this.gl, this.program, this.uniformBlockSpec );
            this._needMVPMat = Object.prototype.hasOwnProperty.call( this.uniformSetters, Constant.UNIFORM_MVP_MAT_NAME );
            this._needCamPos = Object.prototype.hasOwnProperty.call( this.uniformSetters, Constant.UNIFORM_CAMPOS );
            this._needNormMat = Object.prototype.hasOwnProperty.call( this.uniformSetters, Constant.UNIFORM_NORMAL_MAT_NAME );
            this._customAttrib = Object.keys( this.attribSetters ).filter( attrib => [ Constant.ATTRIB_POSITION_NAME, Constant.ATTRIB_UV_NAME, Constant.ATTRIB_NORMAL_NAME, Constant.ATTRIB_BARYCENTRIC_NAME ].indexOf( attrib ) < 0 ).length > 0;
            this.programInfos[ index ] = {
                attribSetters: this.attribSetters,
                uniformSetters: this.uniformSetters,
                uniformBlockSpec: this.uniformBlockSpec,
                uniformBlockInfos: this.uniformBlockInfos,
                _needMVPMat: this._needMVPMat,
                _needCamPos: this._needCamPos,
                _needNormMat: this._needNormMat,
                _customAttrib: this._customAttrib,
            };
            this.uniformObjs[ index ] = Object.assign( {}, this.currentUniformObj );

        }

        _privates.currentShader = null;
        this._programUpdated = true;
        this.currentUniformObj = this.uniformObjs[ index ];

    },

} );

function insertToString( string, position, value ) {

    return [ string.slice( 0, position ), value, string.slice( position ) ].join( '' );

}

Object.assign( Shader, {

    injectDefines( shader, ...defines ) {

        if ( Array.isArray( shader ) )
            return shader.map( shadersrc => Shader.injectDefines( shadersrc, ...defines ) );

        const index = shader.indexOf( '\n' ) + 1;
        let newShader = shader;

        let define;
        for ( let i = 0; i < defines.length; i ++ ) {

            define = `#define ${defines[ i ]}\n`;
            if ( shader.indexOf( define ) < 0 )
                newShader = insertToString( shader, index, define );

        }

        return newShader;

    },

    removeDefines( shader, ...defines ) {

        let newShader = shader;

        let define;
        for ( let i = 0; i < defines.length; i ++ ) {

            define = `#define ${defines[ i ]}\n`;
            if ( shader.indexOf( define ) > 0 )
                newShader = newShader.replace( define, '' );

        }

        return newShader;

    },

} );

export { Shader };
