import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';

function Transform() {

    this._position = new Vector3( 0, 0, 0 );
    this._scale = new Vector3( 1, 1, 1 );
    this._rotation = new Vector3( 0, 0, 0 );
    this.matrix = new Matrix4();
    this.normMat = new Float32Array( 9 );

    this.forward = new Float32Array( 4 );
    this.up = new Float32Array( 4 );
    this.right = new Float32Array( 4 );

}

Object.defineProperties( Transform.prototype, {

    position: {
        get: function position() {

            return this._position;

        },
    },

    scale: {
        get: function scale() {

            return this._scale;

        },
    },

    rotation: {
        get: function rotation() {

            return this._rotation;

        },
    },

} );

Object.assign( Transform.prototype, {

    updateMatrix() {

        this.matrix.reset()
            .translate( this.position )
            .rotateZ( this.rotation.z )
            .rotateX( this.rotation.x )
            .rotateY( this.rotation.y )
            .scale( this.scale );

        Matrix4.normalMat3( this.normMat, this.matrix.raw );

        Matrix4.transformVec4( this.forward, this.matrix.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.matrix.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.matrix.raw, [ 1, 0, 0, 0 ] );

        return this.matrix.raw;

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

        this.position.set( 0, 0, 0 );
        this.scale.set( 1, 1, 1 );
        this.rotation.set( 0, 0, 0 );

    },

} );

export { Transform };
