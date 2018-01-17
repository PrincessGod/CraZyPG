#version 300 es
precision mediump float;

in highp vec2 v_uv;

#ifdef FXAA
#pragma glslify: fxaa = require('./fxaa.glsl',textureImp=texture)
uniform vec2 u_resolution;
#endif

uniform sampler2D u_texture;
uniform bool u_flipy;

layout(location = 0) out vec4 finalColor;

void main() {
    vec2 uv = vec2(v_uv.s, u_flipy ? (1.0 - v_uv.t) : v_uv.t );
    
    #ifdef FXAA
        vec2 fragCoord = uv * u_resolution;
        finalColor = fxaa(u_texture, fragCoord, u_resolution);
    #else
        finalColor = texture(u_texture, uv);
    #endif
}
