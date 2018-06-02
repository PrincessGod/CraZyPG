import { Node } from './Node';
import { Primitive } from './Primitive';

let modelCount = 0;

function Model( primitiveLike, props = {} ) {

    Node.call( this, props.name || `NO_NAME_MODEL${modelCount ++}` );

    let primitive = primitiveLike;
    if ( ! ( primitiveLike instanceof Primitive ) )
        primitive = new Primitive( primitiveLike, props );

    const { enablePick, uniformObj } = props;
    this.primitive = primitive;
    this.enablePick = enablePick === undefined ? true : !! enablePick;
    this._uniformObj = uniformObj || {};

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

    setUniformObj( obj ) {

        Object.assign( this._uniformObj, obj );
        return this;

    },

} );


Object.defineProperties( Model.prototype, {

    isModel: {

        get() {

            return true;

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
            return this.primitive.drawMode;

        },

        set( v ) {

            this._drawMode = v;

        },

    },

    cullFace: {

        get() {

            if ( this._cullFace !== undefined )
                return this._cullFace;
            return this.primitive.cullFace;

        },

        set( v ) {

            this._cullFace = v;

        },

    },

    blend: {

        get() {

            if ( this._blend !== undefined )
                return this._blend;
            return this.primitive.blend;

        },

        set( v ) {

            this._blend = v;

        },

    },

    depth: {

        get() {

            if ( this._depth !== undefined )
                return this._depth;
            return this.primitive.depth;

        },
        set( v ) {

            this._depth = v;

        },

    },

    sampleBlend: {

        get() {

            if ( this._sampleBlend !== undefined )
                return this._sampleBlend;
            return this.primitive.sampleBlend;

        },

        set( v ) {

            this._sampleBlend = v;

        },

    },

    polygonOffset: {

        get() {

            if ( this._polygonOffset !== undefined )
                return this._polygonOffset;
            return this.primitive.polygonOffset;

        },

        set( v ) {

            this._polygonOffset = v;

        },

    },

    instanceCount: {

        get() {

            if ( this._instanceCount !== undefined )
                return this._instanceCount;
            return this.primitive.instanceCount;

        },

        set( v ) {

            this._instanceCount = v;

        },

    },

} );

export { Model };
