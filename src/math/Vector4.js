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

        const result = new Vector4();
        return result.copy( v );

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

}
