#version 300 es
in vec3 a_position;

uniform mat4 u_mvpMat;
uniform float u_pSize;

void main() {
    gl_PointSize = u_pSize;
    gl_Position = u_mvpMat * vec4(a_position.xyz, 1.0);
}
