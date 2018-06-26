    vec3 diffuse = vec3( 1.0 );

    GeometricContext geometry;
    geometry.position = worldpos.xyz;
    geometry.normal = normal;
    geometry.viewDir = normalize( u_viewMat[3].xyz - worldpos.xyz );

    v_LightFront = vec3( 0.0 );

    #ifdef DOUBLE_SIDE

        v_LightBack = vec3( 0.0 );

    #endif

    IncidentLight directLight;
    float dotNL;
    vec3 directLightColor_Diffuse;

    #if defined( DIR_LIGHT_NUM ) && DIR_LIGHT_NUM > 0

        for( int i = 0; i < DIR_LIGHT_NUM; i ++ ) {

            getDirectionalDirectLightIrradiance( u_directionalLights[ i ], geometry, directLight );

            dotNL = dot( geometry.normal, directLight.direction );
            directLightColor_Diffuse = PI * directLight.color;

            v_LightFront += saturate( dotNL ) * directLightColor_Diffuse;

            #ifdef DOUBLE_SIDE

                v_LightBack += saturate( -dotNL ) * directLightColor_Diffuse;

            #endif

        }

    #endif

    #if defined( POINT_LIGHT_NUM ) && POINT_LIGHT_NUM > 0

        for( int i = 0; i < POINT_LIGHT_NUM; i++ ) {

            getPointDirectLightIrradiance( u_pointLights[ i ], geometry, directLight );

            dotNL = dot( geometry.normal, directLight.direction );
            directLightColor_Diffuse = PI * directLight.color;

            v_LightFront += saturate( dotNL ) * directLightColor_Diffuse;

            #ifdef DOUBLE_SIDE

                v_LightFront += saturate( -dotNL ) * directLightColor_Diffuse;

            #endif

        }

    #endif

    #if defined( SPOT_LIGHT_NUM ) && SPOT_LIGHT_NUM > 0

        for( int i = 0; i < SPOT_LIGHT_NUM; i ++ ) {

            getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );

            dotNL = dot( geometry.normal, directLight.direction );
            directLightColor_Diffuse = PI * directLight.color;

            v_LightFront += saturate( dotNL ) * directLightColor_Diffuse;

            #ifdef DOUBLE_SIDE

                v_LightBack += saturate( -dotNL ) * directLightColor_Diffuse;

            #endif

        }

    #endif
