#version 300 es
precision mediump float;

in vec4 v_color;

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {
    finalColor = v_color;

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}
