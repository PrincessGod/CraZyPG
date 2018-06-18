#if defined( HAS_ENV_TEXTURE )

	uniform float u_reflectivity;
	uniform float u_envIntensity;

#endif

#ifdef HAS_ENV_TEXTURE

    #if defined( HAS_BUMPTEXTURE ) || defined( HAS_NORMALTEXTURE ) || defined( PHONG )

        in vec3 v_worldPos;

    #endif

    #ifdef ENV_TEXTURE_TYPE_CUBE

        uniform samplerCube u_envTexture;

    #else

        uniform sampler2D u_envTexture;

    #endif

    uniform int u_mipmapLevel;

    #if defined( HAS_BUMPTEXTURE ) || defined( HAS_NORMALTEXTURE ) || defined( PHONG )

        uniform float u_refractionRatio;

    #else

        in vec3 v_reflect;

    #endif

#endif
