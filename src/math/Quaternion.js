/* eslint no-param-reassign: 0 no-mixed-operators:0 */
import { Vector3 } from './Vector3';

let v1 = new Vector3();
let r;
const ESP = 0.000001;

class Quaternion {

    constructor( x, y, z, w ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;

    }

    set( x, y, z, w ) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    }

    clone() {

        return new Quaternion( this.x, this.y, this.z, this.w );

    }

    getArray() {

        return [ this.x, this.y, this.z, this.w ];

    }

    setFromEuler( x, y, z ) {

        Quaternion.fromEuler( this.raw, x, y, z );
        return this;

    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

    }

    normalize() {

        Quaternion.normalize( this, this );
        return this;

    }

    static normalize( out, a ) {

        let l = a.length();

        if ( l === 0 ) {

            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;

        } else {

            l = 1 / l;
            out.x = a.x * l;
            out.y = a.y * l;
            out.z = a.z * l;
            out.w = a.w * l;

        }

        return out;

    }

    setFromUnitVectors( vFrom, vTo ) {

        if ( v1 === undefined ) v1 = new Vector3();
        r = vFrom.dot( vTo ) + 1;

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

        return this.normalize();

    }

    static fromEuler( out, x, y, z ) {

        const halfToRad = 0.5 * Math.PI / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        const sx = Math.sin( x );
        const cx = Math.cos( x );
        const sy = Math.sin( y );
        const cy = Math.cos( y );
        const sz = Math.sin( z );
        const cz = Math.cos( z );
        out.x = sx * cy * cz - cx * sy * sz;
        out.y = cx * sy * cz + sx * cy * sz;
        out.z = cx * cy * sz - sx * sy * cz;
        out.w = cx * cy * cz + sx * sy * sz;
        return out;

    }

    invert() {

        Quaternion.invert( this, this );
        return this;

    }

    static invert( out, a ) {

        const a0 = a.x;
        const a1 = a.y;
        const a2 = a.z;
        const a3 = a.w;
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;

        out.x = - a0 * invDot;
        out.y = - a1 * invDot;
        out.z = - a2 * invDot;
        out.w = a3 * invDot;

        return out;

    }

}

export { Quaternion };
