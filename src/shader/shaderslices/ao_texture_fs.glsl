    #ifdef HAS_AO_TEXTURE

        float ambientOcclusion = texture( u_aoTexture, v_uv2 )
        reflectedLight.indirectDiffuse *= ambientOcclusion;

    #endif
