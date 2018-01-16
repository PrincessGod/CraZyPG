#version 300 es
precision mediump float;

in highp vec2 v_uv;

uniform sampler2D u_texture;
uniform bool u_flipy;

layout(location = 0) out vec4 finalColor;

void main() {
    finalColor = texture(u_texture, vec2(v_uv.s, u_flipy ? (1.0 - v_uv.t) : v_uv.t ));
}
