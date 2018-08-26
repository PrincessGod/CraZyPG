const EPS = 0.000001;
const RADIAN_PER_DEGREE = Math.PI / 180;
const DEGREE_PER_RADIAN = 180 / Math.PI;

export class PMath {

    static get RADIAN_PER_DEGREE() {

        return RADIAN_PER_DEGREE;

    }

    static get DEGREE_PER_RADIAN() {

        return DEGREE_PER_RADIAN;

    }

    static get EPS() {

        return EPS;

    }

    static floatEquals( a, b ) {

        return Math.abs( a - b ) <= PMath.EPS * Math.max( 1.0, Math.abs( a ), Math.abs( b ) );

    }

    static degree2Radian( degree ) {

        return degree * RADIAN_PER_DEGREE;

    }

    static radian2Degree( radian ) {

        return radian * DEGREE_PER_RADIAN;

    }

    static clamp( value, min, max ) {

        return Math.max( min, Math.min( max, value ) );

    }

    static map( value, min, max, tarMin, tarMax ) {

        return tarMin + ( tarMax - tarMin ) * ( value - min ) / ( max - min );

    }

    static arrayEquals( a, b ) {

        if ( a.length !== b.length ) return false;

        const length = a.length;
        for ( let i = 0; i < length; i ++ )
            if ( ! PMath.floatEquals( a[ i ], b[ i ] ) )
                return false;

        return true;

    }

    static arrayClone( a ) {

        const Type   = a.constructor;
        const length = a.length;
        const result = new Type( length );

        for ( let i = 0; i < length; i ++ )
            result[ i ] = a[ i ];

        return result;

    }

}
