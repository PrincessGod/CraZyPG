#include <common>
#include <common_vs>
#include <uv_spec_vs>
#include <uv2_spec_vs>
#include <normal_spec_vs>
#include <color_spec_vs>
#include <env_texture_spec_vs>

void main() {

    #include <begin_position_vs>
    #include <begin_normal_vs>
    #include <morph_vs>
    #include <skinning_vs>
    #include <uv_vs>
    #include <uv2_vs>
    #include <normal_default_vs>
    #include <normal_vs>
    #include <color_vs>
    #include <env_texture_vs>
    #include <position_vs>

}
