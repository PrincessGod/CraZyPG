#version 300 es
precision mediump float;

#ifdef UV_NUM
in highp vec2 v_uv;
#endif

#ifdef BASE_COLOR_FACTOR
uniform mediump vec4 u_baseColorFactor;
#endif

#ifdef BASE_COLOR_SAMPLER
uniform sampler2D u_texture;
#endif

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {

    vec4 outColor = vec4(0.0, 0.0, 0.0, 1.0);

    // base color
    #ifdef BASE_COLOR_FACTOR
    outColor = u_baseColorFactor;
        #ifdef UV_NUM
            #ifdef BASE_COLOR_SAMPLER
            outColor *= texture(u_texture, v_uv);
            #endif
        #endif
    #endif


    finalColor = outColor;

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}