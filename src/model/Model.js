import { Transform } from './Transform';
import { createVertexArray } from '../renderer/vertexArray';
import { createBufferInfoFromArrays } from '../renderer/attributes';
import { CommonVAOShader } from '../shader/CommonVAOShader';
import * as Constant from '../renderer/constant';

let commonVAOShader;
function getDefaultShader( gl ) {

    if ( ! commonVAOShader )
        commonVAOShader = new CommonVAOShader( gl );

    return commonVAOShader;

}

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
        this._needUpdateMatrix = true;
        return this;

    },

    setTransform( transform ) {

        this.transform = transform;
        return this;

    },

    addScale( x, y, z ) {

        this.transform.scale.x += x;
        this.transform.scale.y += y;
        this.transform.scale.z += z;
        this._needUpdateMatrix = true;
        return this;

    },

    addPosition( x, y, z ) {

        this.transform.position.x += x;
        this.transform.position.y += y;
        this.transform.position.z += z;
        this._needUpdateMatrix = true;
        return this;

    },

    addRotation( x, y, z ) {

        this.transform.rotation.x += x;
        this.transform.rotation.y += y;
        this.transform.rotation.z += z;
        this._needUpdateMatrix = true;
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
