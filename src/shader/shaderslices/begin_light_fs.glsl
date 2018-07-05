    /**
    * This is a template that can be used to light a material, it uses pluggable
    * RenderEquations (RE)for specific lighting scenarios.
    *
    * Instructions for use:
    * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
    * - If you have defined an RE_IndirectSpecular, you need to also provide a Material_LightProbeLOD. <---- ???
    * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
    *
    * TODO:
    * - Add area light support.
    * - Add sphere light support.
    * - Add diffuse light probe (irradiance cubemap) support.
    */

    GeometricContext geometry;

    geometry.position = v_worldpos.xyz;
    geometry.normal = normal;
    geometry.viewDir = normalize( u_camPos - v_worldpos.xyz );

    IncidentLight directLight;

    #if defined( POINT_LIGHT_NUM ) && defined( RE_Direct )

        PointLight pointLight;

        for ( int i = 0; i < POINT_LIGHT_NUM; i ++ ) {

            pointLight = u_pointLights[ i ];

            getPointDirectLightIrradiance( pointLight, geometry, directLight );

            #ifdef USE_SHADOWMAP
            directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
            #endif

            RE_Direct( directLight, geometry, material, reflectedLight );

        }

    #endif

    #if defined( SPOT_LIGHT_NUM ) && defined( RE_Direct )

        SpotLight spotLight;

        for ( int i = 0; i < SPOT_LIGHT_NUM; i ++ ) {

            spotLight = u_spotLights[ i ];

            getSpotDirectLightIrradiance( spotLight, geometry, directLight );

            #ifdef USE_SHADOWMAP
            directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
            #endif

            RE_Direct( directLight, geometry, material, reflectedLight );

        }

    #endif

    #if defined( DIR_LIGHT_NUM ) && defined( RE_Direct )

        DirectionalLight directionalLight;

        for ( int i = 0; i < DIR_LIGHT_NUM; i ++ ) {

            directionalLight = u_directionalLights[ i ];

            getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

            #ifdef USE_SHADOWMAP
            directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
            #endif

            RE_Direct( directLight, geometry, material, reflectedLight );

        }

    #endif

    #if defined( RE_IndirectDiffuse )

        vec3 irradiance = getAmbientLightIrradiance( u_ambientLightColor );

    #endif
