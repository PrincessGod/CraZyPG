#version 300 es
precision mediump float;

uniform vec4 u_color;

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {
    finalColor = u_color;

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}
