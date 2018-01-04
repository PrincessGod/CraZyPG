const EPS = 0.000001;

function Matrix3() {

    this.raw = Matrix3.identity();

}

Object.assign( Matrix3, {

    identity() {

        const a = new Float32Array( 9 );
        a[ 0 ] = 1;
        a[ 4 ] = 1;
        a[ 8 ] = 1;

        return a;

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

        const b0 = b[ 0 ];
        const b1 = b[ 1 ];
        const b2 = b[ 2 ];
        const b3 = b[ 3 ];
        const b4 = b[ 4 ];
        const b5 = b[ 5 ];
        const b6 = b[ 6 ];
        const b7 = b[ 7 ];
        const b8 = b[ 8 ];

        return ( Math.abs( a0 - b0 ) <= EPS * Math.max( 1.0, Math.abs( a0 ), Math.abs( b0 ) ) &&
          Math.abs( a1 - b1 ) <= EPS * Math.max( 1.0, Math.abs( a1 ), Math.abs( b1 ) ) &&
          Math.abs( a2 - b2 ) <= EPS * Math.max( 1.0, Math.abs( a2 ), Math.abs( b2 ) ) &&
          Math.abs( a3 - b3 ) <= EPS * Math.max( 1.0, Math.abs( a3 ), Math.abs( b3 ) ) &&
          Math.abs( a4 - b4 ) <= EPS * Math.max( 1.0, Math.abs( a4 ), Math.abs( b4 ) ) &&
          Math.abs( a5 - b5 ) <= EPS * Math.max( 1.0, Math.abs( a5 ), Math.abs( b5 ) ) &&
          Math.abs( a6 - b6 ) <= EPS * Math.max( 1.0, Math.abs( a6 ), Math.abs( b6 ) ) &&
          Math.abs( a7 - b7 ) <= EPS * Math.max( 1.0, Math.abs( a7 ), Math.abs( b7 ) ) &&
          Math.abs( a8 - b8 ) <= EPS * Math.max( 1.0, Math.abs( a8 ), Math.abs( b8 ) ) );

    },

    clone( a ) {

        const out = new Float32Array( 9 );
        out[ 0 ] = a[ 0 ];
        out[ 1 ] = a[ 1 ];
        out[ 2 ] = a[ 2 ];
        out[ 3 ] = a[ 3 ];
        out[ 4 ] = a[ 4 ];
        out[ 5 ] = a[ 5 ];
        out[ 6 ] = a[ 6 ];
        out[ 7 ] = a[ 7 ];
        out[ 8 ] = a[ 8 ];

        return out;

    },

} );

export { Matrix3 };
