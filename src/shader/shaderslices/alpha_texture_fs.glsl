#ifdef HAS_ALPHATEXTURE

    baseColor.a *= texture( u_alphaTexture, v_uv );

#endif
