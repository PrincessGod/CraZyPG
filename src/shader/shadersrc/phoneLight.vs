#version 300 es
in vec3 a_position;
in vec2 a_uv;
in vec3 a_normal;

uniform mat4 u_projMat;
uniform mat4 u_viewMat;
uniform mat4 u_worldMat;

out highp vec2 v_uv;
out vec3 v_vpos;
out vec3 v_norm;

void main() {
    mat4 worldViewMat = u_viewMat * u_worldMat;
    vec4 viewWorldPos = worldViewMat * vec4(a_position, 1.0);

    v_vpos = viewWorldPos.xyz;
    gl_Position = u_projMat * viewWorldPos;

    v_uv = a_uv;

    mat3 normalMat = transpose(inverse(mat3(worldViewMat)));
    v_norm = normalize(normalMat * a_normal);
}
