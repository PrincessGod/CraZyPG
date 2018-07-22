    float roughnessFactor = u_roughness;

    #ifdef HAS_ROUGHNESSTEXTURE

        vec4 texelRoughness = texture2D( u_roughnessTexture, v_uv );
        roughnessFactor *= texelRoughness.g;

    #endif
