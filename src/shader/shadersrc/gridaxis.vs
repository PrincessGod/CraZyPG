#version 300 es
in vec3 a_position;
in float a_color;

uniform mat4 u_mvpMat;
uniform vec3 u_colors[4];

out vec3 v_color;

void main() {
    v_color = u_colors[int(a_color)];
    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
