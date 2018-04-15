import { Transform } from './Transform';
import { createVertexArray } from '../renderer/vertexArray';
import { createBufferInfoFromArrays } from '../renderer/attributes';
import { CommonVAOShader } from '../shader/CommonVAOShader';
import * as Constant from '../renderer/constant';

const getDefaultShader = ( function () {

    let commonVAOShader;

    return function getDefaultShader( gl ) { // eslint-disable-line

        if ( ! commonVAOShader )
            commonVAOShader = new CommonVAOShader( gl );

        return commonVAOShader;

    };

}() );


function Model( mesh ) {

    this.mesh = mesh;
    this.enablePick = true;
    this.transform = new Transform();
    this.node = null;
    this._uniformObj = {};

}

Object.defineProperties( Model.prototype, {

    isModel: {

        get() {

            return true;

        },

    },

    name: {

        get() {

            return this._name || this.mesh.name;

        },

        set( value ) {

            this._name = value;

        },

    },

    normMat: {

        get() {

            return this.transform.normMat;

        },

    },

    matrix: {

        get() {

            return this.transform.matrix.raw;

        },

    },

    positionInfo: {

        get() {

            return this.mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ];

        },

    },

    uvInfo: {

        get() {

            return this.mesh.attribArrays[ Constant.ATTRIB_UV_NAME ];

        },

    },

    normalInfo: {

        get() {

            return this.mesh.attribArrays[ Constant.ATTRIB_NORMAL_NAME ];

        },

    },

    uniformObj: {

        get() {

            return this._uniformObj;

        },

    },

    position: {

        get() {

            return this.transform.position;

        },

        set( array ) {

            this.setPosition( array );

        },
    },

    scale: {

        get() {

            return this.transform.scale;

        },

        set( array ) {

            this.setScale( array );

        },

    },

    rotation: {

        get() {

            return this.transform.rotation;

        },

        set( array ) {

            this.setRotation( array );

        },

    },

    quaternion: {

        get() {

            return this.transform.quaternion;

        },

        set( arrayQuat ) {

            this.setQuaternion( arrayQuat );

        },

    },

    drawMode: {

        get() {

            if ( this._drawMode !== undefined )
                return this._drawMode;
            return this.mesh.drawMode;

        },

        set( v ) {

            this._drawMode = v;

        },

    },

    cullFace: {

        get() {

            if ( this._cullFace !== undefined )
                return this._cullFace;
            return this.mesh.cullFace;

        },

        set( v ) {

            this._cullFace = v;

        },

    },

    blend: {

        get() {

            if ( this._blend !== undefined )
                return this._blend;
            return this.mesh.blend;

        },

        set( v ) {

            this._blend = v;

        },

    },

    depth: {

        get() {

            if ( this._depth !== undefined )
                return this._depth;
            return this.mesh.depth;

        },
        set( v ) {

            this._depth = v;

        },

    },

    sampleBlend: {

        get() {

            if ( this._sampleBlend !== undefined )
                return this._sampleBlend;
            return this.mesh.sampleBlend;

        },

        set( v ) {

            this._sampleBlend = v;

        },

    },

    instanceCount: {

        get() {

            if ( this._instanceCount !== undefined )
                return this._instanceCount;
            return this.mesh.instanceCount;

        },

        set( v ) {

            this._instanceCount = v;

        },

    },

    offset: {

        get() {

            if ( this._offset !== undefined )
                return this._offset;
            return this.mesh.offset;

        },

        set( v ) {

            this._offset = v;

        },

    },

} );

Object.assign( Model.prototype, {

    setScale( ...args ) {

        if ( args[ 0 ] instanceof Transform )
            return this.setScale( ...( args[ 0 ].scale ) );

        this.transform.setScale( ...args );
        return this;

    },

    setPosition( ...args ) {

        if ( args[ 0 ] instanceof Transform )
            return this.setPosition( ...( args[ 0 ].position.getArray() ) );

        this.transform.setPosition( ...args );
        return this;

    },

    setRotation( ...args ) {

        if ( args[ 0 ] instanceof Transform )
            return this.setRotation( ...( args[ 0 ].rotation.getArray() ) );

        this.transform.setRotation( ...args );
        return this;

    },

    setQuaternion( ...args ) {

        if ( args[ 0 ] instanceof Transform )
            return this.setQuaternion( ...( args[ 0 ].quaternion.getArray() ) );

        this.setQuaternion( ...args );
        return this;

    },

    setTransform( transform ) {

        this.transform = transform;
        return this;

    },

    preRender() {

        return this;

    },

    createVAO( gl, shader = getDefaultShader( gl ) ) {

        this.mesh.vao = createVertexArray( gl, this.mesh.bufferInfo, shader.program, shader.attribSetters );
        return this;

    },

    createBufferInfo( gl ) {

        this.mesh.bufferInfo = createBufferInfoFromArrays( gl, this.mesh.attribArrays );
        this.bufferInfo = this.mesh.bufferInfo;
        return this;

    },

    setUniformObj( obj ) {

        Object.assign( this._uniformObj, obj );
        return this;

    },

} );

export { Model };
