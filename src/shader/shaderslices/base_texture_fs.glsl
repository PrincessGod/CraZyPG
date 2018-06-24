    #ifdef HAS_BASETEXTURE

        vec4 baseColor = texture( u_baseTexture, v_uv );
        // to linear space
        diffuseColor *= baseColor;

    #endif
