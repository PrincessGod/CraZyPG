import { PMath } from './Math';

export class Spherical {

    constructor( radius, phi, theta ) {

        this._raw = new Float32Array( 3 );
        this.radius = radius !== undefined ? radius : 1.0;
        this.phi = phi || 0;
        this.theta = theta || 0;

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

    static set( s, radius, phi, theta ) {

        s.radius = radius;
        s.phi = phi;
        s.theta = theta;

        return s;

    }

    set( radius, phi, theta ) {

        return Spherical.set( this, radius, phi, theta );

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

    static copy( out, s ) {

        out.radius = s.radius;
        out.phi = s.phi;
        out.theta = s.theta;

        return out;

    }

    copy( s ) {

        return Spherical.copy( this, s );

    }

    static makeSafe( s ) {

        s.phi = PMath.clamp( s.phi, PMath.EPS, Math.PI - PMath.EPS );
        return s;

    }

    makeSafe() {

        return Spherical.makeSafe( this );

    }

}
