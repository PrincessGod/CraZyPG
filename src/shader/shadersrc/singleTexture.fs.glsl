#version 300 es
precision mediump float;

in highp vec2 v_uv;

uniform sampler2D u_texture;

out vec4 finalColor;

void main() {
    finalColor = texture(u_texture, vec2(v_uv.s, v_uv.t));
}
