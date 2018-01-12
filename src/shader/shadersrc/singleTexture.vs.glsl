#version 300 es
in vec3 a_position;
in vec2 a_uv;

uniform mat4 u_mvpMat;

out highp vec2 v_uv;

void main() {
    v_uv = a_uv;
    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
