#version 300 es
in vec3 a_position;
in vec2 a_uv;
in vec3 a_normal;

uniform mat4 u_mvpMat;
uniform mat4 u_worldMat;
uniform mat3 u_normMat;

out vec2 v_uv;
out vec3 v_pos;
out vec3 v_norm;

void main() {
    v_uv = a_uv;
    v_pos = (u_worldMat * vec4(a_position, 1.0)).xyz;
    v_norm = normalize(u_normMat * a_normal);

    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
