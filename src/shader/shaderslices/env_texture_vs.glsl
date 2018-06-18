    #ifdef HAS_ENVTEXTURE

        #if defined( HAS_BUMPTEXTURE ) || defined( HAS_NORMALTEXTURE ) || defined( PHONG )

            v_worldpos = worldpos.xyz;

        #else

            vec3 cameraToPos = normalize( worldpos.xyz - u_camPos );

            #ifdef ENV_TEXTURE_MODE_REFLECTION

                v_reflect = reflect( cameraToPos, normal );

            #else

                v_reflect = reflect( cameraToPos, normal, u_refractionRatio );

            #endif

        #endif

    #endif
