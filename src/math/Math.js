const RADIAN_PER_DEGREE = Math.PI / 180;

class PMath {

    static get radianPerDegree() {

        return RADIAN_PER_DEGREE;

    }

    static degree2Radian( degree ) {

        return degree * RADIAN_PER_DEGREE;

    }

    static clamp( value, min, max ) {

        return Math.max( min, Math.min( max, value ) );

    }

}

export { PMath };
