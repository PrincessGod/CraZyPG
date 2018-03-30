/* eslint no-param-reassign: 0 no-mixed-operators:0 */
import { Vector3 } from './Vector3';

function noop() {}

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

    this._afterSetted = noop;

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

    afterSetted: {

        get() {

            return this._afterSetted;

        },

        set( fun ) {

            if ( typeof fun === 'function' )
                this._afterSetted = fun;

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

        this.afterSetted();
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

} );

export { Quaternion };
