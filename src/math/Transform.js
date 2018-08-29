import { isArrayBuffer } from '../core/typedArray';
import { Vector3, Vector4, Matrix3, Matrix4, Quaternion, Euler } from '../math/index';

const ForwardDir = new Vector4( 0, 0, 1, 0 );
const UpDir = new Vector4( 0, 1, 0, 0 );
const RightDir = new Vector4( 1, 0, 0, 0 );

export class Transform {

    constructor() {

        this._position = new Vector3( 0, 0, 0 );
        this._scale = new Vector3( 1, 1, 1 );
        this._rotation = new Euler( 0, 0, 0 );
        this._quaternion = new Quaternion();
        this.matrix = new Matrix4();
        this.normMat = new Matrix3();
        this.worldMatrix = new Matrix4();

        this.forward = new Vector4();
        this.up = new Vector4();
        this.right = new Vector4();
        this.forwardNormaled = new Vector3( 0, 0, 1 );
        this.upNormaled = new Vector3( 0, 1, 0 );
        this.rightNormaled = new Vector3( 1, 0, 0 );

        this._needUpdateMatrix = false;

    }

    static get forwardDir() {

        return ForwardDir;

    }

    static get upDir() {

        return UpDir;

    }

    static get rightDir() {

        return RightDir;

    }

    get position() {

        return this._position;

    }

    set position( v ) {

        this.setPosition( v );

    }

    get rotation() {

        return this._rotation;

    }

    set rotation( v ) {

        this.setRotation( v );

    }

    get quaternion() {

        return this._quaternion;

    }

    set quaternion( v ) {

        this.setQuaternion( v );

    }

    get scale() {

        return this._scale;

    }

    set scale( v ) {

        this.setScale( v );

    }

    updateMatrix() {

        if ( this._needUpdateMatrix ) {

            this.matrix.setFromTRS( this._position, this._quaternion, this._scale );
            this._needUpdateMatrix = false;

        }

        return this;

    }

    updateNormalMatrix() {

        Matrix4.getNormalMatrix3( this.normMat, this.worldMatrix );
        return this;

    }

    updateDirection() {

        Vector4.transfromMatrix4( this.forward, Transform.forwardDir, this.worldMatrix );
        Vector4.transfromMatrix4( this.up, Transform.upDir, this.worldMatrix );
        Vector4.transfromMatrix4( this.right, Transform.rightDir, this.worldMatrix );
        this.forwardNormaled.copy( this.forward ).normalize();
        this.upNormaled.copy( this.up ).normalize();
        this.rightNormaled.copy( this.right ).normalize();
        return this;

    }

    copyToWorldMatrix() {

        Matrix4.copy( this.worldMatrix, this, this.matrix );
        return this;

    }

    markNeedUpdate( state ) {

        this._needUpdateMatrix = !! state;

    }

    setPosition( ...args ) {

        this.markNeedUpdate( true );

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Vector3 )
                this._position.copy( args[ 0 ] );

            if ( ( Array.isArray( args[ 0 ] ) || isArrayBuffer( args[ 0 ] ) ) && args[ 0 ].length === 3 )
                this._position.set( ...args[ 0 ] );

        } else if ( args.length === 3 )
            this._position.set( ...args );

        return this;

    }

    setScale( ...args ) {

        this.markNeedUpdate( true );

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Vector3 )
                this._scale.copy( args[ 0 ] );

            if ( ( Array.isArray( args[ 0 ] ) || isArrayBuffer( args[ 0 ] ) ) && args[ 0 ].length === 3 )
                this._scale.set( ...args[ 0 ] );

        } else if ( args.length === 3 )
            this._scale.set( ...args );

        return this;

    }

    setRotation( ...args ) {

        this.markNeedUpdate( true );

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Vector3 )
                this._rotation.copy( args[ 0 ] );

            if ( ( Array.isArray( args[ 0 ] ) || isArrayBuffer( args[ 0 ] ) ) && args[ 0 ].length === 3 )
                this._rotation.set( ...args[ 0 ] );

        } else if ( args.length === 3 )
            this._rotation.set( ...args );

        this._quaternion.setFromEuler( this._rotation );


        return this;

    }

    setQuaternion( ...args ) {

        this.markNeedUpdate( true );

        if ( args.length === 1 ) {

            if ( args[ 0 ] instanceof Quaternion )
                this._quaternion.copy( args[ 0 ] );

            if ( ( Array.isArray( args[ 0 ] ) || isArrayBuffer( args[ 0 ] ) ) && args[ 0 ].length === 4 )
                this._quaternion.set( ...args[ 0 ] );

        } else if ( args.length === 4 )
            this._quaternion.set( ...args );

        this._rotation.setFromQuaternion( this._quaternion );

        return this;

    }

    clone() {

        const transform = new Transform();
        transform.position = this._position.clone();
        transform.quaternion = this._quaternion.clone();
        transform.scale = this._scale.clone();
        return transform;

    }

}
