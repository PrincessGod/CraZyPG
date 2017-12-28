import { Vector3 } from '../math/Vector3';

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
        this.roatetSpeed = 1.0;

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

    }

}

export { OrbitControls };
