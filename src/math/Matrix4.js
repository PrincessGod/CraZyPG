/* eslint no-param-reassign: 0 no-mixed-operators:0 */

const EPS = 0.000001;

function Matrix4() {

    this.raw = Matrix4.identity();

}

Object.assign( Matrix4.prototype, {

    translate( x, y, z ) {

        if ( x.x !== undefined ) {

            Matrix4.translate( this.raw, x.x, x.y, x.z );
            return this;

        }
        Matrix4.translate( this.raw, x, y, z );
        return this;

    },

    rotateX( rad ) {

        Matrix4.rotateX( this.raw, rad );
        return this;

    },

    rotateY( rad ) {

        Matrix4.rotateY( this.raw, rad );
        return this;

    },

    rotateZ( rad ) {

        Matrix4.rotateZ( this.raw, rad );
        return this;

    },

    scale( x, y, z ) {

        if ( x.x !== undefined ) {

            Matrix4.scale( this.raw, x.x, x.y, x.z );
            return this;

        }

        Matrix4.scale( this.raw, x, y, z );
        return this;

    },

    invert() {

        Matrix4.invert( this.raw );
        return this;

    },

    resetRotation() {

        for ( let i = 0; i < this.raw.length; i ++ ) {

            if ( i >= 12 && i <= 14 ) continue; // eslint-disable-line
            this.raw[ i ] = ( i % 5 === 0 ) ? 1 : 0;

        }

        return this;

    },

    reset() {

        for ( let i = 0; i < this.raw.length; i ++ )
            this.raw[ i ] = ( i % 5 === 0 ) ? 1 : 0;
        return this;

    },

} );

