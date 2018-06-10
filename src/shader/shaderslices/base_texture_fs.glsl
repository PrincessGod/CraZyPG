    vec4 baseColor = u_baseColor;
    #ifdef HAS_BASETEXTURE

        baseColor *= texture( u_baseTexture, v_uv );

    #endif
