/* eslint no-multi-assign: 0, no-param-reassign: 0 */

// https://github.com/josephg/noisejs

function Grad( x, y, z ) {

    this.x = x;
    this.y = y;
    this.z = z;

}

Object.assign( Grad.prototype, {

    dot2( x, y ) {

        return this.x * x + this.y * y;

    },

    dot3( x, y, z ) {

        return this.x * x + this.y * y + this.z * z;

    },

} );

const grad3 = [
    new Grad( 1, 1, 0 ), new Grad( - 1, 1, 0 ), new Grad( 1, - 1, 0 ), new Grad( - 1, - 1, 0 ),
    new Grad( 1, 0, 1 ), new Grad( - 1, 0, 1 ), new Grad( 1, 0, - 1 ), new Grad( - 1, 0, - 1 ),
    new Grad( 0, 1, 1 ), new Grad( 0, - 1, 1 ), new Grad( 0, 1, - 1 ), new Grad( 0, - 1, - 1 ),
];

const p = [ 151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180 ];

const perm = new Array( 512 );
const gradP = new Array( 512 );

const F2 = 0.5 * ( Math.sqrt( 3 ) - 1 );
const G2 = ( 3 - Math.sqrt( 3 ) ) / 6;

const F3 = 1 / 3;
const G3 = 1 / 6;

const Perlin = {};

function fade( t ) {

    return t * t * t * ( t * ( t * 6 - 15 ) + 10 );

}

function lerp( a, b, t ) {

    return ( 1 - t ) * a + t * b;

}

