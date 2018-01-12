#version 300 es
precision mediump float;

in highp vec3 v_uv;

uniform samplerCube u_dayTex;
uniform samplerCube u_nightTex;
uniform float u_rate;

out vec4 finalColor;
void main() {
    finalColor = mix( texture(u_dayTex, v_uv), texture(u_nightTex, v_uv), u_rate);
}
