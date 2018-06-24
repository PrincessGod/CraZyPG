    #ifdef HAS_COLOR

        diffuseColor.rgb *= v_color.rgb;

        #ifdef HAS_COLORALPHA

            diffuseColor.a *= v_color.a;

        #endif

    #endif
