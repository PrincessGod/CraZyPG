    vec3 diffuse = vec3( 1.0 );

    GeometricContext geometry;
    geometry.position = v_worldpos.xyz;
    geometry.normal = normalize( v_normal );
    geometry.viewDir = normalize( u_viewMat[3].xyz - v_worldpos.xyz );

    vec3 lightFront = vec3( 0.0 );

    #ifdef DOUBLE_SIDE

        vec3 lightBack = vec3( 0.0 );

    #endif

    IncidentLight directLight;
    float dotNL;
    vec3 directLightColor_Diffuse;

    #if defined( DIR_LIGHT_NUM ) && DIR_LIGHT_NUM > 0

        for( int i = 0; i < DIR_LIGHT_NUM; i ++ ) {

            getDirectionalDirectLightIrradiance( u_directionalLights[ i ], geometry, directLight );

            dotNL = dot( geometry.normal, directLight.direction );
            directLightColor_Diffuse = PI * directLight.color;

            lightFront += saturate( dotNL ) * directLightColor_Diffuse;

            #ifdef DOUBLE_SIDE

                lightBack += saturate( -dotNL ) * directLightColor_Diffuse;

            #endif

        }

    #endif

    #if defined( POINT_LIGHT_NUM ) && POINT_LIGHT_NUM > 0

        for( int i = 0; i < POINT_LIGHT_NUM; i++ ) {

            getPointDirectLightIrradiance( u_pointLights[ i ], geometry, directLight );

            dotNL = dot( geometry.normal, directLight.direction );
            directLightColor_Diffuse = PI * directLight.color;

            lightFront += saturate( dotNL ) * directLightColor_Diffuse;

            #ifdef DOUBLE_SIDE

                lightBack += saturate( -dotNL ) * directLightColor_Diffuse;

            #endif

        }

    #endif

    #if defined( SPOT_LIGHT_NUM ) && SPOT_LIGHT_NUM > 0

        for( int i = 0; i < SPOT_LIGHT_NUM; i ++ ) {

            getSpotDirectLightIrradiance( u_spotLights[ i ], geometry, directLight );

            dotNL = dot( geometry.normal, directLight.direction );
            directLightColor_Diffuse = PI * directLight.color;

            lightFront += saturate( dotNL ) * directLightColor_Diffuse;

            #ifdef DOUBLE_SIDE

                lightBack += saturate( -dotNL ) * directLightColor_Diffuse;

            #endif

        }

    #endif
