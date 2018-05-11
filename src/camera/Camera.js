import { Matrix4 } from '../math/Matrix4';
import { Transform } from '../model/Transform';
import { Vector3 } from '../math/Vector3';
import { PMath } from '../math/Math';

function Camera() {

    this.transform = new Transform();
    this.projMat = Matrix4.identity();
    this.viewMat = Matrix4.identity();
    this.target = new Vector3();
    this.up = new Vector3( 0, 1, 0 );

}

Object.defineProperties( Camera.prototype, {

    position: {

        get() {

            return this.transform.position;

        },

        set( v ) {

            this.transform.position = v;

        },

    },

    matrix: {

        get() {

            return this.transform.matrix.raw;

        },

    },

    vec3Position: {

        get() {

            return this.transform.vec3Position;

        },

    },

} );

Object.assign( Camera.prototype, {

    getOrientMatrix() {

        const mat = new Float32Array( this.viewMat );
        mat[ 12 ] = mat[ 13 ] = mat[ 14 ] = 0.0; // eslint-disable-line
        return mat;

    },

    lookAt( target ) {

        if ( target )
            this.target = target;

        Matrix4.lookAt( this.viewMat, this.transform.position, this.target.getArray(), this.up.getArray() );
        Matrix4.invert( this.matrix, this.viewMat );
        Matrix4.decompose( this.matrix, this.transform.vec3Position.raw, this.transform.quatQuaternion.raw, this.transform.vec3Scale.raw );
        this.transform.quaternion = this.transform.quaternion; // update rotation

        return this;

    },

} );

function PerspectiveCamera( fov = 45, aspect = 1.5, near = 0.01, far = 1000 ) {

    Camera.call( this );

    this._fov = fov;
    this.fovRadian = PMath.degree2Radian( this._fov );
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    Matrix4.perspective( this.projMat, this.fovRadian, aspect, near, far );

}

PerspectiveCamera.prototype = Object.assign( Object.create( Camera.prototype ), {

    isPerspectiveCamera: true,

    updateProjMatrix( aspect ) {

        if ( aspect && aspect !== this.aspect )
            this.aspect = aspect;

        Matrix4.perspective( this.projMat, this.fovRadian, this.aspect, this.near, this.far );

    },


} );

Object.defineProperties( PerspectiveCamera.prototype, {

    fov: {
        get() {

            return this._fov;

        },
        set( degree ) {

            this._fov = degree;
            this.fovRadian = PMath.degree2Radian( this._fov );

        },
    },

} );

function OrthographicCamera( size, aspect, near = 1, far = size * 2 ) {

    Camera.call( this );

    this.size = size;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.zoom = 1;

    this.left = this.size * this.aspect / - 2;
    this.right = this.size * this.aspect / 2;
    this.bottom = this.size / - 2;
    this.top = this.size / 2;

    Matrix4.ortho( this.projMat, this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near / this.zoom, this.far / this.zoom );

}

OrthographicCamera.prototype = Object.assign( Object.create( Camera.prototype ), {

    isOrthographicCamera: true,

    updateProjMatrix( aspect ) {

        if ( aspect && aspect !== this.aspect )
            this.aspect = aspect;

        this.left = this.size * this.aspect / - 2;
        this.right = this.size * this.aspect / 2;
        Matrix4.ortho( this.projMat, this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near / this.zoom, this.far / this.zoom );

    },

} );

export { PerspectiveCamera, OrthographicCamera };