Object.assign( Matrix4, {

    identity() {

        const a = new Float32Array( 16 );
        a[ 0 ] = 1;
        a[ 5 ] = 1;
        a[ 10 ] = 1;
        a[ 15 ] = 1;
        return a;

    },

    perspective( out, fov, aspect, near, far ) {

        const f = 1.0 / Math.tan( fov / 2 );
        const nf = 1 / ( near - far );
        out[ 0 ] = f / aspect;
        out[ 1 ] = 0;
        out[ 2 ] = 0;
        out[ 3 ] = 0;
        out[ 4 ] = 0;
        out[ 5 ] = f;
        out[ 6 ] = 0;
        out[ 7 ] = 0;
        out[ 8 ] = 0;
        out[ 9 ] = 0;
        out[ 10 ] = ( far + near ) * nf;
        out[ 11 ] = - 1;
        out[ 12 ] = 0;
        out[ 13 ] = 0;
        out[ 14 ] = 2 * far * near * nf;
        out[ 15 ] = 0;

        return out;

    },

    ortho( out, left, right, bottom, top, near, far ) {

        const lr = 1 / ( left - right );
        const bt = 1 / ( bottom - top );
        const nf = 1 / ( near - far );
        out[ 0 ] = - 2 * lr;
        out[ 1 ] = 0;
        out[ 3 ] = 0;
        out[ 4 ] = 0;
        out[ 5 ] = - 2 * bt;
        out[ 6 ] = 0;
        out[ 7 ] = 0;
        out[ 8 ] = 0;
        out[ 9 ] = 0;
        out[ 10 ] = 2 * nf;
        out[ 11 ] = 0;
        out[ 12 ] = ( left + right ) * lr;
        out[ 13 ] = ( top + bottom ) * bt;
        out[ 14 ] = ( far + near ) * nf;
        out[ 15 ] = 1;

        return out;

    },

    transpose( out, a ) {

        if ( out === a ) {

            const a01 = a[ 1 ];
            const a02 = a[ 2 ];
            const a03 = a[ 3 ];
            const a12 = a[ 6 ];
            const a13 = a[ 7 ];
            const a23 = a[ 11 ];
            out[ 1 ] = a[ 4 ];
            out[ 2 ] = a[ 8 ];
            out[ 3 ] = a[ 12 ];
            out[ 4 ] = a01;
            out[ 6 ] = a[ 9 ];
            out[ 7 ] = a[ 13 ];
            out[ 8 ] = a02;
            out[ 9 ] = a12;
            out[ 11 ] = a[ 14 ];
            out[ 12 ] = a03;
            out[ 13 ] = a13;
            out[ 14 ] = a23;

        } else {

            out[ 0 ] = a[ 0 ];
            out[ 1 ] = a[ 4 ];
            out[ 2 ] = a[ 8 ];
            out[ 3 ] = a[ 12 ];
            out[ 4 ] = a[ 1 ];
            out[ 5 ] = a[ 5 ];
            out[ 6 ] = a[ 9 ];
            out[ 7 ] = a[ 13 ];
            out[ 8 ] = a[ 2 ];
            out[ 9 ] = a[ 6 ];
            out[ 10 ] = a[ 10 ];
            out[ 11 ] = a[ 14 ];
            out[ 12 ] = a[ 3 ];
            out[ 13 ] = a[ 7 ];
            out[ 14 ] = a[ 11 ];
            out[ 15 ] = a[ 15 ];

        }

        return out;

    },

    normalMat3( out, a ) {

        const a00 = a[ 0 ];
        const a01 = a[ 1 ];
        const a02 = a[ 2 ];
        const a03 = a[ 3 ];
        const a10 = a[ 4 ];
        const a11 = a[ 5 ];
        const a12 = a[ 6 ];
        const a13 = a[ 7 ];
        const a20 = a[ 8 ];
        const a21 = a[ 9 ];
        const a22 = a[ 10 ];
        const a23 = a[ 11 ];
        const a30 = a[ 12 ];
        const a31 = a[ 13 ];
        const a32 = a[ 14 ];
        const a33 = a[ 15 ];

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

        out[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * det;
        out[ 1 ] = ( a12 * b08 - a10 * b11 - a13 * b07 ) * det;
        out[ 2 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * det;

        out[ 3 ] = ( a02 * b10 - a01 * b11 - a03 * b09 ) * det;
        out[ 4 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * det;
        out[ 5 ] = ( a01 * b08 - a00 * b10 - a03 * b06 ) * det;

        out[ 6 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * det;
        out[ 7 ] = ( a32 * b02 - a30 * b05 - a33 * b01 ) * det;
        out[ 8 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * det;
        return out;

    },

    multiplyVector( mat4, v ) {

        const x = v[ 0 ];
        const y = v[ 1 ];
        const z = v[ 2 ];
        const w = v[ 3 ];

        const c1r1 = mat4[ 0 ];
        const c2r1 = mat4[ 1 ];
        const c3r1 = mat4[ 2 ];
        const c4r1 = mat4[ 3 ];
        const c1r2 = mat4[ 4 ];
        const c2r2 = mat4[ 5 ];
        const c3r2 = mat4[ 6 ];
        const c4r2 = mat4[ 7 ];
        const c1r3 = mat4[ 8 ];
        const c2r3 = mat4[ 9 ];
        const c3r3 = mat4[ 10 ];
        const c4r3 = mat4[ 11 ];
        const c1r4 = mat4[ 12 ];
        const c2r4 = mat4[ 13 ];
        const c3r4 = mat4[ 14 ];
        const c4r4 = mat4[ 15 ];

        return [
            x * c1r1 + y * c1r2 + z * c1r3 + w * c1r4,
            x * c2r1 + y * c2r2 + z * c2r3 + w * c2r4,
            x * c3r1 + y * c3r2 + z * c3r3 + w * c3r4,
            x * c4r1 + y * c4r2 + z * c4r3 + w * c4r4,
        ];

    },

    transformVec4( out, m, v ) {

        out[ 0 ] = m[ 0 ] * v[ 0 ] + m[ 4 ] * v[ 1 ] + m[ 8 ] * v[ 2 ] + m[ 12 ] * v[ 3 ];
        out[ 1 ] = m[ 1 ] * v[ 0 ] + m[ 5 ] * v[ 1 ] + m[ 9 ] * v[ 2 ] + m[ 13 ] * v[ 3 ];
        out[ 2 ] = m[ 2 ] * v[ 0 ] + m[ 6 ] * v[ 1 ] + m[ 10 ] * v[ 2 ] + m[ 14 ] * v[ 3 ];
        out[ 3 ] = m[ 3 ] * v[ 0 ] + m[ 7 ] * v[ 1 ] + m[ 11 ] * v[ 2 ] + m[ 15 ] * v[ 3 ];
        return out;

    },

    mult( out, a, b ) {

        const a00 = a[ 0 ];
        const a01 = a[ 1 ];
        const a02 = a[ 2 ];
        const a03 = a[ 3 ];
        const a10 = a[ 4 ];
        const a11 = a[ 5 ];
        const a12 = a[ 6 ];
        const a13 = a[ 7 ];
        const a20 = a[ 8 ];
        const a21 = a[ 9 ];
        const a22 = a[ 10 ];
        const a23 = a[ 11 ];
        const a30 = a[ 12 ];
        const a31 = a[ 13 ];
        const a32 = a[ 14 ];
        const a33 = a[ 15 ];

        let b0 = b[ 0 ];
        let b1 = b[ 1 ];
        let b2 = b[ 2 ];
        let b3 = b[ 3 ];

        out[ 0 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 1 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 2 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 3 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[ 4 ]; b1 = b[ 5 ]; b2 = b[ 6 ]; b3 = b[ 7 ];
        out[ 4 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 5 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 6 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 7 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[ 8 ]; b1 = b[ 9 ]; b2 = b[ 10 ]; b3 = b[ 11 ];
        out[ 8 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 9 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 10 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 11 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[ 12 ]; b1 = b[ 13 ]; b2 = b[ 14 ]; b3 = b[ 15 ];
        out[ 12 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 13 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 14 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 15 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return out;

    },

    scale( out, x, y, z ) {

        out[ 0 ] *= x;
        out[ 1 ] *= x;
        out[ 2 ] *= x;
        out[ 3 ] *= x;
        out[ 4 ] *= y;
        out[ 5 ] *= y;
        out[ 6 ] *= y;
        out[ 7 ] *= y;
        out[ 8 ] *= z;
        out[ 9 ] *= z;
        out[ 10 ] *= z;
        out[ 11 ] *= z;

        return out;

    },

    rotateY( out, rad ) {

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const a00 = out[ 0 ];
        const a01 = out[ 1 ];
        const a02 = out[ 2 ];
        const a03 = out[ 3 ];
        const a20 = out[ 8 ];
        const a21 = out[ 9 ];
        const a22 = out[ 10 ];
        const a23 = out[ 11 ];

        out[ 0 ] = a00 * c - a20 * s;
        out[ 1 ] = a01 * c - a21 * s;
        out[ 2 ] = a02 * c - a22 * s;
        out[ 3 ] = a03 * c - a23 * s;
        out[ 8 ] = a00 * s + a20 * c;
        out[ 9 ] = a01 * s + a21 * c;
        out[ 10 ] = a02 * s + a22 * c;
        out[ 11 ] = a03 * s + a23 * c;

        return out;

    },

    rotateX( out, rad ) {

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const a10 = out[ 4 ];
        const a11 = out[ 5 ];
        const a12 = out[ 6 ];
        const a13 = out[ 7 ];
        const a20 = out[ 8 ];
        const a21 = out[ 9 ];
        const a22 = out[ 10 ];
        const a23 = out[ 11 ];

        out[ 4 ] = a10 * c + a20 * s;
        out[ 5 ] = a11 * c + a21 * s;
        out[ 6 ] = a12 * c + a22 * s;
        out[ 7 ] = a13 * c + a23 * s;
        out[ 8 ] = a20 * c - a10 * s;
        out[ 9 ] = a21 * c - a11 * s;
        out[ 10 ] = a22 * c - a12 * s;
        out[ 11 ] = a23 * c - a13 * s;

        return out;

    },

    rotateZ( out, rad ) {

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const a00 = out[ 0 ];
        const a01 = out[ 1 ];
        const a02 = out[ 2 ];
        const a03 = out[ 3 ];
        const a10 = out[ 4 ];
        const a11 = out[ 5 ];
        const a12 = out[ 6 ];
        const a13 = out[ 7 ];

        out[ 0 ] = a00 * c + a10 * s;
        out[ 1 ] = a01 * c + a11 * s;
        out[ 2 ] = a02 * c + a12 * s;
        out[ 3 ] = a03 * c + a13 * s;
        out[ 4 ] = a10 * c - a00 * s;
        out[ 5 ] = a11 * c - a01 * s;
        out[ 6 ] = a12 * c - a02 * s;
        out[ 7 ] = a13 * c - a03 * s;

        return out;

    },

    rotate( out, rad, axis ) {

        let x = axis[ 0 ];
        let y = axis[ 1 ];
        let z = axis[ 2 ];
        let len = Math.sqrt( x * x + y * y + z * z );

        if ( Math.abs( len ) < 0.000001 ) return null;

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const t = 1 - c;

        const a00 = out[ 0 ]; const a01 = out[ 1 ]; const a02 = out[ 2 ]; const a03 = out[ 3 ];
        const a10 = out[ 4 ]; const a11 = out[ 5 ]; const a12 = out[ 6 ]; const a13 = out[ 7 ];
        const a20 = out[ 8 ]; const a21 = out[ 9 ]; const a22 = out[ 10 ]; const a23 = out[ 11 ];

        const b00 = x * x * t + c; const b01 = y * x * t + z * s; const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s; const b11 = y * y * t + c; const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s; const b21 = y * z * t - x * s; const b22 = z * z * t + c;

        out[ 0 ] = a00 * b00 + a10 * b01 + a20 * b02;
        out[ 1 ] = a01 * b00 + a11 * b01 + a21 * b02;
        out[ 2 ] = a02 * b00 + a12 * b01 + a22 * b02;
        out[ 3 ] = a03 * b00 + a13 * b01 + a23 * b02;
        out[ 4 ] = a00 * b10 + a10 * b11 + a20 * b12;
        out[ 5 ] = a01 * b10 + a11 * b11 + a21 * b12;
        out[ 6 ] = a02 * b10 + a12 * b11 + a22 * b12;
        out[ 7 ] = a03 * b10 + a13 * b11 + a23 * b12;
        out[ 8 ] = a00 * b20 + a10 * b21 + a20 * b22;
        out[ 9 ] = a01 * b20 + a11 * b21 + a21 * b22;
        out[ 10 ] = a02 * b20 + a12 * b21 + a22 * b22;
        out[ 11 ] = a03 * b20 + a13 * b21 + a23 * b22;

        return out;

    },

    invert( out, mat ) {

        if ( mat === undefined ) mat = out; // If input isn't sent, then output is also input

        const a00 = mat[ 0 ];
        const a01 = mat[ 1 ];
        const a02 = mat[ 2 ];
        const a03 = mat[ 3 ];
        const a10 = mat[ 4 ];
        const a11 = mat[ 5 ];
        const a12 = mat[ 6 ];
        const a13 = mat[ 7 ];
        const a20 = mat[ 8 ];
        const a21 = mat[ 9 ];
        const a22 = mat[ 10 ];
        const a23 = mat[ 11 ];
        const a30 = mat[ 12 ];
        const a31 = mat[ 13 ];
        const a32 = mat[ 14 ];
        const a33 = mat[ 15 ];

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

        out[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * det;
        out[ 1 ] = ( a02 * b10 - a01 * b11 - a03 * b09 ) * det;
        out[ 2 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * det;
        out[ 3 ] = ( a22 * b04 - a21 * b05 - a23 * b03 ) * det;
        out[ 4 ] = ( a12 * b08 - a10 * b11 - a13 * b07 ) * det;
        out[ 5 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * det;
        out[ 6 ] = ( a32 * b02 - a30 * b05 - a33 * b01 ) * det;
        out[ 7 ] = ( a20 * b05 - a22 * b02 + a23 * b01 ) * det;
        out[ 8 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * det;
        out[ 9 ] = ( a01 * b08 - a00 * b10 - a03 * b06 ) * det;
        out[ 10 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * det;
        out[ 11 ] = ( a21 * b02 - a20 * b04 - a23 * b00 ) * det;
        out[ 12 ] = ( a11 * b07 - a10 * b09 - a12 * b06 ) * det;
        out[ 13 ] = ( a00 * b09 - a01 * b07 + a02 * b06 ) * det;
        out[ 14 ] = ( a31 * b01 - a30 * b03 - a32 * b00 ) * det;
        out[ 15 ] = ( a20 * b03 - a21 * b01 + a22 * b00 ) * det;

        return true;

    },

    translate( out, x, y, z ) {

        out[ 12 ] = out[ 0 ] * x + out[ 4 ] * y + out[ 8 ] * z + out[ 12 ];
        out[ 13 ] = out[ 1 ] * x + out[ 5 ] * y + out[ 9 ] * z + out[ 13 ];
        out[ 14 ] = out[ 2 ] * x + out[ 6 ] * y + out[ 10 ] * z + out[ 14 ];
        out[ 15 ] = out[ 3 ] * x + out[ 7 ] * y + out[ 11 ] * z + out[ 15 ];

        return out;

    },

    lookAt( out, eye, target, up ) {

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
        const eyex = eye[ 0 ];
        const eyey = eye[ 1 ];
        const eyez = eye[ 2 ];
        const upx = up[ 0 ];
        const upy = up[ 1 ];
        const upz = up[ 2 ];
        const centerx = target[ 0 ];
        const centery = target[ 1 ];
        const centerz = target[ 2 ];
        if ( Math.abs( eyex - centerx ) < 0.000001 &&
            Math.abs( eyey - centery ) < 0.000001 &&
            Math.abs( eyez - centerz ) < 0.000001 )
            return this.identity( out );

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
        out[ 0 ] = x0;
        out[ 1 ] = y0;
        out[ 2 ] = z0;
        out[ 3 ] = 0;
        out[ 4 ] = x1;
        out[ 5 ] = y1;
        out[ 6 ] = z1;
        out[ 7 ] = 0;
        out[ 8 ] = x2;
        out[ 9 ] = y2;
        out[ 10 ] = z2;
        out[ 11 ] = 0;
        out[ 12 ] = - ( x0 * eyex + x1 * eyey + x2 * eyez );
        out[ 13 ] = - ( y0 * eyex + y1 * eyey + y2 * eyez );
        out[ 14 ] = - ( z0 * eyex + z1 * eyey + z2 * eyez );
        out[ 15 ] = 1;

        return out;

    },

    equals( a, b ) {

        const a0 = a[ 0 ];
        const a1 = a[ 1 ];
        const a2 = a[ 2 ];
        const a3 = a[ 3 ];
        const a4 = a[ 4 ];
        const a5 = a[ 5 ];
        const a6 = a[ 6 ];
        const a7 = a[ 7 ];
        const a8 = a[ 8 ];
        const a9 = a[ 9 ];
        const a10 = a[ 10 ];
        const a11 = a[ 11 ];
        const a12 = a[ 12 ];
        const a13 = a[ 13 ];
        const a14 = a[ 14 ];
        const a15 = a[ 15 ];
        const b0 = b[ 0 ];
        const b1 = b[ 1 ];
        const b2 = b[ 2 ];
        const b3 = b[ 3 ];
        const b4 = b[ 4 ];
        const b5 = b[ 5 ];
        const b6 = b[ 6 ];
        const b7 = b[ 7 ];
        const b8 = b[ 8 ];
        const b9 = b[ 9 ];
        const b10 = b[ 10 ];
        const b11 = b[ 11 ];
        const b12 = b[ 12 ];
        const b13 = b[ 13 ];
        const b14 = b[ 14 ];
        const b15 = b[ 15 ];

        return ( Math.abs( a0 - b0 ) <= EPS * Math.max( 1.0, Math.abs( a0 ), Math.abs( b0 ) ) &&
          Math.abs( a1 - b1 ) <= EPS * Math.max( 1.0, Math.abs( a1 ), Math.abs( b1 ) ) &&
          Math.abs( a2 - b2 ) <= EPS * Math.max( 1.0, Math.abs( a2 ), Math.abs( b2 ) ) &&
          Math.abs( a3 - b3 ) <= EPS * Math.max( 1.0, Math.abs( a3 ), Math.abs( b3 ) ) &&
          Math.abs( a4 - b4 ) <= EPS * Math.max( 1.0, Math.abs( a4 ), Math.abs( b4 ) ) &&
          Math.abs( a5 - b5 ) <= EPS * Math.max( 1.0, Math.abs( a5 ), Math.abs( b5 ) ) &&
          Math.abs( a6 - b6 ) <= EPS * Math.max( 1.0, Math.abs( a6 ), Math.abs( b6 ) ) &&
          Math.abs( a7 - b7 ) <= EPS * Math.max( 1.0, Math.abs( a7 ), Math.abs( b7 ) ) &&
          Math.abs( a8 - b8 ) <= EPS * Math.max( 1.0, Math.abs( a8 ), Math.abs( b8 ) ) &&
          Math.abs( a9 - b9 ) <= EPS * Math.max( 1.0, Math.abs( a9 ), Math.abs( b9 ) ) &&
          Math.abs( a10 - b10 ) <= EPS * Math.max( 1.0, Math.abs( a10 ), Math.abs( b10 ) ) &&
          Math.abs( a11 - b11 ) <= EPS * Math.max( 1.0, Math.abs( a11 ), Math.abs( b11 ) ) &&
          Math.abs( a12 - b12 ) <= EPS * Math.max( 1.0, Math.abs( a12 ), Math.abs( b12 ) ) &&
          Math.abs( a13 - b13 ) <= EPS * Math.max( 1.0, Math.abs( a13 ), Math.abs( b13 ) ) &&
          Math.abs( a14 - b14 ) <= EPS * Math.max( 1.0, Math.abs( a14 ), Math.abs( b14 ) ) &&
          Math.abs( a15 - b15 ) <= EPS * Math.max( 1.0, Math.abs( a15 ), Math.abs( b15 ) ) );

    },

    clone( a ) {

        const out = new Float32Array( 16 );
        out[ 0 ] = a[ 0 ];
        out[ 1 ] = a[ 1 ];
        out[ 2 ] = a[ 2 ];
        out[ 3 ] = a[ 3 ];
        out[ 4 ] = a[ 4 ];
        out[ 5 ] = a[ 5 ];
        out[ 6 ] = a[ 6 ];
        out[ 7 ] = a[ 7 ];
        out[ 8 ] = a[ 8 ];
        out[ 9 ] = a[ 9 ];
        out[ 10 ] = a[ 10 ];
        out[ 11 ] = a[ 11 ];
        out[ 12 ] = a[ 12 ];
        out[ 13 ] = a[ 13 ];
        out[ 14 ] = a[ 14 ];
        out[ 15 ] = a[ 15 ];
        return out;

    },

} );

export { Matrix4 };
