#version 300 es
in vec3 a_position;

#ifdef UV_NUM
in vec2 a_uv;
#endif

uniform mat4 u_mvpMat;

#ifdef UV_NUM
out highp vec2 v_uv;
#endif

void main() {
    gl_Position = u_mvpMat * vec4(a_position, 1.0);

    #ifdef UV_NUM
    v_uv = a_uv;
    #endif
}
