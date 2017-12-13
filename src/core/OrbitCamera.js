/* eslint no-multi-assign: 0 */
import { Transform } from './Transform';
import { Matrix4 } from './Math';

class OrbitCamera {

    constructor( gl, fov = 45, near = 0.1, far = 1000 ) {

        this.projMatrix = new Float32Array( 16 );
        Matrix4.perspective(
            this.projMatrix,
            fov,
            gl.canvas.width / gl.canvas.height,
            near,
            far,
        );

        this.gl = gl;
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.transform = new Transform();
        this.viewMatrix = new Float32Array( 16 );

        this.mode = OrbitCamera.MODE_ORBIT;

    }

    panX( v ) {

        if ( this.mode === OrbitCamera.MODE_ORBIT ) return;

        this.updateViewMatrix();
        this.transform.position.x += this.transform.right[ 0 ] * v;
        this.transform.position.y += this.transform.right[ 1 ] * v;
        this.transform.position.z += this.transform.right[ 2 ] * v;

    }

    panY( v ) {

        this.updateViewMatrix();
        this.transform.position.y += this.transform.up[ 1 ] * v;
        if ( this.mode === OrbitCamera.MODE_ORBIT )

            return;


        this.transform.position.x += this.transform.up[ 0 ] * v;
        this.transform.position.z += this.transform.up[ 2 ] * v;

    }

    panZ( v ) {

        this.updateViewMatrix();
        if ( this.mode === OrbitCamera.MODE_ORBIT )
            this.transform.position.z += v;
        else {

            this.transform.position.x += this.transform.forward[ 0 ] * v;
            this.transform.position.y += this.transform.forward[ 1 ] * v;
            this.transform.position.z += this.transform.forward[ 2 ] * v;

        }

    }

    updateViewMatrix() {

        if ( this.mode === OrbitCamera.MODE_FREE )
            this.transform.matLocal.reset()
                .vtranslate( this.transform.position )
                .rotateY( this.transform.rotation.y * Transform.deg2Rad )
                .rotateX( this.transform.rotation.x * Transform.deg2Rad );
        else
            this.transform.matLocal.reset()
                .rotateY( this.transform.rotation.y * Transform.deg2Rad )
                .rotateX( this.transform.rotation.x * Transform.deg2Rad )
                .vtranslate( this.transform.position );


        this.transform.updateDirection();
        Matrix4.invert( this.viewMatrix, this.transform.matLocal.raw );
        return this.viewMatrix;

    }

    updateProjMatrix() {

        Matrix4.perspective(
            this.projMatrix,
            this.fov,
            this.gl.canvas.width / this.gl.canvas.height,
            this.near,
            this.far,
        );

    }

    getOrientMatrix() {

        const mat = new Float32Array( this.viewMatrix );
        mat[ 12 ] = mat[ 13 ] = mat[ 14 ] = 0.0;
        return mat;

    }

}

OrbitCamera.MODE_FREE = 0;
OrbitCamera.MODE_ORBIT = 1;


class CameraController {

    constructor( gl, camera ) {

        const self = this;
        const box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;
        this.camera = camera;

        this.rotateRate = - 300;
        this.panRate = 5;
        this.zoomRate = 200;

        this.offsetX = box.left;
        this.offsetY = box.top;

        this.initX = 0;
        this.initY = 0;
        this.prevX = 0;
        this.prevY = 0;

        this.onUpHandler = function ( e ) {

            self.onMouseUp( e );

        };
        this.onMoveHandler = function ( e ) {

            self.onMouseMove( e );

        };

        this.canvas.addEventListener( 'mousedown', ( e ) => {

            self.onMouseDown( e );

        } );
        this.canvas.addEventListener( 'mousewheel', ( e ) => {

            self.onMouseWheel( e );

        } );

    }

    getMouseVec2( e ) {

        return {
            x: e.pageX - this.offsetX,
            y: e.pageY - this.offsetY,
        };

    }

    onMouseDown( e ) {

        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;

        this.canvas.addEventListener( 'mouseup', this.onUpHandler );
        this.canvas.addEventListener( 'mousemove', this.onMoveHandler );

    }

    onMouseUp() {

        this.canvas.removeEventListener( 'mouseup', this.onMouseUp );
        this.canvas.removeEventListener( 'mousemove', this.onMoveHandler );

    }

    onMouseWheel( e ) {

        const delta = Math.max( - 1, Math.min( 1, ( e.wheelDelta || - e.detail ) ) );
        this.camera.panZ( delta * ( this.zoomRate / this.canvas.height ) );

    }

    onMouseMove( e ) {

        const x = e.pageX - this.offsetX;
        const y = e.pageY - this.offsetY;
        const dx = x - this.prevX;
        const dy = y - this.prevY;

        if ( ! e.shiftKey ) {

            this.camera.transform.rotation.y += dx * ( this.rotateRate / this.canvas.width );
            this.camera.transform.rotation.x += dy * ( this.rotateRate / this.canvas.height );

        } else {

            this.camera.panX( - dx * ( this.panRate / this.canvas.width ) );
            this.camera.panY( dy * ( this.panRate / this.canvas.height ) );

        }

        this.prevX = x;
        this.prevY = y;

    }

}

export { OrbitCamera, CameraController };
