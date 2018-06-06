#version 300 es
in vec3 a_color;
in vec3 a_position;

uniform mat4 u_modelMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec3 v_color;

void main() {
    v_color = a_color;
    gl_Position = u_projMat * u_viewMat * u_modelMat * vec4(a_position, 1.0);
}
