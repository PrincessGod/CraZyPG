#version 300 es

precision mediump float;

in vec2 v_uv;
in vec4 v_color;
in float v_counters;

uniform sampler2D u_texture;
uniform bool u_useTexture;
uniform float u_visibilityStart;
uniform float u_visibilityEnd;
uniform float u_tile;
uniform vec2 u_repeat;
uniform vec4 u_color;

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

float aastep(float thickness, float d) {
    return smoothstep(thickness, thickness + u_tile, d);
}

void main() {

    vec4 c = u_color;
    if(u_useTexture) c *= texture(u_texture, v_uv * u_repeat);

    c.a *= aastep(0.0, (v_counters - u_visibilityStart) / (u_visibilityEnd - u_visibilityStart));
    c.a *= aastep(0.0, (u_visibilityEnd - v_counters) / (u_visibilityEnd - u_visibilityStart));

    finalColor = c;

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif

}

