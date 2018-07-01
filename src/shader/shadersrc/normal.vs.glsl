#include <common>
#include <common_vs>
#include <uv_spec_vs>
#include <normal_spec_vs>

#if defined( FLAT_SHADE ) || defined( HAS_NORMALTEXTURE ) || defined( HAS_BUMPTEXTURE )

    #include <worldpos_spec_vs>

#endif

void main() {

    #include <begin_position_vs>
    #include <begin_normal_vs>

    #include <morph_vs>
    #include <skinning_vs>
    #include <uv_vs>
    #include <normal_vs>
    #include <position_vs>

    #if defined( FLAT_SHADE ) || defined( HAS_NORMALTEXTURE ) || defined( HAS_BUMPTEXTURE )

        #include <worldpos_vs>

    #endif

}
