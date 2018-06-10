import { Node } from './Node';
import { ShaderParams } from '../core/constant';

let modelCount = 0;

// opts { enablePick=true }
function Model( primitive, material, opts = {} ) {

    Node.call( this, primitive.name || opts.name || `NO_NAME_MODEL${modelCount ++}` );

    const { enablePick } = opts;
    this.material = material;
    this.primitive = primitive;
    this.enablePick = enablePick === undefined ? true : !! enablePick;
    this._innerUniformObj = {};
    this._innerUniformObj[ ShaderParams.UNIFORM_Model_MAT_NAME ] = this.transform.matrix.raw;
    this._innerUniformObj[ ShaderParams.UNIFORM_NORMAL_MAT_NAME ] = this.transform.normMat;

}

Model.prototype = Object.assign( Object.create( Node.prototype ), {

    constructor: Model,

    setScale( ...args ) {

        this.transform.setScale( ...args );
        return this;

    },

    setPosition( ...args ) {

        this.transform.setPosition( ...args );
        return this;

    },

    setRotation( ...args ) {

        this.transform.setRotation( ...args );
        return this;

    },

    setQuaternion( ...args ) {

        this.transform.setQuaternion( ...args );
        return this;

    },

    setTransform( transform ) {

        this.transform = transform;
        return this;

    },

} );


Object.defineProperties( Model.prototype, {

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

    uniformObj: {

        get() {

            return this._innerUniformObj;

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

export { Model };
