import { Vector3, Vector4, Matrix3, Matrix4, Quaternion, Euler } from '../math';

export class Transform {

    constructor() {

        this._position   = new Vector3( 0, 0, 0 );
        this._scale      = new Vector3( 1, 1, 1 );
        this._rotation   = new Euler( 0, 0, 0 );
        this._quaternion = new Quaternion();
        this._matrix     = new Matrix4();
        this._normMat    = new Matrix3();

        this._forward = new Vector3( 0, 0, 1 );
        this._up      = new Vector3( 0, 1, 0 );
        this._right   = new Vector3( 1, 0, 0 );

        this.needUpdateMatrix = false;

    }

    get position() {

        return this._position;

    }

    get rotation() {

        return this._rotation;

    }

    get quaternion() {

        return this._quaternion;

    }

    get scale() {

        return this._scale;

    }

    get matrix() {

        return this._matrix;

    }

    get normMat() {

        return this._normMat;

    }

    get up() {

        return this._up;

    }

    get right() {

        return this._right;

    }

    get forward() {

        return this._forward;

    }

    static setPosition( so, ...args ) {

        const transform = so.com.Transform;

        if ( args[ 0 ] instanceof Vector3 )
            transform._position.copy( args[ 0 ] );
        else if ( args.length === 3 )
            transform._position.set( ...args );
        else
            return console.error( `unknown position value: ${args}` );

        transform.needUpdateMatrix = true;

        return Transform;

    }

    static setRotation( so, ...args ) {

        const transform = so.com.Transform;

        if ( args[ 0 ] instanceof Vector3 )
            transform._rotation.copy( args[ 0 ] );
        else if ( args.length === 3 )
            transform._rotation.set( ...args );
        else
            return console.error( `unknown rotation value: ${args}` );

        transform._quaternion.setFromEuler( transform._rotation );
        transform.needUpdateMatrix = true;

        return Transform;

    }

    static setQuaternion( so, ...args ) {

        const transform = so.com.Transform;

        if ( args[ 0 ] instanceof Quaternion )
            transform._quaternion.copy( args[ 0 ] );
        else if ( args.length === 4 )
            transform._quaternion.set( ...args );
        else
            return console.error( `unknown quaternion value: ${args}` );

        transform._rotation.setFromQuaternion( transform.quaternion );
        transform.needUpdateMatrix = true;

        return Transform;

    }

    static setScale( so, ...args ) {

        const transform = so.com.Transform;

        if ( args[ 0 ] instanceof Vector3 )
            transform._scale.copy( args[ 0 ] );
        else if ( args.length === 3 )
            transform._scale.set( ...args );
        else
            return console.error( `unknown scale value: ${args}` );

        transform.needUpdateMatrix = true;

        return Transform;

    }

}
