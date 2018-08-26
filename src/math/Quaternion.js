import { Vector4 } from './Vector4';

export class Quaternion extends Vector4 {

    constructor( x, y, z, w = 1 ) {

        super( x, y, z, w );

    }

    static setFromEuler( out, e ) {

        // XYZ order

        const x = e.x;
        const y = e.y;
        const z = e.z;

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
    setFromEuler( e ) {

        return Quaternion.setFromEuler( this, e );

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
