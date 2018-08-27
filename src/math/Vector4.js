import { PMath } from './Math';

export class Vector4 {

    constructor( x, y, z, w ) {

        this._raw = new Float32Array( 4 );
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;

    }

    get raw() {

        return this._raw;

    }

    get x() {

        return this.raw[ 0 ];

    }

    set x( v ) {

        this.raw[ 0 ] = v;

    }

    get y() {

        return this.raw[ 1 ];

    }

    set y( v ) {

        this.raw[ 1 ] = v;

    }

    get z() {

        return this.raw[ 2 ];

    }

    set z( v ) {

        this.raw[ 2 ] = v;

    }

    get w() {

        return this.raw[ 3 ];

    }

    set w( v ) {

        this.raw[ 3 ] = v;

    }

    static set( v, x, y, z, w ) {

        v.x = x;
        v.y = y;
        v.z = z;
        v.w = w;

        return v;

    }

    set( x, y, z, w ) {

        return Vector4.set( this, x, y, z, w );

    }

    static clone( v ) {

        return new Vector4( v.x, v.y, v.z, v.w );

    }

    clone() {

        return Vector4.clone( this );

    }

    static copy( out, v ) {

        return Vector4.set( out, v.raw[ 0 ], v.raw[ 1 ], v.raw[ 2 ], v.raw[ 3 ] );

    }

    copy( v ) {

        return Vector4.copy( this, v );

    }

    static equals( a, b ) {

        return ( PMath.floatEquals( a.x, b.x ) &&
                 PMath.floatEquals( a.y, b.y ) &&
                 PMath.floatEquals( a.z, b.z ) &&
                 PMath.floatEquals( a.z, b.z ) );

    }

    equals( v ) {

        return Vector4.equals( this, v );

    }

    static lerp( out, a, b, t ) {

        const ax = a.raw[ 0 ];
        const ay = a.raw[ 1 ];
        const az = a.raw[ 2 ];
        const aw = a.raw[ 3 ];
        out.raw[ 0 ] = ax + t * ( b.raw[ 0 ] - ax );
        out.raw[ 1 ] = ay + t * ( b.raw[ 1 ] - ay );
        out.raw[ 2 ] = az + t * ( b.raw[ 2 ] - az );
        out.raw[ 3 ] = aw + t * ( b.raw[ 3 ] - aw );

        return out;

    }

    lerp( a, b, t ) {

        return Vector4.lerp( this, a, b, t );

    }

}
