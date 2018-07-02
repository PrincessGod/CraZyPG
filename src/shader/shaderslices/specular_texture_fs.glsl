    float specularStrength;

    #ifdef HAS_SPECULARTEXTURE

        specularStrength = texture( u_specularTexture, v_uv ).r;

    #else

        specularStrength = 1.0;

    #endif
