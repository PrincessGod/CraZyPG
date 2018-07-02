    #ifdef HAS_EMISSIVETEXTURE

        vec4 emissiveColor = texture( u_emissiveTexture, v_uv );
        // convert to linear
        totalEmissiveRadiance *= emissiveColor.rgb;

    #endif
