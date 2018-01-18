#version 300 es
in vec3 a_position;
in vec3 a_barycentric;

uniform mat4 u_mvpMat;

out vec3 v_barycentric;
out vec3 v_pos;

void main() {
    v_barycentric = a_barycentric;
    v_pos = a_position;
    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
