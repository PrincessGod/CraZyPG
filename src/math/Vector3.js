class Vector3 {

    constructor( x, y, z ) {

        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;

    }

    magnitude( v ) {

        // Only get the magnitude of this vector
        if ( v === undefined )
            return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ) );

        // Get magnitude based on another vector
        const x = v.x - this.x;
        const y = v.y - this.y;
        const z = v.y - this.z;

        return Math.sqrt( ( x * x ) + ( y * y ) + ( z * z ) );

    }

    normalize() {

        const mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;

    }

    set( x, y, z ) {

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    }

    multiScalar( v ) {

        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;

    }

    getArray() {

        return [ this.x, this.y, this.z ];

    }

    getFloatArray() {

        return new Float32Array( [ this.x, this.y, this.z ] );

    }

    clone() {

        return new Vector3( this.x, this.y, this.z );

    }

}

export { Vector3 };
