#version 300 es
in vec3 a_position;

uniform mat4 u_worldMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform float u_pSize;

void main() {
    gl_PointSize = u_pSize;
    gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position.xyz, 1.0);
}
