#version 300 es
precision mediump float;

in highp vec2 v_uv;

uniform sampler2D u_texture;

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {
    finalColor = texture(u_texture, vec2(v_uv.s, v_uv.t));

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}
