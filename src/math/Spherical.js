import { PMath } from './Math';
import { Vector3 } from './Vector3';

export class Spherical extends Vector3 {

    constructor( radius = 1, phi, theta ) {

        super( radius, phi, theta );

    }

    get raw() {

        return this._raw;

    }

    get radius() {

        return this.raw[ 0 ];

    }

    set radius( v ) {

        this.raw[ 0 ] = v;

    }

    get phi() {

        return this.raw[ 1 ];

    }

    set phi( v ) {

        this.raw[ 1 ] = v;

    }

    get theta( ) {

        return this.raw[ 2 ];

    }

    set theta( v ) {

        this.raw[ 2 ] = v;

    }

    static get cache() {

        if ( ! Spherical._cache )
            Spherical._cache = new Spherical();

        return Spherical._cache;

    }

    static setFromVector3( s, v ) {

        s.radius = v.length();
        if ( s.radius === 0 ) {

            s.theta = 0;
            s.phi = 0;

        } else {

            s.theta = Math.atan2( v.x, v.z );
            s.phi = Math.acos( PMath.clamp( v.y / s.radius, - 1, 1 ) );

        }

        return s;

    }

    setFromVector3( v ) {

        return Spherical.setFromVector3( this, v );

    }

    static clone( s ) {

        return new Spherical( s.radius, s.phi, s.theta );

    }

    clone() {

        return Spherical.clone( this );

    }

    static makeSafe( s ) {

        s.phi = PMath.clamp( s.phi, PMath.EPS, Math.PI - PMath.EPS );
        return s;

    }

    makeSafe() {

        return Spherical.makeSafe( this );

    }

}
