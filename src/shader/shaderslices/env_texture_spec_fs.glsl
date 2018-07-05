#define ENVTEXTURE_CUBE
#define ENVTEXTURE_REFLECTION
// #define ENVTEXTURE_BLENDING_MULTIPLY
#define ENVTEXTURE_BLENDING_MIX

#if defined( HAS_ENVTEXTURE ) || defined( PBR )

	uniform float u_reflectivity;
	uniform float u_envIntensity;

#endif

#ifdef HAS_ENVTEXTURE

    #ifdef ENVTEXTURE_CUBE

        uniform samplerCube u_envTexture;

    #else

        uniform sampler2D u_envTexture;

    #endif

    uniform int u_mipmapLevel;
    uniform float u_refractionRatio;

#endif
