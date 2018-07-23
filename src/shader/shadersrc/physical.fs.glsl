#define PHYSICAL

#include <common>
#include <common_fs>
#include <uv_spec_fs>
#include <uv2_spec_fs>
#include <normal_spec_fs>
#include <color_spec_fs>
#include <worldpos_spec_fs>
#include <base_texture_spec_fs>
#include <alpha_texture_spec_fs>
#include <normal_texture_spec_fs>
#include <bump_texture_spec_fs>
#include <emissive_texture_spec_fs>
#include <ao_texture_spec_fs>
#include <light_texture_spec_fs>
#include <env_texture_spec_fs>
#include <metalness_texture_spec_fs>
#include <roughness_texture_spec_fs>

#include <pack>
#include <bsdf>
#include <light_spec>
#include <light_physical_env_fs>
#include <light_physical_spec_fs>

#include <fog_spec_fs>
#include <dither_spec_fs>
#include <logdepth_spec_fs>

uniform vec3 u_diffuse;
uniform float u_alpha;
uniform vec3 u_emissive;
uniform float u_roughness;
uniform float u_metalness;
uniform float u_clearCoat;
uniform float u_clearCoatRoughness;

void main() {

    vec4 diffuseColor = vec4( u_diffuse, u_alpha );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = u_emissive;

    #include <base_texture_fs>
    #include <color_fs>
    #include <alpha_texture_fs>
    #include <alpha_mask_fs>
    #include <alpha_blend_fs>
    #include <begin_normal_fs>
    #include <normal_texture_fs>
    #include <emissive_texture_fs>
    #include <metalness_texture_fs>
    #include <roughness_texture_fs>

    #include <light_physical_fs>
    #include <begin_light_fs>
    #include <light_textures_fs>
    #include <end_light_fs>

    #include <ao_texture_fs>

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
    finalColor = vec4( outgoingLight, diffuseColor.a );

    #include <fog_fs>
    #include <dither_fs>
    #include <logdepth_fs>

}


