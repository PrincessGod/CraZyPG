#version 300 es
precision mediump float;

in vec2 v_uv;

uniform sampler2D u_texture;

layout(location = 0) out vec4 finalColor;

void main() {
    finalColor = texture(u_texture, v_uv);
}
