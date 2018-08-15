import { PMath } from './Math';

export class Vector2 {

    constructor( x, y ) {

        this.raw = new Float32Array( 2 );
        this.x = x || 0;
        this.y = y || 0;

    }

    get x() {

        return this.raw[ 0 ];

    }

    set x( v ) {

        this.raw[ 0 ] = v;

    }

    get width() {

        return this.raw[ 0 ];

    }

    set width( v ) {

        this.raw[ 0 ] = v;

    }

    get y() {

        return this.raw[ 1 ];

    }

    set y( v ) {

        this.raw[ 1 ] = v;

    }

    get height() {

        return this.raw[ 1 ];

    }

    set height( v ) {

        this.raw[ 1 ] = v;

    }

    static set( v, x, y ) {

        v.x = x;
        v.y = y;

        return v;

    }

    set( x, y ) {

        return Vector2.set( this, x, y );

    }

    static clone( v ) {

        return new Vector2( v.x, v.y );

    }

    clone() {

        return Vector2.clone( this );

    }

    static copy( out, v ) {

        out.x = v.x;
        out.y = v.y;

        return out;

    }

    copy( v ) {

        return Vector2.copy( this, v );

    }


    static add( out, v1, v2 ) {

        out.x = v1.x + v2.x;
        out.y = v1.y + v2.y;

        return out;

    }

    add( v ) {

        return Vector2.add( this, this, v );

    }


    static sub( out, v1, v2 ) {

        out.x = v1.x - v2.x;
        out.y = v1.y - v2.y;

        return out;

    }

    sub( v ) {

        return Vector2.sub( this, this, v );

    }

    static subVectors( out, v1, v2 ) {

        return Vector2.sub( out, v1, v2 );

    }

    subVectors( v1, v2 ) {

        return Vector2.subVectors( this, v1, v2 );

    }

    static clamp( out, v, min, max ) {

        out.x = PMath.clamp( v.x, min, max );
        out.y = PMath.clamp( v.y, min, max );

        return out;

    }

    clamp( min, max ) {

        return Vector2.clamp( this, this, min, max );

    }

}
