#include <common>
#include <common_vs>
#include <uv_spec_vs>
// uv2
#include <normal_spec_vs>
#include <color_spec_vs>
#include <worldpos_spec_vs>
// displacement
// env
// fog
// shadow
// log depth
// clip planes

void main() {

    #include <begin_position_vs>
    #include <begin_normal_vs>

    #include <morph_vs>
    #include <skinning_vs>
    #include <uv_vs>
    #include <normal_vs>
    #include <color_vs>
    #include <position_vs>

    #include <worldpos_vs>

}
