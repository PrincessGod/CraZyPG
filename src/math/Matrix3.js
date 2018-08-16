import { PMath } from './Math';

export class Matrix3 {

    constructor() {

        Matrix3.identity( this );

    }

    get raw() {

        return this._raw;

    }

    static identity( m ) {

        m._raw = new Float32Array( 9 );
        m._raw[ 0 ] = 1;
        m._raw[ 4 ] = 1;
        m._raw[ 8 ] = 1;

        return m;

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

        const b0 = b.raw[ 0 ];
        const b1 = b.raw[ 1 ];
        const b2 = b.raw[ 2 ];
        const b3 = b.raw[ 3 ];
        const b4 = b.raw[ 4 ];
        const b5 = b.raw[ 5 ];
        const b6 = b.raw[ 6 ];
        const b7 = b.raw[ 7 ];
        const b8 = b.raw[ 8 ];

        return ( Math.abs( a0 - b0 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a0 ), Math.abs( b0 ) ) &&
              Math.abs( a1 - b1 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a1 ), Math.abs( b1 ) ) &&
              Math.abs( a2 - b2 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a2 ), Math.abs( b2 ) ) &&
              Math.abs( a3 - b3 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a3 ), Math.abs( b3 ) ) &&
              Math.abs( a4 - b4 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a4 ), Math.abs( b4 ) ) &&
              Math.abs( a5 - b5 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a5 ), Math.abs( b5 ) ) &&
              Math.abs( a6 - b6 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a6 ), Math.abs( b6 ) ) &&
              Math.abs( a7 - b7 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a7 ), Math.abs( b7 ) ) &&
              Math.abs( a8 - b8 ) <= PMath.EPS * Math.max( 1.0, Math.abs( a8 ), Math.abs( b8 ) ) );

    }

    equals( m ) {

        return Matrix3.equals( this, m );

    }

    static clone( m ) {

        const out = new Matrix3();
        out.raw[ 0 ] = m.raw[ 0 ];
        out.raw[ 1 ] = m.raw[ 1 ];
        out.raw[ 2 ] = m.raw[ 2 ];
        out.raw[ 3 ] = m.raw[ 3 ];
        out.raw[ 4 ] = m.raw[ 4 ];
        out.raw[ 5 ] = m.raw[ 5 ];
        out.raw[ 6 ] = m.raw[ 6 ];
        out.raw[ 7 ] = m.raw[ 7 ];
        out.raw[ 8 ] = m.raw[ 8 ];

        return out;

    }

    clone() {

        return Matrix3.clone( this );

    }

    static copy( out, m ) {

        out.raw[ 0 ] = m.raw[ 0 ];
        out.raw[ 1 ] = m.raw[ 1 ];
        out.raw[ 2 ] = m.raw[ 2 ];
        out.raw[ 3 ] = m.raw[ 3 ];
        out.raw[ 4 ] = m.raw[ 4 ];
        out.raw[ 5 ] = m.raw[ 5 ];
        out.raw[ 6 ] = m.raw[ 6 ];
        out.raw[ 7 ] = m.raw[ 7 ];
        out.raw[ 8 ] = m.raw[ 8 ];

        return out;

    }

    copy( m ) {

        return Matrix3.copy( this, m );

    }

}
