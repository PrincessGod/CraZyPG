/* eslint no-param-reassign: 0 no-mixed-operators:0 */
import { Vector3 } from './Vector3';

function Quaternion( x, y, z, w ) {

    this.raw = [];
    if ( arguments.length === 1 )
        this.raw = x.slice( 0, 4 );
    else {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 1;

    }

}

Object.defineProperties( Quaternion.prototype, {

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

    w: {
        get() {

            return this.raw[ 3 ];

        },

        set( v ) {

            this.raw[ 3 ] = v;

        },
    },

} );

Object.assign( Quaternion.prototype, {

    set( x, y, z, w ) {

        if ( arguments.length === 1 )
            this.raw = x.slice( 0, 4 );
        else {

            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;

        }

        return this;

    },

    clone() {

        return new Quaternion( this.raw );

    },

    getArray() {

        return this.raw;

    },

    setFromEuler( x, y, z ) {

        Quaternion.fromEuler( this.raw, x, y, z );
        return this;

    },

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

    },

    normalize() {

        Quaternion.normalize( this.raw, this.raw );
        return this;

    },

    setFromUnitVectors: ( function () {

        let v1 = new Vector3();
        const ESP = 0.000001;

        return function setFromUnitVectors( vFrom, vTo ) {

            v1 = new Vector3();
            let r = vFrom.dot( vTo ) + 1;

            if ( r < ESP ) {

                r = 0;
                if ( Math.abs( vFrom.x ) > Map.abs( vFrom.z ) )
                    v1.set( - vFrom.y, vFrom.x, 0 );
                else
                    v1.set( 0, - vFrom.z, vFrom.y );

            } else
                Vector3.cross( v1, vFrom, vTo );

            this.x = v1.x;
            this.y = v1.y;
            this.z = v1.z;
            this.w = v1.w;

            this.normalize();
            return this;

        };

    }() ),

    invert() {

        Quaternion.invert( this.raw, this.raw );
        return this;

    },

} );

Object.assign( Quaternion, {

    normalize( out, a ) {

        let l = Math.sqrt( a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 1 ] + a[ 2 ] * a[ 2 ] + a[ 3 ] * a[ 3 ] );

        if ( l === 0 ) {

            out[ 0 ] = 0;
            out[ 1 ] = 0;
            out[ 2 ] = 0;
            out[ 3 ] = 1;

        } else {

            l = 1 / l;
            out[ 0 ] = a[ 0 ] * l;
            out[ 1 ] = a[ 1 ] * l;
            out[ 2 ] = a[ 2 ] * l;
            out[ 3 ] = a[ 3 ] * l;

        }

        return out;

    },

    fromEuler( out, x, y, z ) {

        // XYZ order
        const cos = Math.cos;
        const sin = Math.sin;

        const c1 = cos( x / 2 );
        const c2 = cos( y / 2 );
        const c3 = cos( z / 2 );

        const s1 = sin( x / 2 );
        const s2 = sin( y / 2 );
        const s3 = sin( z / 2 );

        out[ 0 ] = s1 * c2 * c3 + c1 * s2 * s3;
        out[ 1 ] = c1 * s2 * c3 - s1 * c2 * s3;
        out[ 2 ] = c1 * c2 * s3 + s1 * s2 * c3;
        out[ 3 ] = c1 * c2 * c3 - s1 * s2 * s3;

    },

    invert( out, a ) {

        const a0 = a[ 0 ];
        const a1 = a[ 1 ];
        const a2 = a[ 2 ];
        const a3 = a[ 3 ];
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;

        out[ 0 ] = - a0 * invDot;
        out[ 1 ] = - a1 * invDot;
        out[ 2 ] = - a2 * invDot;
        out[ 3 ] = a3 * invDot;

        return out;

    },

    lerp( out, a, b, t ) {

        const ax = a[ 0 ];
        const ay = a[ 1 ];
        const az = a[ 2 ];
        const aw = a[ 3 ];
        out[ 0 ] = ax + t * ( b[ 0 ] - ax );
        out[ 1 ] = ay + t * ( b[ 1 ] - ay );
        out[ 2 ] = az + t * ( b[ 2 ] - az );
        out[ 3 ] = aw + t * ( b[ 3 ] - aw );
        return out;

    },

    slerp( out, a, b, t ) {

        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations
        const ax = a[ 0 ];
        const ay = a[ 1 ];
        const az = a[ 2 ];
        const aw = a[ 3 ];
        let bx = b[ 0 ];
        let by = b[ 1 ];
        let bz = b[ 2 ];
        let bw = b[ 3 ];
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
        out[ 0 ] = scale0 * ax + scale1 * bx;
        out[ 1 ] = scale0 * ay + scale1 * by;
        out[ 2 ] = scale0 * az + scale1 * bz;
        out[ 3 ] = scale0 * aw + scale1 * bw;
        return out;

    },

} );

export { Quaternion };
