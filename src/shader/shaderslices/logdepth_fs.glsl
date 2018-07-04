    #ifdef LOGDEPTH

        gl_FragDepth = log2( v_fragDepth ) * u_logDepthBufFC * 0.5;

    #endif
