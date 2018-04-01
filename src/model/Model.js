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
    this._uniformObj = {};

}

Object.defineProperties( Model.prototype, {

    name: {

        get() {

            return this.mesh.name;

        },

        set( value ) {

            this.mesh.name = value;

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

} );

Object.assign( Model.prototype, {

    isModel: true,

    setScale( ...args ) {

        if ( args[ 0 ] instanceof Transform )
            return this.setScale( ...( args[ 0 ].scale ) );

        this.transform.setScale( ...args );
        return this;

    },

    setPosition( args ) {

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

        this.transform.updateMatrix();
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
