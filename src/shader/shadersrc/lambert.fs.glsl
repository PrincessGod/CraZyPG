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
// light map
// emmissive map
// env map
// specular map

#include <bsdf>
#include <light_spec>

void main() {

    vec4 diffuseColor = vec4( u_diffuse, u_alpha );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = u_emissive;

    #include <base_texture_fs>
    #include <color_fs>
    #include <alpha_texture_fs>
    #include <alpha_mask_fs>
    #include <alpha_blend_fs>
    // specular map
    // emissive map

    #include <light_lambert_fs>

    reflectedLight.indirectDiffuse = getAmbientLightIrradiance( u_ambientLightColor );

    // light map

    #ifdef DOUBLE_SIDE

        reflectedLight.directDiffuse = ( gl_FrontFacing ) ? lightFront : lightBack;

    #else

        reflectedLight.directDiffuse = lightFront;

    #endif

    reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );

    // ao map

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

    // env map

    finalColor = vec4( outgoingLight, diffuseColor.a );

}
