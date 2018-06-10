    float specularStrength;

    #ifdef HAS_SPECULARTEXTURE

        specularStrength = texture( u_specularTexture, v_uv );

    #else

        specularStrength = 1.0;

    #endif
