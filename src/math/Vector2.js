import { PMath } from './Math';

export class Vector2 {

    constructor( x, y ) {

        this._raw = new Float32Array( 2 );
        this.x = x || 0;
        this.y = y || 0;

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

    static get cache() {

        if ( ! Vector2._cache )
            Vector2._cache = new Vector2();

        return Vector2._cache;

    }

    static set( v, x, y ) {

        v.x = x;
        v.y = y;

        return v;

    }

    set( x, y ) {

        return Vector2.set( this, x, y );

    }

    static equals( v1, v2 ) {

        const ax = v1.x;
        const ay = v1.y;

        const bx = v2.x;
        const by = v2.y;

        return ( Math.abs( ax - bx ) <= PMath.EPS * Math.max( 1.0, Math.abs( ax ), Math.abs( bx ) ) &&
                Math.abs( ay - by ) <= PMath.EPS * Math.max( 1.0, Math.abs( ay ), Math.abs( by ) ) );


    }

    equals( v ) {

        return Vector2.equals( this, v );

    }

    static clone( v ) {

        return new Vector2( v.x, v.y );

    }

    clone() {

        return Vector2.clone( this );

    }

    static copy( out, v ) {

        return Vector2.set( out, v.x, v.y );

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
