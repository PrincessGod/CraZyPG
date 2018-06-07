#version 300 es
in vec3 a_color;
in vec3 a_position;

uniform mat4 u_mvpMat;

out vec3 v_color;

void main() {
    v_color = a_color;
    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
