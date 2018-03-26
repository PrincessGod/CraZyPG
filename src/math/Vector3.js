/* eslint no-param-reassign: 0 */

function Vector3( x, y, z ) {

    this.raw = [];
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

}

Object.defineProperties( Vector3.prototype, {

    x: {
        get() {

            return this.raw[ 0 ];

        },
        set( v ) {

            this.raw[ 0 ] = v;

        },
    },

    y: {
        get() {

            return this.raw[ 1 ];

        },
        set( v ) {

            this.raw[ 1 ] = v;

        },
    },

    z: {
        get() {

            return this.raw[ 2 ];

        },
        set( v ) {

            this.raw[ 2 ] = v;

        },
    },

} );

Object.assign( Vector3.prototype, {

    length( v ) {

        // Only get the magnitude of this vector
        if ( v === undefined )
            return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ) );

        // Get magnitude based on another vector
        const x = v.x - this.x;
        const y = v.y - this.y;
        const z = v.z - this.z;

        return Math.sqrt( ( x * x ) + ( y * y ) + ( z * z ) );

    },

    squareLength( v ) {

        if ( v === undefined )
            return ( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z );

        const x = v.x - this.x;
        const y = v.y - this.y;
        const z = v.z - this.z;

        return ( x * x ) + ( y * y ) + ( z * z );

    },

    normalize() {

        const mag = this.length();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;

    },

    set( x, y, z ) {

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    },

    setFromSpherical( s ) {

        return Vector3.fromSpherical( this.raw, s );

    },

    setFromArray( array, offset ) {

        if ( offset === undefined ) offset = 0;
        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];

        return this;

    },

    multiScalar( v ) {

        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;

    },

    getArray() {

        return this.raw;

    },

    getFloatArray() {

        return new Float32Array( this.raw );

    },

    clone() {

        return new Vector3( this.x, this.y, this.z );

    },

    copy( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;

    },

    sub( v ) {

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;

    },

    add( v ) {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;

    },

    subVectors( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - a.y;
        this.z = a.z - a.y;

        return this;

    },

    dot( v ) {

        return this.dotVectors( this, v );

    },

    cross( v, frag ) {

        const result = frag || new Vector3();
        Vector3.crossVectors( result.raw, this.raw, v.raw );
        return result;

    },

    applyQuaternion( q ) {

        Vector3.transformQuat( this.raw, this.raw, q.raw );
        return this;

    },

    dotVectors( v1, v2 ) {

        return ( v1.x * v2.z ) + ( v1.y * v2.y ) + ( v1.z * v2.z );

    },

} );

Object.assign( Vector3, {

    crossVectors( out, v1, v2 ) {

        const ax = v1[ 0 ];
        const ay = v1[ 1 ];
        const az = v1[ 2 ];
        const bx = v2[ 0 ];
        const by = v2[ 1 ];
        const bz = v2[ 2 ];
        out[ 0 ] = ay * bz - az * by;
        out[ 1 ] = az * bx - ax * bz;
        out[ 2 ] = ax * by - ay * bx;

        return out;

    },

    fromSpherical( out, s ) {

        const sinPhiRadius = Math.sin( s.phi ) * s.radius;

        out[ 0 ] = sinPhiRadius * Math.sin( s.theta );
        out[ 1 ] = Math.cos( s.phi ) * s.radius;
        out[ 2 ] = sinPhiRadius * Math.cos( s.theta );

        return out;

    },

    transformQuat( out, a, q ) {

        const x = a[ 0 ];
        const y = a[ 1 ];
        const z = a[ 2 ];
        const qx = q[ 0 ];
        const qy = q[ 1 ];
        const qz = q[ 2 ];
        const qw = q[ 3 ];

        // calculate quat * vector
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        out[ 0 ] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        out[ 1 ] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        out[ 2 ] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return out;

    },

} );

export { Vector3 };
