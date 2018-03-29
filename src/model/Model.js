import { Transform } from './Transform';
import { createVertexArray } from '../renderer/vertexArray';
import { createBufferInfoFromArrays } from '../renderer/attributes';
import { CommonVAOShader } from '../shader/CommonVAOShader';
import * as Constant from '../renderer/constant';
import { Matrix4 } from '../math/Matrix4';

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
    this._needUpdateMatrix = false;
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

} );

Object.assign( Model.prototype, {

    isModel: true,

    setScale( x, y, z ) {

        if ( x instanceof Transform )
            return this.setScale( ...( x.scale.getArray() ) );

        if ( Array.isArray( x ) && x.length === 3 )
            return this.setScale( ...x );

        this.transform.scale.set( x, y, z );
        this._needUpdateMatrix = true;
        return this;

    },

    setPosition( x, y, z ) {

        if ( x instanceof Transform )
            return this.setPosition( ...( x.position.getArray() ) );

        if ( Array.isArray( x ) && x.length === 3 )
            return this.setPosition( ...x );

        this.transform.position.set( x, y, z );
        this._needUpdateMatrix = true;
        return this;

    },

    setRotation( x, y, z ) {

        if ( x instanceof Transform )
            return this.setRotation( ...( x.rotation.getArray() ) );

        if ( Array.isArray( x ) && x.length === 3 )
            return this.setRotation( ...x );

        this.transform.rotation.set( x, y, z );
        this.transform.quaternion.setFromEuler( x, y, z );
        this._needUpdateMatrix = true;
        return this;

    },

    setQuaternion: ( function () {

        const mat4 = new Matrix4();

        return function ( x, y, z, w ) {

            if ( x instanceof Transform )
                return this.setQuaternion( ...( x.quaternion.getArray() ) );

            if ( x.w !== undefined )
                return this.setQuaternion( ...( x.getArray() ) );

            if ( Array.isArray( x ) && x.length === 4 )
                return this.setQuaternion( ...x );

            this.transform.quaternion.set( x, y, z, w );
            mat4.reset().applyQuaternion( this.transform.quaternion );
            this.transform.rotation.setFromRotationMatrix( mat4.raw );
            this._needUpdateMatrix = true;
            return this;

        };

    }() ),

    setTransform( transform ) {

        this.transform = transform;
        return this;

    },

    preRender() {

        if ( this._needUpdateMatrix ) {

            this.transform.updateMatrix();
            this._needUpdateMatrix = false;

        }

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
