uniform float u_alpha;

#include <common>
#include <common_fs>
#include <uv_spec_fs>
#include <normal_spec_fs>
#include <normal_texture_spec_fs>
#include <bump_texture_spec_fs>

#include <pack>

#if defined( FLAT_SHADE ) || defined( HAS_NORMALTEXTURE ) || defined( HAS_BUMPTEXTURE )

    #include <worldpos_spec_fs>

#endif

void main() {

    #include <begin_normal_fs>
    #include <normal_texture_fs>

    finalColor = vec4( packNormal2RGB( normal ), u_alpha );

}
