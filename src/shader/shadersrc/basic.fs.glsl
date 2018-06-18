#include <common>
#include <common_fs>
#include <uv_spec_fs>
#include <uv2_spec_fs>
#include <normal_spec_fs>
#include <color_spec_fs>
#include <base_texture_spec_fs>
#include <alpha_texture_spec_fs>
#include <light_texture_spec_fs>
#include <specular_texture_spec_fs>
#include <ao_texture_spec_fs>
#include <env_texture_spec_fs>

void main() {

    #include <base_texture_fs>
    #include <color_fs>
    #include <alpha_texture_fs>
    #include <alpha_mask_fs>
    #include <alpha_blend_fs>
    #include <specular_texture_fs>

    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	#ifdef HAS_LIGHTTEXTURE

		reflectedLight.indirectDiffuse += texture2D( u_lightTexture, vUv2 ).xyz * u_lightTextureIntensity;

	#else

		reflectedLight.indirectDiffuse += vec3( 1.0 );

	#endif

    #include <ao_texture_fs>

    reflectedLight.indirectDiffuse *= baseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;

    #include <env_texture_fs>

    finalColor = vec4( outgoingLight, baseColor.a );

}
