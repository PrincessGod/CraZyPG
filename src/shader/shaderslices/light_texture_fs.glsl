    #ifdef HAS_LIGHTTEXTURE

        reflectedLight.indirectDiffuse += texture( u_lightTexture, v_uv2 ).xyz * u_lightTextureIntensity;

    #endif
