uniform float u_alpha;

#include <pack>
#include <common>
#include <common_fs>
#include <uv_spec_fs>
#include <normal_spec_fs>
#include <normal_texture_spec_fs>

#if defined( FLAT_SHADE ) || defined( USE_NORMALMAP )

    #include <worldpos_spec_fs>

#endif

void main() {

    #include <beigin_normal_fs>
    #include <normal_texture_fs>

    finalColor = vec4( packNormal2RGB( normal ), u_alpha );

}
