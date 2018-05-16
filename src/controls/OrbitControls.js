/* eslint default-case: 0 */
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Spherical } from '../math/Spherical';

function OrbitControls( camera, domElement, controler ) {

    this.controler = controler;
    this.camera = camera;
    this.domElement = ( domElement !== undefined ) ? domElement : document;
    this.enable = true;
    this.target = new Vector3();

    this.minDistance = 0.1;
    this.maxDistance = Infinity;

    this.minZoom = 0.01;
    this.maxZoom = Infinity;

    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;

    this.minAzimuthAngle = - Infinity;
    this.maxAzimuthAngle = Infinity;

    this.enableDamping = false;
    this.dampingFactor = 0.08;
    this.zoomFactor = 0.2;

    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    this.enableRotate = true;
    this.rotateSpeed = 0.8;

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

    // update
    this._offset = new Vector3();
    this._spherical = new Spherical();
    this._sphericalDelta = new Spherical();
    this._sphericalDump = new Spherical();
    this._zoomFrag = 0;
    this._scale = 1;
    this._panOffset = new Vector3();
    this._isMouseUp = true;

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

    this.eventListeners = [
        { type: 'mousedown', listener: this.onMouseDown.bind( this ) },
        { type: 'wheel', listener: this.onMouseWheel.bind( this ) },
        { type: 'keydown', listener: this.onKeyDown.bind( this ) },
        { type: 'touchstart', listener: this.onTouchStart.bind( this ) },
        { type: 'touchend', listener: this.onTouchEnd.bind( this ) },
        { type: 'touchmove', listener: this.onTouchMove.bind( this ) },
    ];

    this.mouseMoveUpListeners = [
        { type: 'mousemove', listener: this.onMouseMove.bind( this ) },
        { type: 'mouseup', listener: this.onMouseUp.bind( this ) },
    ];

    this.controler.addListeners( this.eventListeners );

    this.update();

}

