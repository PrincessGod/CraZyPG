import { Matrix4 } from '../math/Matrix4';
import { Transform } from '../model/Transform';

class Camera {

    constructor() {

        this.projMat = new Float32Array( 16 );
        this.viewMat = Matrix4.identity();
        this.transform = new Transform();

    }

}

class PerspectiveCamera extends Camera {

    constructor( fov = 45, aspect, near = 0.01, far = 1000 ) {

        super();

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.target = [ 0, 0, 0 ];
        this.up = [ 0, 1, 0 ];
        Matrix4.perspective( this.projMat, fov, aspect, near, far );

    }

    updateProjMatrix( aspect ) {

        if ( aspect !== undefined && aspect !== this.aspect )
            this.aspect = aspect;

        Matrix4.perspective( this.projMat, this.fov, this.aspect, this.near, this.far );

    }

    updateViewMatrix( target ) {

        if ( target )
            this.target = target;

        Matrix4.lookAt( this.viewMat, this.transform.position.getArray(), this.target, this.up );

    }

}

export { PerspectiveCamera };
