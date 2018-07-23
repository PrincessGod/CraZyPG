    float metalnessFactor = u_metalness;

    #ifdef HAS_METALNESSTEXTURE

        vec4 texelMetalness = texture( u_metalnessTexture, v_uv );
        metalnessFactor *= texelMetalness.b;

    #endif
