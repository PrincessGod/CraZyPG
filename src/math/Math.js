const RADIAN_PER_DEGREE = Math.PI / 180;

const PMath = {

    RADIAN_PER_DEGREE,

    degree2Radian( degree ) {

        return degree * RADIAN_PER_DEGREE;

    },

    clamp( value, min, max ) {

        return Math.max( min, Math.min( max, value ) );

    },

};

export { PMath };
