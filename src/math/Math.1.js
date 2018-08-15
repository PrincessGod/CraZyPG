const RADIAN_PER_DEGREE = Math.PI / 180;
const DEGREE_PER_RADIAN = 180 / Math.PI;
const EPS = 0.000001;

const PMath = {

    RADIAN_PER_DEGREE,

    degree2Radian( degree ) {

        return degree * RADIAN_PER_DEGREE;

    },

    radian2Degree( radian ) {

        return radian * DEGREE_PER_RADIAN;

    },

    clamp( value, min, max ) {

        return Math.max( min, Math.min( max, value ) );

    },

    map( value, min, max, tarMin, tarMax ) {

        return tarMin + ( tarMax - tarMin ) * ( value - min ) / ( max - min );

    },

    arrayEquals( a, b ) {

        if ( a.length !== b.length ) return false;

        const length = a.length;
        for ( let i = 0; i < length; i ++ )
            if ( Math.abs( a[ i ] - b[ i ] ) > EPS * Math.max( 1.0, Math.abs( a[ i ] ), Math.abs( b[ i ] ) ) )
                return false;

        return true;

    },

    arrayClone( a ) {

        const Type = a.constructor;
        const length = a.length;
        const out = new Type( length );
        for ( let i = 0; i < length; i ++ )
            out[ i ] = a[ i ];

        return out;

    },

};

export { PMath };
