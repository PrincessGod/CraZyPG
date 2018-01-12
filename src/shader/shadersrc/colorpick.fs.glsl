#version 300 es

uniform vec3 u_color;

out vec4 finalColor;

main() {
    finalColor = vec4(u_color, 1.0);
}
