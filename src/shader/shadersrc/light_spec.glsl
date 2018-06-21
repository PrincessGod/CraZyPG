uniform vec3 u_ambientLightColor;

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ){

    vec3 irradiance = ambientLightColor;

    #ifndef PHYSICALLY_CORRECT_LIGHTS

        irradiance *= PI;

    #endif

    return irradiance;

}

#if DIR_LIGHT_NUM > 0

    struct DirectionalLight {

        vec3 direction;
        vec3 color;

    }

    uniform DirectionalLight u_directionalLights[ DIR_LIGHT_NUM ];

    void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {

        directLight.color = directionalLight.color;
        directLight.direction = directionalLight.direction;
        directLight.visible = true;

    }

#endif

#if POINT_LIGHT_NUM > 0

    struct PointLight {

        vec3 position;
        vec3 color;
        float distance;
        float decay;

    }

    uniform PointLight u_pointLights[ POINT_LIGHT_NUM ];

    void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {

        vec3 l = pointLight.position - geometry.position;
        directLight.direction = normalize( l );

        float lightDistance = length( l );

        directLight.color = pointLight.color;
        directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
        directLight.color = ( directLight.color != vec3( 0.0 ) );

    }

#endif

#if NUM_SPOT_LIGHTS > 0

    struct SpotLight {

        vec3 position;
        vec3 direction;
        vec3 color;
        float distance;
        float coneCos;
        float penumbraCos;

    }

    uniform SpotLight u_spotLights[ NUM_SPOT_LIGHTS ];

    void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight ) {

        vec3 l = spotLight.position - geometry.position;
        directLight.direction = normalize( l );

        float lightDistance = length( l );
        float angleCos = dot( directLight.direction, spotLight.direction );

        if ( angleCos > spotLight.coneCos ) {

			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );

			directLight.color = spotLight.color;
			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );
			directLight.visible = true;

		} else {

			directLight.color = vec3( 0.0 );
			directLight.visible = false;

		}

    }

#endif
