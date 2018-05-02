#version 300 es
in vec4 a_position;

uniform mat4 u_mvpMat;

out highp vec3 v_uv;

void main() {
    v_uv = a_position.xyz;
    gl_Position = u_mvpMat * vec4(a_position.xyz, 1.0);
    gl_Position.z = gl_Position.w;
}
