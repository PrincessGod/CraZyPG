#ifdef HAS_FOG

    uniform vec3 u_fogColor;
    in float v_fogDepth;

    #ifdef FOG_EXP2

        uniform float u_fogDensity;

    #else

        uniform float u_fogNear;
        uniform float u_fogFar;

    #endif

#endif
