#version 300 es
in vec3 a_position;

uniform mat4 u_mvpMat;
uniform vec4 u_colors[2];

out vec4 v_color;

void main() {
    v_color = u_colors[gl_VertexID % 2];
    gl_Position = u_mvpMat * vec4(a_position.xyz, 1.0);
}
