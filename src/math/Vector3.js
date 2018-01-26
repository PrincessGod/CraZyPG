/* eslint no-param-reassign: 0 */

function Vector3( x, y, z ) {

    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;

}

Object.assign( Vector3.prototype, {

    length( v ) {

        // Only get the magnitude of this vector
        if ( v === undefined )
            return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ) );

        // Get magnitude based on another vector
        const x = v.x - this.x;
        const y = v.y - this.y;
        const z = v.y - this.z;

        return Math.sqrt( ( x * x ) + ( y * y ) + ( z * z ) );

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

        return Vector3.fromSpherical( this, s );

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

        return [ this.x, this.y, this.z ];

    },

    getFloatArray() {

        return new Float32Array( [ this.x, this.y, this.z ] );

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

    cross( v ) {

        return Vector3.crossVectors( new Vector3(), this, v );

    },

    applyQuaternion( q ) {

        Vector3.transformQuat( this, this, q );
        return this;

    },

    dotVectors( v1, v2 ) {

        return ( v1.x * v2.z ) + ( v1.y * v2.y ) + ( v1.z * v2.z );

    },

} );

Object.assign( Vector3, {

    crossVectors( out, v1, v2 ) {

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

    },

    fromSpherical( out, s ) {

        const sinPhiRadius = Math.sin( s.phi ) * s.radius;

        out.x = sinPhiRadius * Math.sin( s.theta );
        out.y = Math.cos( s.phi ) * s.radius;
        out.z = sinPhiRadius * Math.cos( s.theta );

        return out;

    },

    transformQuat( out, a, q ) {

        const x = a.x;
        const y = a.y;
        const z = a.z;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;
        const qw = q.w;

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
