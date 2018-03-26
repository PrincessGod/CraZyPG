function Vector2( x, y ) {

    this.raw = [];
    this.x = x || 0;
    this.y = y || 0;

}

Object.defineProperties( Vector2.prototype, {

    x: {
        get() {

            return this.raw[ 0 ];

        },

        set( v ) {

            this.raw[ 0 ] = v;

        },
    },

    y: {
        get() {

            return this.raw[ 1 ];

        },

        set( v ) {

            this.raw[ 1 ] = v;

        },
    },

    width: {

        get() {

            return this.raw[ 0 ];

        },

        set( v ) {

            this.raw[ 0 ] = v;

        },

    },

    height: {

        get() {

            return this.raw[ 1 ];

        },

        set( v ) {

            this.raw[ 1 ] = v;

        },

    },

} );

Object.assign( Vector2.prototype, {

    set( x, y ) {

        this.x = x;
        this.y = y;
        return this;

    },

    setX( x ) {

        this.x = x;
        return this;

    },

    setY( y ) {

        this.y = y;
        return this;

    },

    clone() {

        return new Vector2( this.x, this.y );

    },

    copy( v ) {

        this.x = v.x;
        this.y = v.y;

        return this;

    },

    add( v ) {

        this.x += v.x;
        this.y += v.y;

        return this;

    },

    sub( v ) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    },

    subVectors( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;

    },

    clamp( min, max ) {

        this.x = Math.max( min.x, Math.min( max.x, this.x ) );
        this.y = Math.min( min.y, Math.min( max.y, this.y ) );

        return this;

    },

} );

export { Vector2 };
