import { PMath } from './Math';

export class Matrix3 {

    constructor( ...values ) {

        Matrix3.identity( this );
        if ( values.length ) this.set( ...values );

    }

    get raw() {

        return this._raw;

    }

    static get cache() {

        if ( ! Matrix3._cache )
            Matrix3._cache = new Matrix3();

        return Matrix3._cache;

    }

    static set( out, ...values ) {

        for ( let i = 0; i < 9; i ++ )
            out.raw[ i ] = values[ i ];

        return out;

    }

    set( ...values ) {

        return Matrix3.set( this, ...values );

    }

    static setFromMatrix4( out, m ) {

        out.raw[ 0 ] = m.raw[ 0 ];
        out.raw[ 1 ] = m.raw[ 1 ];
        out.raw[ 2 ] = m.raw[ 2 ];
        out.raw[ 3 ] = m.raw[ 4 ];
        out.raw[ 4 ] = m.raw[ 5 ];
        out.raw[ 5 ] = m.raw[ 6 ];
        out.raw[ 6 ] = m.raw[ 8 ];
        out.raw[ 7 ] = m.raw[ 9 ];
        out.raw[ 8 ] = m.raw[ 10 ];

        return out;

    }

    setFromMatrix4( m ) {

        return Matrix3.setFromMatrix4( this, m );

    }

    static identity( m ) {

        m._raw = new Float32Array( 9 );
        m._raw[ 0 ] = 1;
        m._raw[ 4 ] = 1;
        m._raw[ 8 ] = 1;

        return m;

    }

    identity() {

        return Matrix3.identity( this );

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

        return ( PMath.floatEquals( a0, b0 ) &&
                 PMath.floatEquals( a1, b1 ) &&
                 PMath.floatEquals( a2, b2 ) &&
                 PMath.floatEquals( a3, b3 ) &&
                 PMath.floatEquals( a4, b4 ) &&
                 PMath.floatEquals( a5, b5 ) &&
                 PMath.floatEquals( a6, b6 ) &&
                 PMath.floatEquals( a7, b7 ) &&
                 PMath.floatEquals( a8, b8 ) );

    }

    equals( m ) {

        return Matrix3.equals( this, m );

    }

    static clone( m ) {

        var result = new Matrix3();
        return result.copy( m );

    }

    clone() {

        return Matrix3.clone( this );

    }

    static copy( out, m ) {

        for ( let i = 0; i < 16; i ++ )
            out.raw[ i ] = m.raw[ i ];

        return out;

    }

    copy( m ) {

        return Matrix3.copy( this, m );

    }

}
