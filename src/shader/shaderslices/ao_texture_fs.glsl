    #ifdef HAS_AOTEXTURE

        float ambientOcclusion = ( texture( u_aoTexture, v_uv2 ).r - 1.0 ) * u_aoIntensity + 1.0;
        reflectedLight.indirectDiffuse *= ambientOcclusion;

    #endif
