    #ifdef HAS_FOG

        #ifdef FOG_EXP2

            float fogFactor = whiteCompliment( exp2( - u_fogDensity * u_fogDensity * v_fogDepth * v_fogDepth * LOG2 ) );

        #else

            float fogFactor = smoothstep( u_fogNear, u_fogFar, v_fogDepth );

        #endif

        finalColor.rgb = mix( finalColor.rgb, vec3(1.0, 0.0, 0.0), fogFactor );

    #endif
