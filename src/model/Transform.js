import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';

class Transform {

    constructor() {

        this.position = new Vector3( 0, 0, 0 );
        this.scale = new Vector3( 1, 1, 1 );
        this.rotation = new Vector3( 0, 0, 0 );
        this.matrix = new Matrix4();
        this.normMatrix = new Float32Array( 9 );

        this.forward = new Float32Array( 4 );
        this.up = new Float32Array( 4 );
        this.right = new Float32Array( 4 );

    }

    updateMatrix() {

        this.matrix.reset()
            .translate( this.position )
            .rotateZ( this.rotation.z )
            .rotateX( this.rotation.x )
            .rotateY( this.rotation.y )
            .scale( this.scale );

        Matrix4.normalMat3( this.normMatrix, this.matrix.raw );

        Matrix4.transformVec4( this.forward, this.matrix.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.matrix.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.matrix.raw, [ 1, 0, 0, 0 ] );

        return this.matrix.raw;

    }

    updateDirection() {

        Matrix4.transformVec4( this.forward, this.matrix.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.matrix.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.matrix.raw, [ 1, 0, 0, 0 ] );
        return this;

    }

    getMatrix() {

        return this.matrix.raw;

    }

    getNormalMatrix() {

        return this.normMatrix;

    }

    reset() {

        this.position.set( 0, 0, 0 );
        this.scale.set( 1, 1, 1 );
        this.rotation.set( 0, 0, 0 );

    }

}

export { Transform };
