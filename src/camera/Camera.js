import { Matrix4 } from '../math/Matrix4';
import { Transform } from '../model/Transform';
import { Vector3 } from '../math/Vector3';
import { PMath } from '../math/Math';

class Camera {

    constructor() {

        this.projMat = new Float32Array( 16 );
        this.viewMat = Matrix4.identity();
        this.matrix = Matrix4.identity();
        this.transform = new Transform();

    }

}

class PerspectiveCamera extends Camera {

    constructor( fov = 45, aspect, near = 0.01, far = 1000 ) {

        super();

        this._fov = fov;
        this.fovRadian = PMath.degree2Radian( this._fov );
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.target = new Vector3();
        this.up = [ 0, 1, 0 ];
        Matrix4.perspective( this.projMat, this.fovRadian, aspect, near, far );

    }

    get fov() {

        return this._fov;

    }

    set fov( degree ) {

        this._fov = degree;
        this.fovRadian = PMath.degree2Radian( this._fov );

    }

    updateProjMatrix( aspect ) {

        if ( aspect && aspect !== this.aspect )
            this.aspect = aspect;

        Matrix4.perspective( this.projMat, this.fov, this.aspect, this.near, this.far );

    }

    updateViewMatrix( target ) {

        if ( target )
            this.target = target;

        Matrix4.lookAt( this.viewMat, this.transform.position.getArray(), this.target.getArray(), this.up );
        Matrix4.invert( this.matrix, this.viewMat );

    }

    getOrientMatrix() {

        const mat = new Float32Array( this.viewMat );
        mat[ 12 ] = mat[ 13 ] = mat[ 14 ] = 0.0; // eslint-disable-line
        return mat;

    }

}

export { PerspectiveCamera };
