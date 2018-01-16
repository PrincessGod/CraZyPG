#version 300 es
precision mediump float;

in highp vec3 v_uv;

uniform samplerCube u_dayTex;
uniform samplerCube u_nightTex;
uniform float u_rate;

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {
    finalColor = mix( texture(u_dayTex, v_uv), texture(u_nightTex, v_uv), u_rate);

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}