Object.assign( Perlin, {

    seed( seed ) {

        if ( seed > 0 && seed < 1 )
            seed *= 65536;

        let v;
        for ( let i = 0; i < 256; i ++ ) {

            if ( i & 1 )
                v = p[ i ] ^ ( seed & 255 );
            else
                v = p[ i ] ^ ( ( seed >> 8 ) & 255 );


            perm[ i ] = perm[ i + 256 ] = v;
            gradP[ i ] = gradP[ i + 256 ] = grad3[ v % 12 ];

        }

    },

    simplex2( xin, yin ) {

        let n0;
        let n1;
        let n2;

        const s = ( xin + yin ) * F2;
        let i = Math.floor( xin + s );
        let j = Math.floor( yin + s );
        const t = ( i + j ) * G2;
        const x0 = xin - i + t;
        const y0 = yin - j + t;

        let i1;
        let j1;
        if ( x0 > y0 ) {

            i1 = 1; j1 = 0;

        } else {

            i1 = 0; j1 = 1;

        }

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;

        i &= 255;
        j &= 255;
        const gi0 = gradP[ i + perm[ j ] ];
        const gi1 = gradP[ i + i1 + perm[ j + j1 ] ];
        const gi2 = gradP[ i + 1 + perm[ j + 1 ] ];

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if ( t0 < 0 )
            n0 = 0;
        else {

            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2( x0, y0 );

        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if ( t1 < 0 )
            n1 = 0;
        else {

            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2( x1, y1 );

        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if ( t2 < 0 )
            n2 = 0;
        else {

            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2( x2, y2 );

        }

        return 70 * ( n0 + n1 + n2 );

    },

    simplex3( xin, yin, zin ) {

        let n0;
        let n1;
        let n2;
        let n3;

        const s = ( xin + yin + zin ) * F3;
        let i = Math.floor( xin + s );
        let j = Math.floor( yin + s );
        let k = Math.floor( zin + s );

        const t = ( i + j + k ) * G3;
        const x0 = xin - i + t;
        const y0 = yin - j + t;
        const z0 = zin - k + t;

        let i1;
        let j1;
        let k1;
        let i2;
        let j2;
        let k2;
        if ( x0 >= y0 )
            if ( y0 >= z0 ) {

                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;

            } else if ( x0 >= z0 ) {

                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;

            } else {

                i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;

            }
        else if ( y0 < z0 ) {

            i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;

        } else if ( x0 < z0 ) {

            i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;

        } else {

            i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;

        }

        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;

        const x2 = x0 - i2 + 2 * G3;
        const y2 = y0 - j2 + 2 * G3;
        const z2 = z0 - k2 + 2 * G3;

        const x3 = x0 - 1 + 3 * G3;
        const y3 = y0 - 1 + 3 * G3;
        const z3 = z0 - 1 + 3 * G3;

        i &= 255;
        j &= 255;
        k &= 255;
        const gi0 = gradP[ i + perm[ j + perm[ k ] ] ];
        const gi1 = gradP[ i + i1 + perm[ j + j1 + perm[ k + k1 ] ] ];
        const gi2 = gradP[ i + i2 + perm[ j + j2 + perm[ k + k2 ] ] ];
        const gi3 = gradP[ i + 1 + perm[ j + 1 + perm[ k + 1 ] ] ];

        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if ( t0 < 0 )
            n0 = 0;
        else {

            t0 *= t0;
            n0 = t0 * t0 * gi0.dot3( x0, y0, z0 );

        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if ( t1 < 0 )
            n1 = 0;
        else {

            t1 *= t1;
            n1 = t1 * t1 * gi1.dot3( x1, y1, z1 );

        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if ( t2 < 0 )
            n2 = 0;
        else {

            t2 *= t2;
            n2 = t2 * t2 * gi2.dot3( x2, y2, z2 );

        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if ( t3 < 0 )
            n3 = 0;
        else {

            t3 *= t3;
            n3 = t3 * t3 * gi3.dot3( x3, y3, z3 );

        }

        return 32 * ( n0 + n1 + n2 + n3 );

    },

    perlin2( x, y ) {

        let X = Math.floor( x );
        let Y = Math.floor( y );

        x -= X; y -= Y;
        X &= 255; Y &= 255;

        const n00 = gradP[ X + perm[ Y ] ].dot2( x, y );
        const n01 = gradP[ X + perm[ Y + 1 ] ].dot2( x, y - 1 );
        const n10 = gradP[ X + 1 + perm[ Y ] ].dot2( x - 1, y );
        const n11 = gradP[ X + 1 + perm[ Y + 1 ] ].dot2( x - 1, y - 1 );

        const u = fade( x );

        return lerp(
            lerp( n00, n10, u ),
            lerp( n01, n11, u ),
            fade( y )
        );

    },

    perlin3( x, y, z ) {

        let X = Math.floor( x );
        let Y = Math.floor( y );
        let Z = Math.floor( z );

        x -= X; y -= Y; z -= Z;

        X &= 255; Y &= 255; Z &= 255;

        const n000 = gradP[ X + perm[ Y + perm[ Z ] ] ].dot3( x, y, z );
        const n001 = gradP[ X + perm[ Y + perm[ Z + 1 ] ] ].dot3( x, y, z - 1 );
        const n010 = gradP[ X + perm[ Y + 1 + perm[ Z ] ] ].dot3( x, y - 1, z );
        const n011 = gradP[ X + perm[ Y + 1 + perm[ Z + 1 ] ] ].dot3( x, y - 1, z - 1 );
        const n100 = gradP[ X + 1 + perm[ Y + perm[ Z ] ] ].dot3( x - 1, y, z );
        const n101 = gradP[ X + 1 + perm[ Y + perm[ Z + 1 ] ] ].dot3( x - 1, y, z - 1 );
        const n110 = gradP[ X + 1 + perm[ Y + 1 + perm[ Z ] ] ].dot3( x - 1, y - 1, z );
        const n111 = gradP[ X + 1 + perm[ Y + 1 + perm[ Z + 1 ] ] ].dot3( x - 1, y - 1, z - 1 );

        const u = fade( x );
        const v = fade( y );
        const w = fade( z );

        return lerp(
            lerp(
                lerp( n000, n100, u ),
                lerp( n001, n101, u ), w
            ),
            lerp(
                lerp( n010, n110, u ),
                lerp( n011, n111, u ), w
            ),
            v
        );

    },

} );

Perlin.seed( 0 );

export { Perlin };
