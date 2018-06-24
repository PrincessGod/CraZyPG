// convert light intencity to irradiance
float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

	if( decayExponent > 0.0 ) {

        #if defined ( PHYSICALLY_CORRECT_LIGHTS )

            // based upon Frostbite 3 Moving to Physically-based Rendering
            // page 32, equation 26: E[window1]
            // https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
            // this is intended to be used on spot and point lights who are represented as luminous intensity
            // but who must be converted to luminous irradiance for surface lighting calculation
            float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
            float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
            return distanceFalloff * maxDistanceCutoffFactor;

        #else

            return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );

        #endif

	}

	return 1.0;

}

vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {

    return RECIPROCAL_PI * diffuseColor;

}
