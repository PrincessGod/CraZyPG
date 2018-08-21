/* eslint no-param-reassign: 0 */
import { PMath } from './Math';
import { Matrix3 } from './Matrix3';
import { Quaternion } from './Quaternion';

export class Matrix4 {

    constructor( array ) {

        Matrix4.identity( this );
        if ( array ) this.set( ...array );

    }

    get raw() {

        return this._raw;

    }

    static identity( out ) {

        if ( ! out._raw )
            out._raw = new Float32Array( 16 );

        out._raw[ 0 ] = 1;
        out._raw[ 1 ] = 0;
        out._raw[ 2 ] = 0;
        out._raw[ 3 ] = 0;
        out._raw[ 4 ] = 0;
        out._raw[ 5 ] = 1;
        out._raw[ 6 ] = 0;
        out._raw[ 7 ] = 0;
        out._raw[ 8 ] = 0;
        out._raw[ 9 ] = 0;
        out._raw[ 10 ] = 1;
        out._raw[ 11 ] = 0;
        out._raw[ 12 ] = 0;
        out._raw[ 13 ] = 0;
        out._raw[ 14 ] = 0;
        out._raw[ 15 ] = 1;

        return out;

    }

    identity() {

        return Matrix4.identity( this );

    }

    static set( out, values ) {

        for ( let i = 0; i < 16; i ++ )
            out.raw[ i ] = values[ i ];

        return out;

    }

    set( ...values ) {

        return Matrix4.set( this, ...values );

    }

    static setFromQuat( out, q ) {

        const y = q.y;
        const x = q.x;
        const z = q.z;
        const w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        out.raw[ 0 ] = 1 - yy - zz;
        out.raw[ 1 ] = yx + wz;
        out.raw[ 2 ] = zx - wy;
        out.raw[ 3 ] = 0;
        out.raw[ 4 ] = yx - wz;
        out.raw[ 5 ] = 1 - xx - zz;
        out.raw[ 6 ] = zy + wx;
        out.raw[ 7 ] = 0;
        out.raw[ 8 ] = zx + wy;
        out.raw[ 9 ] = zy - wx;
        out.raw[ 10 ] = 1 - xx - yy;
        out.raw[ 11 ] = 0;
        out.raw[ 12 ] = 0;
        out.raw[ 13 ] = 0;
        out.raw[ 14 ] = 0;
        out.raw[ 15 ] = 1;

        return out;

    }

    setFromQuat( q ) {

        return Matrix4.setFromQuat( this, q );

    }

