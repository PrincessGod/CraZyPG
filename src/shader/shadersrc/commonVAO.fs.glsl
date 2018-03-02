#version 300 es

precision mediump float;

in vec2 v_uv;
in vec3 v_pos;
in vec3 v_norm;
in vec3 v_barycentric;

uniform sampler2D u_texture;

out vec4 finalColor;

void main() {
    vec4 color = texture(u_texture, v_uv);

    finalColor = color + vec4(normalize(v_pos) + vec3(v_uv, 1.0) + v_barycentric, 0.0);
}
