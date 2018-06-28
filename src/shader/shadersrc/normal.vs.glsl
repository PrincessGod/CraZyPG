#include <common>
#include <common_vs>
#include <uv_spec_vs>
#include <normal_spec_vs>

#if defined( FLAT_SHADE ) || defined( USE_NORMALMAP )

    #include <worldpos_spec_vs>

#endif

void main() {

    #include <beigin_position_vs>
    #include <beigin_normal_vs>

    #include <morph_vs>
    #include <skinning_vs>
    #include <uv_vs>
    #include <normal_vs>
    #include <position_vs>

    #if defined( FLAT_SHADE ) || defined( USE_NORMALMAP )

        #include <worldpos_vs>

    #endif

}