    static setFromTRS( out, t, r, s ) {

        const x = r.x;
        const y = r.y;
        const z = r.z;
        const w = r.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const sx = s.x;
        const sy = s.y;
        const sz = s.z;
        out.raw[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
        out.raw[ 1 ] = ( xy + wz ) * sx;
        out.raw[ 2 ] = ( xz - wy ) * sx;
        out.raw[ 3 ] = 0;
        out.raw[ 4 ] = ( xy - wz ) * sy;
        out.raw[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
        out.raw[ 6 ] = ( yz + wx ) * sy;
        out.raw[ 7 ] = 0;
        out.raw[ 8 ] = ( xz + wy ) * sz;
        out.raw[ 9 ] = ( yz - wx ) * sz;
        out.raw[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
        out.raw[ 11 ] = 0;
        out.raw[ 12 ] = t.x;
        out.raw[ 13 ] = t.y;
        out.raw[ 14 ] = t.z;
        out.raw[ 15 ] = 1;

        return out;

    }

    setFromTRS( t, r, s ) {

        return Matrix4.setFromTRS( this, t, r, s );

    }

    static invert( out, m ) {

        const a00 = m.raw[ 0 ];
        const a01 = m.raw[ 1 ];
        const a02 = m.raw[ 2 ];
        const a03 = m.raw[ 3 ];
        const a10 = m.raw[ 4 ];
        const a11 = m.raw[ 5 ];
        const a12 = m.raw[ 6 ];
        const a13 = m.raw[ 7 ];
        const a20 = m.raw[ 8 ];
        const a21 = m.raw[ 9 ];
        const a22 = m.raw[ 10 ];
        const a23 = m.raw[ 11 ];
        const a30 = m.raw[ 12 ];
        const a31 = m.raw[ 13 ];
        const a32 = m.raw[ 14 ];
        const a33 = m.raw[ 15 ];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if ( ! det ) return false;

        det = 1.0 / det;

        out.raw[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * det;
        out.raw[ 1 ] = ( a02 * b10 - a01 * b11 - a03 * b09 ) * det;
        out.raw[ 2 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * det;
        out.raw[ 3 ] = ( a22 * b04 - a21 * b05 - a23 * b03 ) * det;
        out.raw[ 4 ] = ( a12 * b08 - a10 * b11 - a13 * b07 ) * det;
        out.raw[ 5 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * det;
        out.raw[ 6 ] = ( a32 * b02 - a30 * b05 - a33 * b01 ) * det;
        out.raw[ 7 ] = ( a20 * b05 - a22 * b02 + a23 * b01 ) * det;
        out.raw[ 8 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * det;
        out.raw[ 9 ] = ( a01 * b08 - a00 * b10 - a03 * b06 ) * det;
        out.raw[ 10 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * det;
        out.raw[ 11 ] = ( a21 * b02 - a20 * b04 - a23 * b00 ) * det;
        out.raw[ 12 ] = ( a11 * b07 - a10 * b09 - a12 * b06 ) * det;
        out.raw[ 13 ] = ( a00 * b09 - a01 * b07 + a02 * b06 ) * det;
        out.raw[ 14 ] = ( a31 * b01 - a30 * b03 - a32 * b00 ) * det;
        out.raw[ 15 ] = ( a20 * b03 - a21 * b01 + a22 * b00 ) * det;

        return out;

    }

    invert() {

        return Matrix4.invert( this, this );

    }

    static mult( out, a, b ) {

        const a00 = a.raw[ 0 ];
        const a01 = a.raw[ 1 ];
        const a02 = a.raw[ 2 ];
        const a03 = a.raw[ 3 ];
        const a10 = a.raw[ 4 ];
        const a11 = a.raw[ 5 ];
        const a12 = a.raw[ 6 ];
        const a13 = a.raw[ 7 ];
        const a20 = a.raw[ 8 ];
        const a21 = a.raw[ 9 ];
        const a22 = a.raw[ 10 ];
        const a23 = a.raw[ 11 ];
        const a30 = a.raw[ 12 ];
        const a31 = a.raw[ 13 ];
        const a32 = a.raw[ 14 ];
        const a33 = a.raw[ 15 ];

        let b0 = b.raw[ 0 ];
        let b1 = b.raw[ 1 ];
        let b2 = b.raw[ 2 ];
        let b3 = b.raw[ 3 ];

        out.raw[ 0 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.raw[ 1 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.raw[ 2 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.raw[ 3 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.raw[ 4 ]; b1 = b.raw[ 5 ]; b2 = b.raw[ 6 ]; b3 = b.raw[ 7 ];
        out.raw[ 4 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.raw[ 5 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.raw[ 6 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.raw[ 7 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.raw[ 8 ]; b1 = b.raw[ 9 ]; b2 = b.raw[ 10 ]; b3 = b.raw[ 11 ];
        out.raw[ 8 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.raw[ 9 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.raw[ 10 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.raw[ 11 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.raw[ 12 ]; b1 = b.raw[ 13 ]; b2 = b.raw[ 14 ]; b3 = b.raw[ 15 ];
        out.raw[ 12 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.raw[ 13 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.raw[ 14 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.raw[ 15 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return out;

    }

    mult( m ) {

        return Matrix4.mult( this, this, m );

    }

    static get cache() {

        if ( ! Matrix4._cache ) Matrix4._cache = new Matrix4();
        return Matrix4._cache;

    }

    static applyQuat( out, q ) {

        return out.mult( Matrix4.cache.setFromQuat( q ) );

    }

    applyQuat( q ) {

        return Matrix4.applyQuat( this, q );

    }

    static perspective( out, fov, aspect, near, far ) {

        const f = 1.0 / Math.tan( fov / 2 );
        const nf = 1 / ( near - far );
        out.raw[ 0 ] = f / aspect;
        out.raw[ 1 ] = 0;
        out.raw[ 2 ] = 0;
        out.raw[ 3 ] = 0;
        out.raw[ 4 ] = 0;
        out.raw[ 5 ] = f;
        out.raw[ 6 ] = 0;
        out.raw[ 7 ] = 0;
        out.raw[ 8 ] = 0;
        out.raw[ 9 ] = 0;
        out.raw[ 10 ] = ( far + near ) * nf;
        out.raw[ 11 ] = - 1;
        out.raw[ 12 ] = 0;
        out.raw[ 13 ] = 0;
        out.raw[ 14 ] = 2 * far * near * nf;
        out.raw[ 15 ] = 0;

        if ( far === Number.POSITIVE_INFINITY ) {

            out.raw[ 10 ] = - 1;
            out.raw[ 11 ] = - 1;
            out.raw[ 14 ] = - 2 * near;

        }

        return out;

    }

    perspective( fov, aspect, near, far ) {

        return Matrix4.perspective( this, fov, aspect, near, far );

    }

    static orthographic( out, left, right, bottom, top, near, far ) {

        const lr = 1 / ( left - right );
        const bt = 1 / ( bottom - top );
        const nf = 1 / ( near - far );
        out.raw[ 0 ] = - 2 * lr;
        out.raw[ 1 ] = 0;
        out.raw[ 3 ] = 0;
        out.raw[ 4 ] = 0;
        out.raw[ 5 ] = - 2 * bt;
        out.raw[ 6 ] = 0;
        out.raw[ 7 ] = 0;
        out.raw[ 8 ] = 0;
        out.raw[ 9 ] = 0;
        out.raw[ 10 ] = 2 * nf;
        out.raw[ 11 ] = 0;
        out.raw[ 12 ] = ( left + right ) * lr;
        out.raw[ 13 ] = ( top + bottom ) * bt;
        out.raw[ 14 ] = ( far + near ) * nf;
        out.raw[ 15 ] = 1;

        return out;

    }

    orthographic( left, right, bottom, top, near, far ) {

        return Matrix4.orthographic( this, left, right, bottom, top, near, far );

    }

    static getNormalMat3( out, m ) {

        const a00 = m.raw[ 0 ];
        const a01 = m.raw[ 1 ];
        const a02 = m.raw[ 2 ];
        const a03 = m.raw[ 3 ];
        const a10 = m.raw[ 4 ];
        const a11 = m.raw[ 5 ];
        const a12 = m.raw[ 6 ];
        const a13 = m.raw[ 7 ];
        const a20 = m.raw[ 8 ];
        const a21 = m.raw[ 9 ];
        const a22 = m.raw[ 10 ];
        const a23 = m.raw[ 11 ];
        const a30 = m.raw[ 12 ];
        const a31 = m.raw[ 13 ];
        const a32 = m.raw[ 14 ];
        const a33 = m.raw[ 15 ];

        const b00 = ( a00 * a11 ) - ( a01 * a10 );
        const b01 = ( a00 * a12 ) - ( a02 * a10 );
        const b02 = ( a00 * a13 ) - ( a03 * a10 );
        const b03 = ( a01 * a12 ) - ( a02 * a11 );
        const b04 = ( a01 * a13 ) - ( a03 * a11 );
        const b05 = ( a02 * a13 ) - ( a03 * a12 );
        const b06 = ( a20 * a31 ) - ( a21 * a30 );
        const b07 = ( a20 * a32 ) - ( a22 * a30 );
        const b08 = ( a20 * a33 ) - ( a23 * a30 );
        const b09 = ( a21 * a32 ) - ( a22 * a31 );
        const b10 = ( a21 * a33 ) - ( a23 * a31 );
        const b11 = ( a22 * a33 ) - ( a23 * a32 );

        let det = ( ( b00 * b11 ) - ( b01 * b10 ) ) + ( b02 * b09 ) + ( ( b03 * b08 ) - ( b04 * b07 ) ) + ( b05 * b06 );

        if ( ! det ) return null;

        det = 1.0 / det;

        out.raw[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * det;
        out.raw[ 1 ] = ( a12 * b08 - a10 * b11 - a13 * b07 ) * det;
        out.raw[ 2 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * det;

        out.raw[ 3 ] = ( a02 * b10 - a01 * b11 - a03 * b09 ) * det;
        out.raw[ 4 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * det;
        out.raw[ 5 ] = ( a01 * b08 - a00 * b10 - a03 * b06 ) * det;

        out.raw[ 6 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * det;
        out.raw[ 7 ] = ( a32 * b02 - a30 * b05 - a33 * b01 ) * det;
        out.raw[ 8 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * det;

        return out;

    }

    getNormalMat3( out ) {

        if ( ! out ) out = new Matrix3();
        return Matrix4.getNormalMat3( out, this );

    }

    static transformVec4( out, m, v ) {

        out.raw[ 0 ] = m.raw[ 0 ] * v.raw[ 0 ] + m.raw[ 4 ] * v.raw[ 1 ] + m.raw[ 8 ] * v.raw[ 2 ] + m.raw[ 12 ] * v.raw[ 3 ];
        out.raw[ 1 ] = m.raw[ 1 ] * v.raw[ 0 ] + m.raw[ 5 ] * v.raw[ 1 ] + m.raw[ 9 ] * v.raw[ 2 ] + m.raw[ 13 ] * v.raw[ 3 ];
        out.raw[ 2 ] = m.raw[ 2 ] * v.raw[ 0 ] + m.raw[ 6 ] * v.raw[ 1 ] + m.raw[ 10 ] * v.raw[ 2 ] + m.raw[ 14 ] * v.raw[ 3 ];
        out.raw[ 3 ] = m.raw[ 3 ] * v.raw[ 0 ] + m.raw[ 7 ] * v.raw[ 1 ] + m.raw[ 11 ] * v.raw[ 2 ] + m.raw[ 15 ] * v.raw[ 3 ];

        return out;

    }

    transformVec4( out, v ) {

        return Matrix4.transformVec4( out, this, v );

    }

    static lookAt( out, eye, target, up ) {

        let x0;
        let x1;
        let x2;
        let y0;
        let y1;
        let y2;
        let z0;
        let z1;
        let z2;
        let len;
        const eyex = eye.raw[ 0 ];
        const eyey = eye.raw[ 1 ];
        const eyez = eye.raw[ 2 ];
        const upx = up.raw[ 0 ];
        const upy = up.raw[ 1 ];
        const upz = up.raw[ 2 ];
        const centerx = target.raw[ 0 ];
        const centery = target.raw[ 1 ];
        const centerz = target.raw[ 2 ];
        if ( Math.abs( eyex - centerx ) < 0.000001 &&
            Math.abs( eyey - centery ) < 0.000001 &&
            Math.abs( eyez - centerz ) < 0.000001 )
            return Matrix4.identity( out );

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.sqrt( z0 * z0 + z1 * z1 + z2 * z2 );
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt( x0 * x0 + x1 * x1 + x2 * x2 );
        if ( ! len ) {

            x0 = 0;
            x1 = 0;
            x2 = 0;

        } else {

            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;

        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.sqrt( y0 * y0 + y1 * y1 + y2 * y2 );
        if ( ! len ) {

            y0 = 0;
            y1 = 0;
            y2 = 0;

        } else {

            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;

        }
        out.raw[ 0 ] = x0;
        out.raw[ 1 ] = y0;
        out.raw[ 2 ] = z0;
        out.raw[ 3 ] = 0;
        out.raw[ 4 ] = x1;
        out.raw[ 5 ] = y1;
        out.raw[ 6 ] = z1;
        out.raw[ 7 ] = 0;
        out.raw[ 8 ] = x2;
        out.raw[ 9 ] = y2;
        out.raw[ 10 ] = z2;
        out.raw[ 11 ] = 0;
        out.raw[ 12 ] = - ( x0 * eyex + x1 * eyey + x2 * eyez );
        out.raw[ 13 ] = - ( y0 * eyex + y1 * eyey + y2 * eyez );
        out.raw[ 14 ] = - ( z0 * eyex + z1 * eyey + z2 * eyez );
        out.raw[ 15 ] = 1;

        return out;

    }

    lookAt( eye, target, up ) {

        return Matrix4.lookAt( this, eye, target, up );

    }

    static equals( a, b ) {

        const a0 = a.raw[ 0 ];
        const a1 = a.raw[ 1 ];
        const a2 = a.raw[ 2 ];
        const a3 = a.raw[ 3 ];
        const a4 = a.raw[ 4 ];
        const a5 = a.raw[ 5 ];
        const a6 = a.raw[ 6 ];
        const a7 = a.raw[ 7 ];
        const a8 = a.raw[ 8 ];
        const a9 = a.raw[ 9 ];
        const a10 = a.raw[ 10 ];
        const a11 = a.raw[ 11 ];
        const a12 = a.raw[ 12 ];
        const a13 = a.raw[ 13 ];
        const a14 = a.raw[ 14 ];
        const a15 = a.raw[ 15 ];
        const b0 = b.raw[ 0 ];
        const b1 = b.raw[ 1 ];
        const b2 = b.raw[ 2 ];
        const b3 = b.raw[ 3 ];
        const b4 = b.raw[ 4 ];
        const b5 = b.raw[ 5 ];
        const b6 = b.raw[ 6 ];
        const b7 = b.raw[ 7 ];
        const b8 = b.raw[ 8 ];
        const b9 = b.raw[ 9 ];
        const b10 = b.raw[ 10 ];
        const b11 = b.raw[ 11 ];
        const b12 = b.raw[ 12 ];
        const b13 = b.raw[ 13 ];
        const b14 = b.raw[ 14 ];
        const b15 = b.raw[ 15 ];

        return ( Math.abs( a0 - b0 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a0 ), Math.abs( b0 ) ) &&
              Math.abs( a1 - b1 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a1 ), Math.abs( b1 ) ) &&
              Math.abs( a2 - b2 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a2 ), Math.abs( b2 ) ) &&
              Math.abs( a3 - b3 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a3 ), Math.abs( b3 ) ) &&
              Math.abs( a4 - b4 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a4 ), Math.abs( b4 ) ) &&
              Math.abs( a5 - b5 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a5 ), Math.abs( b5 ) ) &&
              Math.abs( a6 - b6 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a6 ), Math.abs( b6 ) ) &&
              Math.abs( a7 - b7 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a7 ), Math.abs( b7 ) ) &&
              Math.abs( a8 - b8 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a8 ), Math.abs( b8 ) ) &&
              Math.abs( a9 - b9 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a9 ), Math.abs( b9 ) ) &&
              Math.abs( a10 - b10 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a10 ), Math.abs( b10 ) ) &&
              Math.abs( a11 - b11 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a11 ), Math.abs( b11 ) ) &&
              Math.abs( a12 - b12 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a12 ), Math.abs( b12 ) ) &&
              Math.abs( a13 - b13 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a13 ), Math.abs( b13 ) ) &&
              Math.abs( a14 - b14 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a14 ), Math.abs( b14 ) ) &&
              Math.abs( a15 - b15 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a15 ), Math.abs( b15 ) ) );

    }

    equals( m ) {

        return Matrix4.equals( this, m );

    }

    static clone( m ) {

        var result = new Matrix4();
        return result.copy( m );

    }

    clone() {

        return Matrix4.clone( this );

    }

    static copy( out, m ) {

        for ( let i = 0; i < 16; i ++ )
            out.raw[ i ] = m.raw[ i ];

        return out;

    }

    copy( m ) {

        return Matrix4.copy( this, m );

    }

    static determinant( m ) {

        const n11 = m.raw[ 0 ];
        const n12 = m.raw[ 4 ];
        const n13 = m.raw[ 8 ];
        const n14 = m.raw[ 12 ];
        const n21 = m.raw[ 1 ];
        const n22 = m.raw[ 5 ];
        const n23 = m.raw[ 9 ];
        const n24 = m.raw[ 13 ];
        const n31 = m.raw[ 2 ];
        const n32 = m.raw[ 6 ];
        const n33 = m.raw[ 10 ];
        const n34 = m.raw[ 14 ];
        const n41 = m.raw[ 3 ];
        const n42 = m.raw[ 7 ];
        const n43 = m.raw[ 11 ];
        const n44 = m.raw[ 15 ];

        // TODO: make this more efficient
        // ( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

        return (
            n41 * (
                + n14 * n23 * n32
                - n13 * n24 * n32
                - n14 * n22 * n33
                + n12 * n24 * n33
                + n13 * n22 * n34
                - n12 * n23 * n34
            ) +
            n42 * (
                + n11 * n23 * n34
                - n11 * n24 * n33
                + n14 * n21 * n33
                - n13 * n21 * n34
                + n13 * n24 * n31
                - n14 * n23 * n31
            ) +
            n43 * (
                + n11 * n24 * n32
                - n11 * n22 * n34
                - n14 * n21 * n32
                + n12 * n21 * n34
                + n14 * n22 * n31
                - n12 * n24 * n31
            ) +
            n44 * (
                - n13 * n22 * n31
                - n11 * n23 * n32
                + n11 * n22 * n33
                + n13 * n21 * n32
                - n12 * n21 * n33
                + n12 * n23 * n31
            )
        );

    }

    determinant() {

        return Matrix4.determinant( this );

    }

    static decompose( m, position, quaternion, scale ) {

        const te = Matrix4.clone( m );

        let sx = Math.sqrt( ( te.raw[ 0 ] * te.raw[ 0 ] ) + ( te.raw[ 1 ] * te.raw[ 1 ] ) + ( te.raw[ 2 ] * te.raw[ 2 ] ) );
        const sy = Math.sqrt( ( te.raw[ 4 ] * te.raw[ 4 ] ) + ( te.raw[ 5 ] * te.raw[ 5 ] ) + ( te.raw[ 6 ] * te.raw[ 6 ] ) );
        const sz = Math.sqrt( ( te.raw[ 8 ] * te.raw[ 8 ] ) + ( te.raw[ 9 ] * te.raw[ 9 ] ) + ( te.raw[ 10 ] * te.raw[ 10 ] ) );

        // if determine is negative, we need to invert one scale
        const det = Matrix4.determinant( te );
        if ( det < 0 ) sx = - sx;

        position.raw[ 0 ] = te.raw[ 12 ];
        position.raw[ 1 ] = te.raw[ 13 ];
        position.raw[ 2 ] = te.raw[ 14 ];

        // scale the rotation part

        const invSX = 1 / sx;
        const invSY = 1 / sy;
        const invSZ = 1 / sz;

        te.raw[ 0 ] *= invSX;
        te.raw[ 1 ] *= invSX;
        te.raw[ 2 ] *= invSX;

        te.raw[ 4 ] *= invSY;
        te.raw[ 5 ] *= invSY;
        te.raw[ 6 ] *= invSY;

        te.raw[ 8 ] *= invSZ;
        te.raw[ 9 ] *= invSZ;
        te.raw[ 10 ] *= invSZ;

        Quaternion.setFromMatrix4( quaternion, te );

        scale.raw[ 0 ] = sx;
        scale.raw[ 1 ] = sy;
        scale.raw[ 2 ] = sz;

        return m;

    }

    decompose( position, quaternion, scale ) {

        return Matrix4.decompose( this, position, quaternion, scale );

    }

}
