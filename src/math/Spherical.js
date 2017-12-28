const ESP = 0.000001;

class Spherical {

    constructor( radius, phi, theta ) {

        this.radius = ( radius !== undefined ) ? radius : 1.0;
        this.phi = ( phi !== undefined ) ? phi : 0;
        this.theta = ( theta !== undefined ) ? theta : 0;

    }

    set( radius, phi, theta ) {

        this.radius = radius;
        this.phi = phi;
        this.theta = theta;

        return this;

    }

    clone() {

        return new Spherical().copy( this );

    }

    copy( other ) {

        this.radius = other.radius;
        this.phi = other.phi;
        this.theta = other.theta;

        return this;

    }

    makeSafe() {

        this.phi = Math.max( ESP, Math.min( Math.PI - ESP, this.phi ) );
        return this;

    }

    setFromVecor3( vec3 ) {

        this.radius = vec3.length();
        if ( this.radius === 0 ) {

            this.theta = 0;
            this.phi = 0;

        } else {

            this.theta = Math.atan2( vec3.x, vec3.z );
            this.phi = Math.acos( Math.clamp( vec3.y / this.radius, - 1, 1 ) );

        }

        return this;

    }

}

export { Spherical };
