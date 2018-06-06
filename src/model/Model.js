import { Node } from './Node';
import { Primitive } from './Primitive';

let modelCount = 0;

// opts { ...Primitive.opts, enablePick=true, material }
function Model( primitiveLike, opts = {} ) {

    Node.call( this, primitiveLike.name || opts.name || `NO_NAME_MODEL${modelCount ++}` );

    let primitive = primitiveLike;
    if ( ! ( primitiveLike instanceof Primitive ) )
        primitive = new Primitive( primitiveLike, opts );

    const { material, enablePick } = opts;
    this.material = material;
    this.primitive = primitive;
    this.enablePick = enablePick === undefined ? true : !! enablePick;
    this._uniformObj = {};

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

            return Object.assign( this._uniformObj, {
                u_modelMat: this.transform.matrix.raw,
                u_normalMat: this.transform.normMat,
            } );

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
