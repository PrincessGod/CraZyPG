uniform vec3 u_diffuse;
uniform vec3 u_emissive;
uniform float u_alpha;

#include <common>
#include <common_fs>
#include <uv_spec_fs>
#include <uv2_spec_fs>
#include <normal_spec_fs>
#include <color_spec_fs>
#include <worldpos_spec_fs>
#include <base_texture_spec_fs>
#include <alpha_texture_spec_fs>
#include <emissive_texture_spec_fs>
#include <specular_texture_spec_fs>
#include <ao_texture_spec_fs>
// light map
// env map

#include <bsdf>
#include <light_spec>

#include <fog_spec_fs>

void main() {

    vec4 diffuseColor = vec4( u_diffuse, u_alpha );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = u_emissive;

    #include <base_texture_fs>
    #include <color_fs>
    #include <alpha_texture_fs>
    #include <alpha_mask_fs>
    #include <alpha_blend_fs>
    #include <emissive_texture_fs>
    #include <specular_texture_fs>

    #include <light_lambert_fs>

    reflectedLight.indirectDiffuse = getAmbientLightIrradiance( u_ambientLightColor );

    // light map

    #ifdef DOUBLE_SIDE

        reflectedLight.directDiffuse = ( gl_FrontFacing ) ? lightFront : lightBack;

    #else

        reflectedLight.directDiffuse = lightFront;

    #endif

    reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );

    #include <ao_texture_fs>

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

    // env map

    finalColor = vec4( outgoingLight, diffuseColor.a );

    #include <fog_fs>

}
