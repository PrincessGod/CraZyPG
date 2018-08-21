import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { PMath } from '../math/Math';
import { Node } from '../object/Node';
import { ShaderParams } from '../core/constant';

let cameraCount = 0;

class Camera extends Node {

    constructor( name ) {

        super( name );

        this.projMat = new Matrix4();
        this.viewMat = new Matrix4();
        this.target = new Vector3();
        this._innerUniformObj = {};
        this._innerUniformObj[ ShaderParams.UNIFORM_VIEW_MAT_NAME ] = this.viewMat;
        this._innerUniformObj[ ShaderParams.UNIFORM_PROJ_MAT_NAME ] = this.projMat;
        this._innerUniformObj[ ShaderParams.UNIFORM_CAMPOS ] = this.position;

    }

    get uniformObj() {

        return this._innerUniformObj;

    }

    getOrientMatrix() {

        const mat = new Float32Array( this.worldMatrix.raw );
        mat[ 12 ] = mat[ 13 ] = mat[ 14 ] = 0.0; // eslint-disable-line
        return mat;

    }

    lookAt( target ) {

        if ( target )
            this.target = target;

        this.viewMat.lookAt( this.position, this.target, this.upNormaled );
        Matrix4.invert( this.matrix, this.viewMat );
        this.matrix.decompose( this.position, this.quaternion, this.scale );
        this.worldMatrix.copy( this.matrix );
        this.quaternion = this.quaternion;
        this.markNeedUpdate( false );

        return this;

    }

}

export class PerspectiveCamera extends Camera {

    constructor( fov = 45, aspectRatio = 1.5, near = 0.01, far = 1000, fixAspectRatio = false, name = `NO_NAME_PERSPECTIVE_CAMERA${cameraCount ++}` ) {

        super( name );

        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.fixAspectRatio = fixAspectRatio;

        Matrix4.perspective( this.projMat, this.fovRadian, aspectRatio, near, far );

    }

    get fov() {

        return this._fov;

    }

    set fov( v ) {

        this._fov = v;
        this.fovRadian = PMath.degree2Radian( this._fov );

    }

    updateProjMatrix( aspectRatio ) {

        if ( ! this.fixAspectRatio && aspectRatio )
            this.aspectRatio = aspectRatio;

        Matrix4.perspective( this.projMat, this.fovRadian, this.aspectRatio, this.near, this.far );

        return this;

    }

    get isPerspectiveCamera() {

        return true;

    }

}

export class OrthographicCamera extends Camera {

    constructor( size, aspectRatio, near = 1, far = size * 2, fixAspectRatio = false, name = `NO_NAME_ORTHOGRAPHIC_CAMERA${cameraCount ++}` ) {

        super( name );

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

        Matrix4.orthographic( this.projMat, this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near / this.zoom, this.far / this.zoom );

    }

    updateProjMatrix( aspectRatio ) {

        if ( ! this.fixAspectRatio && aspectRatio )
            this.aspectRatio = aspectRatio;

        this.left = this.size * this.aspectRatio / - 2;
        this.right = this.size * this.aspectRatio / 2;
        Matrix4.orthographic( this.projMat, this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near / this.zoom, this.far / this.zoom );

        return this;

    }

    get isOrthographicCamera() {

        return true;

    }

}
