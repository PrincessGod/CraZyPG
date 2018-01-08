#version 300 es
in vec3 a_position;
layout(location=4) in float a_color;

uniform mat4 u_worldMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec3 u_colors[4];

out vec3 v_color;

void main() {
    v_color = u_colors[int(a_color)];
    gl_Position = u_projMat * u_viewMat * u_worldMat * vec4(a_position, 1.0);
}
