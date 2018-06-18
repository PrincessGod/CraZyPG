    #ifdef HAS_ENVTEXTURE

        #if defined( HAS_BUMPTEXTURE ) || defined( HAS_NORMALTEXTURE ) || defined( PHONG )

            vec3 cameraToPos = normalize( v_worldpos - u_camPos );

            #ifdef ENV_TEXTURE_MODE_REFLECTION

                vec3 reflectVec = reflect( cameraToPos, v_normal );

            #else

                vec3 reflectVec = reflect( cameraToPos, v_normal, u_refractionRatio );

            #endif

        #else

            vec3 reflectVec = v_reflect;

        #endif

        #ifdef ENV_TEXTURE_TYPE_CUBE

            vec4 envColor = texture( u_envTexture, reflectVec );

        #else

            vec4 envColor = vec4( 0.0 );

        #endif

        // linear

        #ifdef ENV_TEXTURE_BLENDING_MULTIPLY

            outgoingLight = mix( outgoingLight, outgoingLight * envColor.rgb, specularStrength * u_reflectivity );

        #elif defined( ENV_TEXTURE_BLENDING_MIX )

            outgoingLight = mix( outgoingLight, envColor.rgb, specularStrength * u_reflectivity );

        #elif defined( ENV_TEXTURE_BLENDING_ADD )

            outgoingLight += envColor.rgb * specularStrength * u_reflectivity;

        #endif

    #endif
