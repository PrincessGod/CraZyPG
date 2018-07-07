    #ifdef HAS_ENVTEXTURE

        vec3 cameraToPos = normalize( v_worldpos.xyz - u_camPos );

        #ifdef ENVTEXTURE_REFLECTION

            vec3 reflectVec = reflect( cameraToPos, v_normal );

        #else

            vec3 reflectVec = refract( cameraToPos, v_normal, u_refractionRatio );

        #endif

        #ifdef ENVTEXTURE_CUBE

            vec4 envColor = texture( u_envTexture, reflectVec );

        #else

            vec4 envColor = vec4( 0.0 );

        #endif

        // linear

        #ifdef ENVTEXTURE_MULTIPLY

            outgoingLight = mix( outgoingLight, outgoingLight * envColor.rgb, specularStrength * u_reflectivity );

        #elif defined( ENVTEXTURE_MIX )

            outgoingLight = mix( outgoingLight, envColor.rgb, specularStrength * u_reflectivity );

        #elif defined( ENVTEXTURE_ADD )

            outgoingLight += envColor.rgb * specularStrength * u_reflectivity;

        #endif

    #endif
