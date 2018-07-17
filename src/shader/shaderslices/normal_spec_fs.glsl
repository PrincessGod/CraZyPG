#if defined( HAS_NORMAL )

    #if defined( FLAT_SHADE )

        flat in vec3 v_normal;

    #else

        in vec3 v_normal;

    #endif

#endif
