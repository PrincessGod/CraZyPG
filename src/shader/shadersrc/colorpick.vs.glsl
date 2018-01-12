#version 300 es

in vec3 a_position;

main() {
    gl_Position = u_mvpMat * vec4(a_position, 1.0);
}
