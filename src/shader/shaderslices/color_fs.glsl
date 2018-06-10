    #ifdef HAS_COLOR

        baseColor.rgb *= v_color.rgb;

        #ifdef HAS_COLORALPHA

            baseColor.a *= v_color.a;

        #endif

    #endif
