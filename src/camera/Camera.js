import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { PMath } from '../math/Math';
import { Node } from '../object/Node';
import { ShaderParams } from '../core/constant';

let cameraCount = 0;
function Camera( name ) {

    Node.call( this, name );
    this.projMat = Matrix4.identity();
    this.viewMat = Matrix4.identity();
    this.target = new Vector3();
    this.up = new Vector3( 0, 1, 0 );
    this._innerUniformObj = {};
    this._innerUniformObj[ ShaderParams.UNIFORM_VIEW_MAT_NAME ] = this.viewMat;
    this._innerUniformObj[ ShaderParams.UNIFORM_PROJ_MAT_NAME ] = this.projMat;

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

            return this.transform.worldMatrix.raw;

        },

    },

    vec3Position: {

        get() {

            return this.transform.vec3Position;

        },

    },

    uniformObj: {

        get() {

            return this._innerUniformObj;

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
        Matrix4.invert( this.transform.matrix.raw, this.viewMat );
        Matrix4.decompose( this.transform.matrix.raw, this.transform.vec3Position.raw, this.transform.quatQuaternion.raw, this.transform.vec3Scale.raw );
        Matrix4.copy( this.transform.worldMatrix.raw, this.transform.matrix.raw );
        this.transform.quaternion = this.transform.quaternion; // update rotation
        this.transform.markNeedUpdate( false );

        return this;

    },

    setTransform( transform ) {

        this.transform = transform;
        return this;

    },

    updateViewMatFromModelMat() {

        Matrix4.invert( this.viewMat, this.matrix );

    },

} );

function PerspectiveCamera( fov = 45, aspectRatio = 1.5, near = 0.01, far = 1000, fixAspectRatio = false, name = `NO_NAME_PERSPECTIVE_CAMERA${cameraCount ++}` ) {

    Camera.call( this, name );

    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.near = near;
    this.far = far;
    this.fixAspectRatio = fixAspectRatio;

    Matrix4.perspective( this.projMat, this.fovRadian, aspectRatio, near, far );

}

PerspectiveCamera.prototype = Object.assign( Object.create( Camera.prototype ), {

    isPerspectiveCamera: true,

    updateProjMatrix( aspectRatio ) {

        if ( ! this.fixAspectRatio && aspectRatio )
            this.aspectRatio = aspectRatio;

        Matrix4.perspective( this.projMat, this.fovRadian, this.aspectRatio, this.near, this.far );

        return this;

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

function OrthographicCamera( size, aspectRatio, near = 1, far = size * 2, fixAspectRatio = false, name = `NO_NAME_ORTHOGRAPHIC_CAMERA${cameraCount ++}` ) {

    Camera.call( this, name );

    this.size = size;
    this.aspectRatio = aspectRatio;
    this.near = near;
    this.far = far;
    this.zoom = 1;
    this.fixAspectRatio = fixAspectRatio;

    this.left = this.size * this.aspectRatio / - 2;
    this.right = this.size * this.aspectRatio / 2;
    this.bottom = this.size / - 2;
    this.top = this.size / 2;

    Matrix4.ortho( this.projMat, this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near / this.zoom, this.far / this.zoom );

}

OrthographicCamera.prototype = Object.assign( Object.create( Camera.prototype ), {

    isOrthographicCamera: true,

    updateProjMatrix( aspectRatio ) {

        if ( ! this.fixAspectRatio && aspectRatio )
            this.aspectRatio = aspectRatio;

        this.left = this.size * this.aspectRatio / - 2;
        this.right = this.size * this.aspectRatio / 2;
        Matrix4.ortho( this.projMat, this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near / this.zoom, this.far / this.zoom );

        return this;

    },

} );

export { PerspectiveCamera, OrthographicCamera };
