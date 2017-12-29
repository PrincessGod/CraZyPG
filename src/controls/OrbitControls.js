/* eslint default-case: 0 */
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Spherical } from '../math/Spherical';

class OrbitControls {

    constructor( camera, domElement ) {

        this.camera = camera;
        this.domElement = ( domElement !== undefined ) ? domElement : document;
        this.enable = true;
        this.target = new Vector3();

        this.minDistance = 0;
        this.maxDistance = Infinity;

        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;

        this.minAzimuthAngle = - Infinity;
        this.maxAzimuthAngle = Infinity;

        this.enableDamping = false;
        this.dampingFactor = 0.25;

        this.enableZoom = true;
        this.zoomSpeed = 1.0;

        this.enableRotate = true;
        this.rotateSpeed = 1.0;

        this.enablePan = true;
        this.keyPanSpeed = 7.0;

        this.autoRotate = false;
        this.autoRotateSpeed = 2.0;

        this.enableKeys = true;
        this.keys = {
            LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40,
        };
        this.mouseButtons = {
            ORBIT: 0, ZOOM: 1, PAN: 2,
        };

        this.target0 = this.target.clone();
        this.position0 = this.camera.transform.position.clone();

        // update
        this._offset = new Vector3();
        this._lastPosition = new Vector3();
        this._lastQuaternion = new Quaternion();
        this._spherical = new Spherical();
        this._sphericalDelta = new Spherical();
        this._scale = 1;
        this._panOffset = new Vector3();

        // pan
        this._vPan = new Vector3();

        // state
        this._rotateStart = new Vector2();
        this._rotateEnd = new Vector2();
        this._rotateDelta = new Vector2();

        this._panStart = new Vector2();
        this._panEnd = new Vector2();
        this._panDelta = new Vector2();

        this._zoomStart = new Vector2();
        this._zoomEnd = new Vector2();
        this._zoomDelta = new Vector2();

        this.STATE = {
            NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5,
        };
        this._state = this.STATE.NONE;

        this.domElement.addEventListener( 'contextmenu', this.onContextMenu.bind( this ), false );
        this.domElement.addEventListener( 'mousedown', this.onMouseDown.bind( this ), false );
        this.domElement.addEventListener( 'wheel', this.onMouseWheel.bind( this ), false );

        window.addEventListener( 'keydown', this.onKeyDown.bind( this ), false );

        this.domElement.addEventListener( 'touchstart', this.onTouchStart.bind( this ), false );
        this.domElement.addEventListener( 'touchend', this.onTouchEnd.bind( this ), false );
        this.domElement.addEventListener( 'touchmove', this.onTouchMove.bind( this ), false );

        this.update();

    }

    dispose() {

        this.domElement.removeEventListener( 'contextmenu', this.onContextMenu.bind( this ), false );
        this.domElement.removeEventListener( 'mousedown', this.onMouseDown.bind( this ), false );
        this.domElement.removeEventListener( 'wheel', this.onMouseWheel.bind( this ), false );

        document.removeEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
        document.removeEventListener( 'mouseup', this.onMouseUp.bind( this ), false );

        window.removeEventListener( 'keydown', this.onKeyDown.bind( this ), false );

        this.domElement.removeEventListener( 'touchstart', this.onTouchStart.bind( this ), false );
        this.domElement.removeEventListener( 'touchend', this.onTouchEnd.bind( this ), false );
        this.domElement.removeEventListener( 'touchmove', this.onTouchMove.bind( this ), false );

    }

