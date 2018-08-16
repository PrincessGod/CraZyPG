/* eslint no-param-reassign: 0 no-mixed-operators:0 */

export class Quaternion {

    constructor( x, y, z, w ) {

        this._raw = new Float32Array( 4 );
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = typeof w === 'undefined' ? 1 : w;

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

    get w() {

        return this.raw[ 3 ];

    }

    set w( v ) {

        this.raw[ 3 ] = v;

    }

    static set( q, x, y, z, w ) {

        q.x = x;
        q.y = y;
        q.z = z;
        q.w = w;

        return q;

    }

    set( x, y, z, w ) {

        return Quaternion.set( this, x, y, z, w );

    }

    static setFromEuler( out, x, y, z ) {

        // XYZ order
        const cos = Math.cos;
        const sin = Math.sin;

        const c1 = cos( x / 2 );
        const c2 = cos( y / 2 );
        const c3 = cos( z / 2 );

        const s1 = sin( x / 2 );
        const s2 = sin( y / 2 );
        const s3 = sin( z / 2 );

        out.x = s1 * c2 * c3 + c1 * s2 * s3;
        out.y = c1 * s2 * c3 - s1 * c2 * s3;
        out.z = c1 * c2 * s3 + s1 * s2 * c3;
        out.w = c1 * c2 * c3 - s1 * s2 * s3;

        return out;

    }

    // radian
    setFromEuler( x, y, z ) {

        return Quaternion.setFromEuler( this, x, y, z );

    }

    static clone( q ) {

        return new Quaternion( q.x, q.y, q.z, q.w );

    }

    clone( q ) {

        return Quaternion.clone( q );

    }

    static copy( out, q ) {

        return Quaternion.set( out, q.x, q.y, q.z, q.w );

    }

    copy( q ) {

        return Quaternion.copy( this, q );

    }

    static length( q ) {

        return Math.sqrt( q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w );

    }

    length() {

        return Quaternion.length( this );

    }

    static normalize( out, q ) {

        let l = Math.sqrt( q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w );

        if ( l === 0 ) {

            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;

        } else {

            l = 1 / l;
            out.x = q.x * l;
            out.y = q.y * l;
            out.z = q.z * l;
            out.w = q.w * l;

        }

        return out;

    }

    normalize() {

        return Quaternion.normalize( this, this );

    }

    static invert( out, q ) {

        const a0 = q.x;
        const a1 = q.y;
        const a2 = q.z;
        const a3 = q.w;
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;

        out.x = - a0 * invDot;
        out.y = - a1 * invDot;
        out.z = - a2 * invDot;
        out.w = a3 * invDot;

        return out;

    }

    invert() {

        return Quaternion.invert( this, this );

    }

    static setFromMatrix4( out, m ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        const raw = m.raw || m;
        const m11 = raw[ 0 ];
        const m12 = raw[ 4 ];
        const m13 = raw[ 8 ];
        const m21 = raw[ 1 ];
        const m22 = raw[ 5 ];
        const m23 = raw[ 9 ];
        const m31 = raw[ 2 ];
        const m32 = raw[ 6 ];
        const m33 = raw[ 10 ];

        const trace = m11 + m22 + m33;
        let s;

        if ( trace > 0 ) {

            s = 0.5 / Math.sqrt( trace + 1.0 );

            out.w = 0.25 / s;
            out.x = ( m32 - m23 ) * s;
            out.y = ( m13 - m31 ) * s;
            out.z = ( m21 - m12 ) * s;

        } else if ( m11 > m22 && m11 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

            out.w = ( m32 - m23 ) / s;
            out.x = 0.25 * s;
            out.y = ( m12 + m21 ) / s;
            out.z = ( m13 + m31 ) / s;

        } else if ( m22 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

            out.w = ( m13 - m31 ) / s;
            out.x = ( m12 + m21 ) / s;
            out.y = 0.25 * s;
            out.z = ( m23 + m32 ) / s;

        } else {

            s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

            out.w = ( m21 - m12 ) / s;
            out.x = ( m13 + m31 ) / s;
            out.y = ( m23 + m32 ) / s;
            out.z = 0.25 * s;

        }

        return out;

    }

    setFromMatrix4( m ) {

        return Quaternion.setFromMatrix4( this, m );

    }

    static lerp( out, a, b, t ) {

        const ax = a[ 0 ];
        const ay = a[ 1 ];
        const az = a[ 2 ];
        const aw = a[ 3 ];
        out[ 0 ] = ax + t * ( b[ 0 ] - ax );
        out[ 1 ] = ay + t * ( b[ 1 ] - ay );
        out[ 2 ] = az + t * ( b[ 2 ] - az );
        out[ 3 ] = aw + t * ( b[ 3 ] - aw );

        return out;

    }

    lerp( a, b, t ) {

        return Quaternion.lerp( this, a, b, t );

    }

    static slerp( out, a, b, t ) {

        // benchmarks:
        // http://jsperf.com/quaternion-slerp-implementations
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const aw = a.w;
        let bx = b.x;
        let by = b.y;
        let bz = b.z;
        let bw = b.w;
        let omega;
        let cosom;
        let sinom;
        let scale0;
        let scale1;
        // calc cosine
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        // adjust signs (if necessary)
        if ( cosom < 0.0 ) {

            cosom = - cosom;
            bx = - bx;
            by = - by;
            bz = - bz;
            bw = - bw;

        }
        // calculate coefficients
        if ( ( 1.0 - cosom ) > 0.000001 ) {

            // standard case (slerp)
            omega = Math.acos( cosom );
            sinom = Math.sin( omega );
            scale0 = Math.sin( ( 1.0 - t ) * omega ) / sinom;
            scale1 = Math.sin( t * omega ) / sinom;

        } else {

            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;

        }
        // calculate final values
        out.x = scale0 * ax + scale1 * bx;
        out.y = scale0 * ay + scale1 * by;
        out.z = scale0 * az + scale1 * bz;
        out.w = scale0 * aw + scale1 * bw;

        return out;

    }

    slerp( a, b, t ) {

        return Quaternion.slerp( this, a, b, t );

    }

}
