    #if defined( RE_IndirectDiffuse )

        #ifdef HAS_LIGHTTEXTURE

            vec3 lightMapIrradiance = texture( u_lightTexture, v_uv2 ).xyz * u_lightTextureIntensity;

            #ifndef PHYSICALLY_CORRECT_LIGHTS

                lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage

            #endif

            irradiance += lightMapIrradiance;

        #endif

        // #if defined( HAS_ENVTEXTURE ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )

        //     irradiance += getLightProbeIndirectIrradiance( /*lightProbe,*/ geometry, maxMipLevel );

        // #endif

    #endif

    #if defined( HAS_ENVTEXTURE ) && defined( RE_IndirectSpecular )

        radiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry, Material_BlinnShininessExponent( material ), u_maxMipLevel );

        clearCoatRadiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry, Material_ClearCoat_BlinnShininessExponent( material ), u_maxMipLevel );

    #endif
