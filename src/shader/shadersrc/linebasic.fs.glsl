#version 300 es

precision mediump float;
precision mediump int;

in vec2 v_uv;
in vec3 v_normal;
in vec4 v_color;

unifrom vec4 baseColorFactor;
unifrom sampler2D u_baseTexture;

out vec4 finalColor;

void main() {

    float baseColor = baseColorFactor;
    baseColor *= texture( u_baseTexture, v_uv );

    baseColor.xyz *= v_color;

    // alpha

    // discard

    finalColor = baseColor;

}
