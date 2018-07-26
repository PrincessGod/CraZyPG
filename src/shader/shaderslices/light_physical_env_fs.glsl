#if defined( HAS_ENVTEXTURE ) && defined( PHYSICAL )

	vec3 getLightProbeIndirectIrradiance( /*const in SpecularLightProbe specularLightProbe,*/ const in GeometricContext geometry, const in int maxMIPLevel ) {

		vec3 worldNormal = inverseTransformDirection( geometry.normal, u_viewMat );

		#ifdef ENVTEXTURE_CUBE

			// TODO: replace with properly filtered cubemaps and access the irradiance LOD level, be it the last LOD level
			// of a specular cubemap, or just the default level of a specially created irradiance cubemap.
            vec4 envMapColor = textureLod( u_envTexture, worldNormal, 8.0 ); // float( maxMIPLevel )

			// envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;

		#else

			vec4 envMapColor = vec4( 0.0 );

		#endif

		return PI * envMapColor.rgb * u_envTextureIntensity;

	}

	// taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html
	float getSpecularMIPLevel( const in float blinnShininessExponent, const in float maxMIPLevel ) {

		//float envMapWidth = pow( 2.0, maxMIPLevelScalar );
		//float desiredMIPLevel = log2( envMapWidth * sqrt( 3.0 ) ) - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );

		float maxMIPLevelScalar = maxMIPLevel;
		float desiredMIPLevel = maxMIPLevelScalar + 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );

		// clamp to allowable LOD ranges.
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );

	}

    vec3 getLightProbeIndirectRadiance( /*const in SpecularLightProbe specularLightProbe,*/ const in GeometricContext geometry, const in float blinnShininessExponent/*, const in int maxMIPLevel*/ ) {

		#ifdef ENVTEXTURE_REFLECTION

			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );

		#else

			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, u_refractionRatio );

		#endif

		reflectVec = inverseTransformDirection( reflectVec, u_viewMat );

		ivec2 texSize = textureSize( u_envTexture, 0 );
		int maxDemension = max( texSize.x, texSize.y );
		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, ceil( log2( float( maxDemension ) ) ) );

		#ifdef ENVTEXTURE_CUBE

		    vec4 envMapColor = textureLod( u_envTexture, reflectVec, specularMIPLevel );

			// envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;

        #else

            vec4 envMapColor = vec4( 0.0 );

        #endif

		return envMapColor.rgb * u_envTextureIntensity;

	}

#endif
