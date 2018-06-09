#version 300 es

in vec3 a_position;
in vec3 a_uv;
in vec3 a_normal;

in vec4 a_color;

in vec4 a_joint;
in vec4 a_weight;

uniform mat4 u_modelMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform mat4 u_mvpMat;
uniform mat4 u_vpMat;
uniform mat3 u_normMat;
uniform vec3 u_camPos;

out vec2 v_uv;
out vec3 v_normal;
out vec4 v_color;

out vec3 v_pos;

void main() {

    vec4 position = vec4( a_position, 1.0 );
    vec3 normal = a_normal;

    // morph

    // skin

    v_uv = a_uv;
    v_normal = normal;
    v_color = a_color;

    gl_Position = u_mvpMat * position;

}