Object.assign( OrbitControls.prototype, {

    dispose() {

        this.controler.removeListeners( this.eventListeners, this.mouseMoveUpListeners );

    },

    update() {

        if ( ! this.enable ) return;

        const position = this.camera.vec3Position;

        this._offset.copy( position ).sub( this.target );
        this._spherical.setFromVecor3( this._offset );

        if ( this.autoRotate && this._state === this.STATE.NONE )
            this.rotateLeft( this.getAutoRotationAngle() );

        this._spherical.theta += this._sphericalDelta.theta;
        this._spherical.phi += this._sphericalDelta.phi;

        this._spherical.theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, this._spherical.theta ) );
        this._spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this._spherical.phi ) );
        this._spherical.makeSafe();

        if ( this._scale !== 1 )
            this._zoomFrag = this._spherical.radius * ( this._scale - 1 );

        this._spherical.radius += this._zoomFrag;

        this._spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this._spherical.radius ) );

        this.target.add( this._panOffset );
        this._offset.setFromSpherical( this._spherical );
        position.copy( this.target ).add( this._offset );

        this.camera.lookAt( this.target );

        if ( this.enableDamping === true ) {

            this._sphericalDump.theta *= ( 1 - this.dampingFactor );
            this._sphericalDump.phi *= ( 1 - this.dampingFactor );
            this._zoomFrag *= ( 1 - this.zoomFactor );

            if ( this._isMouseUp ) {

                this._sphericalDelta.theta = this._sphericalDump.theta;
                this._sphericalDelta.phi = this._sphericalDump.phi;

            } else
                this._sphericalDelta.set( 0, 0, 0 );

        } else {

            this._sphericalDelta.set( 0, 0, 0 );
            this._zoomFrag = 0;

        }

        this._scale = 1;
        this._panOffset.set( 0, 0, 0 );

    },

    getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 / this.autoRotateSpeed;

    },

    getZoomScale() {

        return Math.pow( 0.95, this.zoomSpeed ); // eslint-disable-line

    },

    rotateLeft( angle ) {

        this._sphericalDelta.theta -= angle;
        if ( this.enableDamping )
            this._sphericalDump.theta = - angle;

    },

    rotateUp( angle ) {

        this._sphericalDelta.phi -= angle;
        if ( this.enableDamping )
            this._sphericalDump.phi = - angle;

    },

    panLeft( distance, worldMatrix ) {

        this._vPan.setFromArray( worldMatrix, 0 );
        this._vPan.multiScalar( - distance );

        this._panOffset.add( this._vPan );

    },

    panUp( distance, worldMatrix ) {

        this._vPan.setFromArray( worldMatrix, 4 );
        this._vPan.multiScalar( distance );

        this._panOffset.add( this._vPan );

    },

    pan( deltaX, deltaY ) {

        const element = this.domElement === document ? this.domElement.body : this.domElement;

        if ( this.camera.isPerspectiveCamera ) {

            const position = this.camera.vec3Position;
            this._vPan.copy( position ).sub( this.target );
            let targetDisitance = this._vPan.length();

            targetDisitance *= ( this.camera.fov / 2 ) * ( Math.PI / 180.0 );

            this.panLeft( 2 * deltaX * ( targetDisitance / element.clientHeight ), this.camera.matrix );
            this.panUp( 2 * deltaY * ( targetDisitance / element.clientHeight ), this.camera.matrix );

        } else if ( this.camera.isOrthographicCamera ) {

            this.panLeft( deltaX * ( this.camera.right - this.camera.left ) / this.camera.zoom / element.clientHeight, this.camera.matrix );
            this.panUp( deltaY * ( this.camera.top - this.camera.bottom ) / this.camera.zoom / element.clientHeight, this.camera.matrix );

        }

    },

    zoomIn( zoomScale ) {

        if ( this.camera.isPerspectiveCamera )
            this._scale /= zoomScale;
        else if ( this.camera.isOrthographicCamera ) {

            this.camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.camera.zoom * zoomScale ) );
            this.camera.updateProjMatrix();

        }

    },

    zoomOut( zoomScale ) {

        if ( this.camera.isPerspectiveCamera )
            this._scale *= zoomScale;
        else if ( this.camera.isOrthographicCamera ) {

            this.camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.camera.zoom / zoomScale ) );
            this.camera.updateProjMatrix();

        }

    },

    handleMouseDownRotate( event ) {

        this._rotateStart.set( event.clientX, event.clientY );

    },

    handleMouseDownZoom( event ) {

        this._zoomStart.set( event.clientX, event.clientY );

    },

    handleMouseDownPan( event ) {

        this._panStart.set( event.clientX, event.clientY );

    },

    handleMouseMoveRotate( event ) {

        this._rotateEnd.set( event.clientX, event.clientY );
        this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart );

        const element = this.domElement === document ? document.body : this.domElement;

        this.rotateLeft( 2 * Math.PI * ( this._rotateDelta.x / element.clientWidth ) * this.rotateSpeed );
        this.rotateUp( 2 * Math.PI * ( this._rotateDelta.y / element.clientHeight ) * this.rotateSpeed );

        this._rotateStart.copy( this._rotateEnd );

        this.update();

    },

    handleMouseMoveZoom( event ) {

        this._zoomEnd.set( event.clientX, event.clientY );
        this._zoomDelta.subVectors( this._zoomEnd, this._zoomStart );

        if ( this._zoomDelta.y > 0 )
            this.zoomIn( this.getZoomScale() );
        else if ( this._zoomDelta.y < 0 )
            this.zoomOut( this.getZoomScale() );

        this._zoomStart.copy( this._zoomEnd );

        this.update();

    },

    handleMouseMovePan( event ) {

        this._panEnd.set( event.clientX, event.clientY );
        this._panDelta.subVectors( this._panEnd, this._panStart );

        this.pan( this._panDelta.x, this._panDelta.y );

        this._panStart.copy( this._panEnd );

        this.update();

    },

    handleMouseWheel( event ) {

        if ( event.deltaY < 0 )
            this.zoomOut( this.getZoomScale() );
        else if ( event.deltaY > 0 )
            this.zoomIn( this.getZoomScale() );

        this.update();

    },

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

    },

    handleTouchStartRotate( event ) {

        this._rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

    },

    handleTouchStartZoom( event ) {

        const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
        const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

        const distance = Math.sqrt( dx * dx + dy * dy );

        this._zoomStart.set( 0, distance );

    },

    handleTouchStartPan( event ) {

        this._panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

    },

    handleTouchMoveRotate( event ) {

        this._rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart );

        const element = this.domElement === document ? this.domElement.body : this.domElement;

        this.rotateLeft( 2 * Math.PI * this._rotateDelta.x / element.clientWidth * this.rotateSpeed );
        this.rotateUp( 2 * Math.PI * this._rotateDelta.y / element.clientHeight * this.rotateSpeed );

        this._rotateStart.copy( this._rotateEnd );

        this.update();

    },

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

    },

    handleTouchMovePan( event ) {

        this._panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

        this._panDelta.subVectors( this._panEnd, this._panStart );

        this.pan( this._panDelta.x, this._panDelta.y );

        this._panStart.copy( this._panEnd );

        this.update();

    },

    onMouseDown( event ) {

        if ( this.enable === false ) return;

        event.preventDefault();

        this._isMouseUp = false;

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

        if ( this._state !== this.STATE.NONE )
            this.controler.addListeners( this.mouseMoveUpListeners );

    },

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

    },

    onMouseUp() {

        if ( this.enable === false ) return;

        this._isMouseUp = true;

        this.controler.removeListeners( this.mouseMoveUpListeners );

        this._state = this.STATE.NONE;

    },

    onMouseWheel( event ) {

        if ( this.enable === false || this.enableZoom === false || ( this._state !== this.STATE.NONE && this._state !== this.STATE.ROTATE ) ) return;

        event.preventDefault();
        event.stopPropagation();

        this.handleMouseWheel( event );

    },

    onKeyDown( event ) {

        if ( this.enable === false || this.enableKeys === false || this.enablePan === false ) return;

        this.handleKeyDown( event );

    },

    onTouchStart( event ) {

        if ( this.enable === false ) return;

        this._isMouseUp = false;

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

    },

    onTouchMove( event ) {

        if ( this.enable === false ) return;

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

    },

    onTouchEnd() {

        if ( this.enable === false ) return;

        this._isMouseUp = true;

        this._state = this.STATE.NONE;

    },

    onContextMenu( event ) {

        if ( this.enable === false ) return;
        event.preventDefault();

    },

} );

export { OrbitControls };
