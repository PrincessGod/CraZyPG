    #ifdef HAS_ALPHATEXTURE

        diffuseColor.a *= texture( u_alphaTexture, v_uv );

    #endif
