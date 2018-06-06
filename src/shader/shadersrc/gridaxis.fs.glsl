#version 300 es
precision mediump float;

in vec3 v_color;

layout(location = 0) out vec4 finalColor;

void main() {
    finalColor = vec4(v_color, 1.0);
}
