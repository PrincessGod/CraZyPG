#version 300 es
precision mediump float;

// https://github.com/mattdesl/webgl-wireframes/blob/gh-pages/lib/wire.frag

#pragma glslify: noise = require('glsl-noise/simplex/4d');
#define PI 3.14159265359

in vec3 v_barycentric;
in vec3 v_pos;

uniform float u_thickness;
uniform vec4 u_stroke;
uniform vec4 u_fill;
uniform float u_secondThickness;
uniform bool u_dualStroke;

uniform bool u_screenWidth;

uniform vec4 u_backStroke;
uniform bool u_colorBack;

uniform float u_time;
uniform bool u_noiseSmall;
uniform bool u_noiseBig;

uniform bool u_squeeze;
uniform float u_squeezeEndpoint;
uniform float u_squeezeMiddle;

uniform bool u_dash;
uniform float u_dashRepeats;
uniform float u_dashLength;
uniform bool u_dashOverlap;
uniform bool u_dashAnimate;

float edgeFactor(float offset, float thickness){
    vec3 d = fwidth(v_barycentric);
    vec3 a3 = smoothstep(d * ((thickness * 0.5) - 0.5) , d * ((thickness * 0.5) + 0.5), v_barycentric + offset);
    return min(min(a3.x, a3.y), a3.z);
}

float aastep(float d, float thickness) {
    float afwidth = fwidth(d) * 0.5;
    return smoothstep(thickness - afwidth, thickness + afwidth, d);
}

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {
    float d = min(min(v_barycentric.x, v_barycentric.y), v_barycentric.z);
    float noiseOff = 0.0;
    if (u_noiseBig) noiseOff += noise(vec4(v_pos.xyz * 1.0, u_time * 0.05)) * 0.15;
    if (u_noiseSmall) noiseOff += noise(vec4(v_pos.xyz * 80.0, u_time * 0.1)) * 0.12;
    d += noiseOff;

    float positionAlong = max(v_barycentric.x, v_barycentric.y);
    if (v_barycentric.y < v_barycentric.x && v_barycentric.y < v_barycentric.z) {
        positionAlong = 1.0 - positionAlong;
    }

    float computedThickness = u_thickness;

    if (u_squeeze) {
        computedThickness *= mix(u_squeezeEndpoint, u_squeezeMiddle, sin(positionAlong * PI));
    }

    if (u_dash) {
        float offset = 1.0 / u_dashRepeats * u_dashLength / 2.0;

        if (!u_dashOverlap) {
            offset += 1.0 / u_dashRepeats / 2.0;
        }

        if (u_dashAnimate) {
            offset += u_time * 0.022;
        }

        float pattern = fract((positionAlong + offset) * u_dashRepeats);
        computedThickness *= 1.0 - aastep(u_dashLength, pattern);
    }

    float frag = 0.0;
    if (u_screenWidth) {
        frag = edgeFactor(noiseOff, computedThickness * 10.0);
    } else {
        frag = aastep(d, computedThickness / 10.0);
    }

    float inner = 0.0;
    if(u_dualStroke) {
        inner = aastep(u_secondThickness, d);       
    }

    if(u_colorBack && !gl_FrontFacing) {
        finalColor = mix(u_backStroke, u_fill, abs(inner - frag));
    } else {
        finalColor = mix(u_stroke, u_fill, abs(inner - frag));
    }

    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}
