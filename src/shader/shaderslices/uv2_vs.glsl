    #if defined( HAS_LIGHTTEXTURE ) || defined( HAS_AOTEXTURE )

        #ifdef HAS_UV2

            v_uv2 = a_uv2;

        #elif defined( HAS_UV )

            v_uv2 = a_uv;

        #else

            v_uv2 = vec2( 0.0 );

        #endif

    #endif
