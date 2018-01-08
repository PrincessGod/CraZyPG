#version 300 es
in vec4 a_position;

uniform mat4 u_worldMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out highp vec3 v_uv;

void main() {
    v_uv = a_position.xyz;
    gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position.xyz, 1.0);
}
