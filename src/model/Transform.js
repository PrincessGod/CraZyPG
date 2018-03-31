import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Matrix4 } from '../math/Matrix4';

function Transform() {

    this._position = new Vector3( 0, 0, 0 );
    this._scale = new Vector3( 1, 1, 1 );
    this._rotation = new Vector3( 0, 0, 0 );
    this._quaternion = new Quaternion();
    this.matrix = new Matrix4();
    this.normMat = new Float32Array( 9 );

    this.forward = new Float32Array( 4 );
    this.up = new Float32Array( 4 );
    this.right = new Float32Array( 4 );

    this._needUpdateMatrix = false;

}

Object.defineProperties( Transform.prototype, {

    position: {

        get() {

            return this._position.getArray().slice();

        },

        set( v ) {

            this.setPosition( v );

        },

    },

    scale: {

        get() {

            return this._scale.getArray().slice();

        },

        set( v ) {

            this.setScale( v );

        },

    },

    rotation: {

        get() {

            return this._rotation.getArray().slice();

        },

        set( v ) {

            this.setRotation( v );

        },

    },

    quaternion: {

        get() {

            return this._quaternion.getArray().slice();

        },

        set( v ) {

            this.setQuaternion( v );

        },
    },

} );

Object.assign( Transform.prototype, {

    updateMatrix() {

        if ( this._needUpdateMatrix ) {

            this.matrix.fromTRS( this.position, this.quaternion, this.scale );

            Matrix4.normalMat3( this.normMat, this.matrix.raw );

            Matrix4.transformVec4( this.forward, this.matrix.raw, [ 0, 0, 1, 0 ] );
            Matrix4.transformVec4( this.up, this.matrix.raw, [ 0, 1, 0, 0 ] );
            Matrix4.transformVec4( this.right, this.matrix.raw, [ 1, 0, 0, 0 ] );

            this._needUpdateMatrix = false;

        }

        return this;

    },

    updateDirection() {

        Matrix4.transformVec4( this.forward, this.matrix.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.matrix.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.matrix.raw, [ 1, 0, 0, 0 ] );
        return this;

    },

    getMatrix() {

        return this.matrix.raw;

    },

    getNormalMatrix() {

        return this.normMat;

    },

    reset() {

        this._position.set( 0, 0, 0 );
        this._scale.set( 1, 1, 1 );
        this._rotation.set( 0, 0, 0 );
        this._quaternion.set( 0, 0, 0, 1 );

    },

    updateEuler: ( function () {

        const mat4 = new Matrix4();

        return function updateEular() {

            mat4.reset().applyQuaternion( this._quaternion );
            this._rotation.setFromRotationMatrix( mat4.raw );

        };

    }() ),

    updateQuaternion() {

        this._quaternion.setFromEuler( ...this.rotation );

    },

    setScale( x, y, z ) {

        if ( arguments.length === 1 || ( x !== undefined && y === undefined ) ) {

            if ( x instanceof Vector3 )
                return this.setScale( ...x.getArray() );

            if ( Array.isArray( x ) && x.length === 3 )
                return this.setScale( ...x );

        } else if ( arguments.length === 3 ) {

            this._scale.set( x, y, z );
            this._needUpdateMatrix = true;

        }

        return this;

    },

    setPosition( x, y, z ) {

        if ( arguments.length === 1 || ( x !== undefined && y === undefined ) ) {

            if ( x instanceof Vector3 )
                return this.setPosition( ...x.getArray() );

            if ( Array.isArray( x ) && x.length === 3 )
                return this.setPosition( ...x );

        } else if ( arguments.length === 3 ) {

            this._position.set( x, y, z );
            this._needUpdateMatrix = true;

        }

        return this;

    },

    setRotation( x, y, z ) {

        if ( arguments.length === 1 || ( x !== undefined && y === undefined ) ) {

            if ( x instanceof Vector3 )
                return this.setRotation( ...x.getArray() );

            if ( Array.isArray( x ) && x.length === 3 )
                return this.setRotation( ...x );

        } else if ( arguments.length === 3 ) {

            this._rotation.set( x, y, z );
            this.updateQuaternion();
            this._needUpdateMatrix = true;

        }

        return this;

    },

    setQuaternion( x, y, z, w ) {

        if ( arguments.length === 1 || ( x !== undefined && y === undefined ) ) {

            if ( x instanceof Quaternion )
                return this.setQuaternion( ...( x.getArray() ) );

            if ( Array.isArray( x ) && x.length === 4 )
                return this.setQuaternion( ...x );

        } else if ( arguments.length === 4 ) {

            this._quaternion.set( x, y, z, w );
            this.updateEuler();
            this._needUpdateMatrix = true;

        }

        return this;

    },

    getVec3Position() {

        return this._position;

    },

} );

export { Transform };