    update() {

        const position = this.camera.transform.position;

        this._offset.copy( position ).sub( this.target );
        this._spherical.setFromVecor3( this._offset );

        if ( this.autoRotate && this._state === this.STATE.NONE )
            this.rotateLeft( this.getAutoRotationAngle() );


        this._spherical.theta += this._sphericalDelta.theta;
        this._spherical.phi += this._sphericalDelta.phi;

        this._spherical.theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, this._spherical.theta ) );
        this._spherical.phi = Math.max( this.minPolarAngle, Math.max( this.minPolarAngle, this._spherical.phi ) );
        this._spherical.makeSafe();

        this._spherical.radius *= this._scale;

        this._spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this._spherical.radius ) );

        this.target.add( this._panOffset );
        this._offset.setFromSpherical( this._spherical );
        position.copy( this.target ).add( this._offset );

        this.camera.updateViewMatrix( this.target );

        if ( this.enableDamping === true ) {

            this._sphericalDelta.theta *= ( 1 - this.dampingFactor );
            this._sphericalDelta.phi *= ( 1 - this.dampingFactor );

        } else
            this._sphericalDelta.set( 0, 0, 0 );

        this._scale = 1;
        this._panOffset.set( 0, 0, 0 );

    }

    getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;

    }

    getZoomScale() {

        return Math.pow( 0.95, this.zoomSpeed ); // eslint-disable-line

    }

    rotateLeft( angle ) {

        this._sphericalDelta.theta -= angle;

    }

    rotateUp( angle ) {

        this._sphericalDelta.phi -= angle;

    }

    panLeft( distance, worldMatrix ) {

        this._vPan.setFromArray( worldMatrix, 0 );
        this._vPan.multiScalar( - distance );

        this._panOffset.add( this._vPan );

    }

    panUp( distance, worldMatrix ) {

        this._vPan.setFromArray( worldMatrix, 4 );
        this._vPan.multiScalar( distance );

        this._panOffset.add( this._vPan );

    }

    pan( deltaX, deltaY ) {

        const element = this.domElement === document ? this.domElement.body : this.domElement;

        const position = this.camera.transform.position;
        this._vPan.copy( position ).sub( this.target );
        let targetDisitance = this._vPan.length();

        targetDisitance *= ( this.camera.fov / 2 ) * ( Math.PI / 180.0 );

        this.panLeft( 2 * deltaX * ( targetDisitance / element.clientHeight ), this.camera.matrix );
        this.panUp( 2 * deltaY * ( targetDisitance / element.clientHeight ), this.camera.matrix );

    }

    zoomIn( zoomScale ) {

        this._scale /= zoomScale;

    }

    zoomOut( zoomScale ) {

        this._scale *= zoomScale;

    }

    handleMouseDownRotate( event ) {

        this._rotateStart.set( event.clientX, event.clientY );

    }

    handleMouseDownZoom( event ) {

        this._zoomStart.set( event.clientX, event.clientY );

    }

    handleMouseDownPan( event ) {

        this._panStart.set( event.clientX, event.clientY );

    }

    handleMouseMoveRotate( event ) {

        this._rotateEnd.set( event.clientX, event.clientY );
        this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart );

        const element = this.domElement === document ? document.body : this.domElement;

        this.rotateLeft( 2 * Math.PI * ( this._rotateDelta.x / element.clientWidth ) * this.rotateSpeed );
        this.rotateUp( 2 * Math.PI * ( this._rotateDelta.y / element.clientHeight ) * this.rotateSpeed );

        this._rotateStart.copy( this._rotateEnd );

        this.update();

    }

    handleMouseMoveZoom( event ) {

        this._zoomEnd.set( event.clientX, event.clientY );
        this._zoomDelta.subVectors( this._zoomEnd, this._zoomStart );

        if ( this._zoomDelta.y > 0 )
            this.zoomIn( this.getZoomScale() );
        else if ( this._zoomDelta.y < 0 )
            this.zoomOut( this.getZoomScale() );

        this._zoomStart.copy( this._zoomEnd );

        this.update();

    }

    handleMouseMovePan( event ) {

        this._panEnd.set( event.clientX, event.clientY );
        this._panDelta.subVectors( this._panEnd, this._panStart );

        this.pan( this._panDelta.x, this._panDelta.y );

        this._panStart.copy( this._panEnd );

        this.update();

    }

    handleMouseWheel( event ) {

        if ( event.deltaY < 0 )
            this.zoomOut( this.getZoomScale() );
        else if ( event.deltaY > 0 )
            this.zoomIn( this.getZoomScale() );

        this.update();

    }

    handleKeyDown( event ) {

        switch ( event.keyCode ) {

        case this.keys.UP:
            this.pan( 0, this.keyPanSpeed );
            this.update();
            break;
        case this.keys.BOTTOM:
            this.pan( 0, - this.keyPanSpeed );
            this.update();
            break;
        case this.keys.LEFT:
            this.pan( this.keyPanSpeed, 0 );
            this.update();
            break;
        case this.keys.RIGHT:
            this.pan( - this.keyPanSpeed, 0 );
            this.update();
            break;

        }

    }

    handleTouchStartRotate( event ) {

        this._rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

    }

    handleTouchStartZoom( event ) {

        const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
        const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

        const distance = Math.sqrt( dx * dx + dy * dy );

        this._zoomStart.set( 0, distance );

    }

    handleTouchStartPan( event ) {

        this._panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

    }

    handleTouchMoveRotate( event ) {

        this._rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart );

        const element = this.domElement === document ? this.domElement.body : this.domElement;

        this.rotateLeft( 2 * Math.PI * this._rotateDelta.x / element.clientWidth * this.rotateSpeed );
        this.rotateUp( 2 * Math.PI * this._rotateDelta.y / element.clientHeight * this.rotateSpeed );

        this._rotateStart.copy( this._rotateEnd );

        this.update();

    }

    handleTouchMoveZoom( event ) {

        const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
        const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

        const distance = Math.sqrt( dx * dx + dy * dy );

        this._zoomEnd.set( 0, distance );

        this._zoomDelta.subVectors( this._zoomEnd, this._zoomStart );

        if ( this._zoomDelta.y > 0 )
            this.zoomOut( this.getZoomScale() );
        else if ( this._zoomDelta.y < 0 )
            this.zoomIn( this.getZoomScale() );

        this._zoomStart.copy( this._zoomEnd );

        this.update();

    }

    handleTouchMovePan( event ) {

        this._panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

        this._panDelta.subVectors( this._panEnd, this._panStart );

        this.pan( this._panDelta.x, this._panDelta.y );

        this._panStart.copy( this._panEnd );

        this.update();

    }

    onMouseDown( event ) {

        if ( this.enable === false ) return;

        event.preventDefault();

        switch ( event.button ) {

        case this.mouseButtons.ORBIT:
            if ( this.enableRotate === false ) return;

            this.handleMouseDownRotate( event );
            this._state = this.STATE.ROTATE;
            break;

        case this.mouseButtons.ZOOM:
            if ( this.enableZoom === false ) return;

            this.handleMouseDownZoom( event );
            this._state = this.STATE.ZOOM;
            break;

        case this.mouseButtons.PAN:
            if ( this.enablePan === false ) return;

            this.handleMouseDownPan( event );
            this._state = this.STATE.PAN;
            break;

        }

        if ( this._state !== this._state.NONE ) {

            document.addEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
            document.addEventListener( 'mouseup', this.onMouseUp.bind( this ), false );

        }

    }

    onMouseMove( event ) {

        if ( this.enable === false ) return;

        event.preventDefault();

        switch ( this._state ) {

        case this.STATE.ROTATE:
            if ( this.enableRotate === false ) return;

            this.handleMouseMoveRotate( event );
            break;

        case this.STATE.ZOOM:
            if ( this.enableZoom === false ) return;

            this.handleMouseMoveZoom( event );
            break;

        case this.STATE.PAN:
            if ( this.enablePan === false ) return;

            this.handleMouseMovePan( event );
            break;

        }

    }

    onMouseUp() {

        if ( this.enable === false ) return;

        document.removeEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
        document.removeEventListener( 'mouseup', this.onMouseUp.bind( this ), false );

        this._state = this.STATE.NONE;

    }

    onMouseWheel( event ) {

        if ( this.enable === false || this.enableZoom === false || ( this._state !== this.STATE.NONE && this._state !== this.STATE.ROTATE ) ) return;

        event.preventDefault();
        event.stopPropagation();

        this.handleMouseWheel( event );

    }

    onKeyDown( event ) {

        if ( this.enable === false || this.enableKeys === false || this.enablePan === false ) return;

        this.handleKeyDown( event );

    }

    onTouchStart( event ) {

        if ( this.enabled === false ) return;

        switch ( event.touches.length ) {

        case 1: // one-fingered touch: rotate

            if ( this.enableRotate === false ) return;

            this.handleTouchStartRotate( event );

            this._state = this.STATE.TOUCH_ROTATE;

            break;

        case 2: // two-fingered touch: dolly

            if ( this.enableZoom === false ) return;

            this.handleTouchStartZoom( event );

            this._state = this.STATE.TOUCH_ZOOM;

            break;

        case 3: // three-fingered touch: pan

            if ( this.enablePan === false ) return;

            this.handleTouchStartPan( event );

            this._state = this.STATE.TOUCH_PAN;

            break;

        default:

            this._state = this.STATE.NONE;

        }

    }

    onTouchMove( event ) {

        if ( this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

        case 1: // one-fingered touch: rotate

            if ( this.enableRotate === false ) return;
            if ( this._state !== this.STATE.TOUCH_ROTATE ) return;
            this.handleTouchMoveRotate( event );

            break;

        case 2: // two-fingered touch: dolly

            if ( this.enableZoom === false ) return;
            if ( this._state !== this.STATE.TOUCH_ZOOM ) return;

            this.handleTouchMoveZoom( event );

            break;

        case 3: // three-fingered touch: pan

            if ( this.enablePan === false ) return;
            if ( this._state !== this.STATE.TOUCH_PAN ) return;

            this.handleTouchMovePan( event );

            break;

        default:

            this._state = this.STATE.NONE;

        }

    }

    onTouchEnd() {

        if ( this.enabled === false ) return;

        this._state = this.STATE.NONE;

    }

    onContextMenu( event ) {

        if ( this.enable === false ) return;
        event.preventDefault();

    }

}

export { OrbitControls };
