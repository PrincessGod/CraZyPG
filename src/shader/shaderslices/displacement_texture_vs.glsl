    #ifdef HAS_DISPLACEMENTTEXTURE

        // FIX: uv in corners sampler same value
        position.xyz += normalize( normal ) * ( texture( u_displacementTexture, a_uv ).r * u_displacementScale + u_displacementBias );

    #endif
