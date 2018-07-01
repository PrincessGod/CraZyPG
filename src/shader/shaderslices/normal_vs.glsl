    #if defined( HAS_NORMAL ) && ! defined( FLAT_SHADE )

        normal = normalize( u_normMat * normal );
        v_normal = normal;

    #endif
