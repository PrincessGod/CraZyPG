    #ifdef HAS_AOTEXTURE

        float ambientOcclusion = ( texture( u_aoTexture, v_uv2 ).r - 1.0 ) * u_aoTextureIntensity + 1.0;
        reflectedLight.indirectDiffuse *= ambientOcclusion;

        #if defined( HAS_ENVTEXTURE ) && defined( PHYSICAL )

            float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

            reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );

        #endif

    #endif
