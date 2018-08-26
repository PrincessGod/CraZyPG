import { PMath } from './Math';

export class Vector3 {

    constructor( x, y, z ) {

        this._raw = new Float32Array( 3 );
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    }

    get raw() {

        return this._raw;

    }

    get x() {

        return this.raw[ 0 ];

    }

    set x( v ) {

        this.raw[ 0 ] = v;

    }

    get y() {

        return this.raw[ 1 ];

    }

    set y( v ) {

        this.raw[ 1 ] = v;

    }

    get z() {

        return this.raw[ 2 ];

    }

    set z( v ) {

        this.raw[ 2 ] = v;

    }

    static get cache() {

        if ( ! Vector3._cache )
            Vector3._cache = new Vector3();

        return Vector3._cache;

    }

    static set( v, x, y, z ) {

        v.x = x;
        v.y = y;
        v.z = z;

        return v;

    }

    set( x, y, z ) {

        return Vector3.set( this, x, y, z );

    }

    static setFromArray( v, array, offset = 0 ) {

        v.x = array[ offset ];
        v.y = array[ offset + 1 ];
        v.z = array[ offset + 2 ];

        return v;

    }

    setFromArray( array, offset ) {

        return Vector3.setFromArray( this, array, offset );

    }

    static setFromSpherical( v, s ) {

        const sinPhiRadius = Math.sin( s.phi ) * s.radius;

        v.x = sinPhiRadius * Math.sin( s.theta );
        v.y = Math.cos( s.phi ) * s.radius;
        v.z = sinPhiRadius * Math.cos( s.theta );

        return v;

    }

    setFromSpherical( s ) {

        return Vector3.setFromSpherical( this, s );

    }

    // XYZ order
    static setFromRotationMatrix( v, m ) {

        const te = m.raw || m;
        const m11 = te[ 0 ];
        const m12 = te[ 4 ];
        const m13 = te[ 8 ];
        const m22 = te[ 5 ];
        const m23 = te[ 9 ];
        const m32 = te[ 6 ];
        const m33 = te[ 10 ];

        v.y = Math.asin( PMath.clamp( m13, - 1, 1 ) );

        if ( Math.abs( m13 ) < 0.99999 ) {

            v.x = Math.atan2( - m23, m33 );
            v.z = Math.atan2( - m12, m11 );

        } else {

            v.x = Math.atan2( m32, m22 );
            v.z = 0;

        }

        return v;

    }

    setFromRotationMatrix( m ) {

        return Vector3.setFromRotationMatrix( this, m );

    }

    static equals( v1, v2 ) {

        const ax = v1.x;
        const ay = v1.y;
        const az = v1.z;

        const bx = v2.x;
        const by = v2.y;
        const bz = v2.z;

        return ( Math.abs( ax - bx ) <= PMath.EPS * Math.max( 1.0, Math.abs( ax ), Math.abs( bx ) ) &&
                Math.abs( ay - by ) <= PMath.EPS * Math.max( 1.0, Math.abs( ay ), Math.abs( by ) ) &&
                Math.abs( az - bz ) <= PMath.EPS * Math.max( 1.0, Math.abs( az ), Math.abs( bz ) ) );

    }

    equals( v ) {

        return Vector3.equals( this, v );

    }

    static length( v1, v2 ) {

        // Only get the magnitude of this vector
        if ( v2 === undefined )
            return Math.sqrt( ( v1.x * v1.x ) + ( v1.y * v1.y ) + ( v1.z * v1.z ) );

        // Get magnitude based on another vector
        const x = v1.x - v2.x;
        const y = v1.y - v2.y;
        const z = v1.z - v2.z;

        return Math.sqrt( ( x * x ) + ( y * y ) + ( z * z ) );

    }

    length( v ) {

        return Vector3.length( this, v );

    }

    static squareLength( v1, v2 ) {

        if ( v2 === undefined )
            return ( v1.x * v1.x ) + ( v1.y * v1.y ) + ( v1.z * v1.z );

        const x = v1.x - v2.x;
        const y = v1.y - v2.y;
        const z = v1.z - v2.z;

        return ( x * x ) + ( y * y ) + ( z * z );

    }

    squareLength( v ) {

        return Vector3.squareLength( this, v );

    }

    static normalize( out, v ) {

        const mag = v.length();
        out.x = v.x / mag;
        out.y = v.y / mag;
        out.z = v.z / mag;

        return out;

    }

    normalize() {

        return Vector3.normalize( this, this );

    }

    static scale( out, v, scalar ) {

        out.x = v.x * scalar;
        out.y = v.y * scalar;
        out.z = v.z * scalar;

        return out;

    }

    scale( scalar ) {

        return Vector3.scale( this, this, scalar );

    }

    static copy( out, v ) {

        return Vector3.set( out, v.x, v.y, v.z, v.w );

    }

    copy( v ) {

        return Vector3.copy( this, v );

    }

    static clone( v ) {

        return new Vector3( v.x, v.y, v.z );

    }

    clone() {

        return Vector3.clone( this );

    }

    static sub( out, v1, v2 ) {

        out.x = v1.x - v2.x;
        out.y = v1.y - v2.y;
        out.z = v1.z - v2.z;

        return out;

    }

    sub( v ) {

        return Vector3.sub( this, this, v );

    }

    static add( out, v1, v2 ) {

        out.x = v1.x + v2.x;
        out.y = v1.y + v2.y;
        out.z = v1.z + v2.z;

        return out;

    }

    add( v ) {

        return Vector3.add( this, this, v );

    }

    static subVectors( out, v1, v2 ) {

        return Vector3.sub( out, v1, v2 );

    }

    subVectors( v1, v2 ) {

        return Vector3.subVectors( this, v1, v2 );

    }

    static dot( v1, v2 ) {

        return ( v1.x * v2.z ) + ( v1.y * v2.y ) + ( v1.z * v2.z );

    }

    dot( v ) {

        return Vector3.dot( this, v );

    }

    static cross( out, v1, v2 ) {

        const ax = v1.x;
        const ay = v1.y;
        const az = v1.z;
        const bx = v2.x;
        const by = v2.y;
        const bz = v2.z;
        out.x = ay * bz - az * by;
        out.y = az * bx - ax * bz;
        out.z = ax * by - ay * bx;

        return out;

    }

    cross( v ) {

        return Vector3.cross( this, this, v );

    }

}
