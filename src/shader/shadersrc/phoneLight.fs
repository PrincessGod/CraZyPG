#version 300 es

precision mediump float;

struct Light {
    vec3 position;
    vec3 color;
    vec3 ambient;
    float falloff;
    float radius;
};

in highp vec2 v_uv;
in vec3 v_vpos;
in vec3 v_norm;

#pragma glslify: faceNormals = require('glsl-face-normal')
// #pragma glslify: perturb = require('glsl-perturb-normal')
#pragma glslify: computeDiffuse = require('glsl-diffuse-oren-nayar')
#pragma glslify: computeSpecular = require('glsl-specular-phong')
#pragma glslify: attenuation = require('./madams-attenuation.glsl')
#pragma glslify: toLinear = require('glsl-gamma/in')
#pragma glslify: toGamma = require('glsl-gamma/out')

const vec2 UV_SCALE = vec2(1.0, 1.0);
const float specularStrength = 0.05;
const float specularScale = 0.65;
const float shininess = 20.0;
const float roughness = 0.5;
const float albedo = 0.95;

uniform sampler2D u_texture;
// uniform sampler2D u_normalTex;
// uniform sampler2D u_specularTex;

uniform int u_flat;
uniform highp mat4 u_worldMat;
uniform highp mat4 u_viewMat;

uniform Light u_light;

vec4 textureLinear(sampler2D uTex, vec2 uv) {
    return toLinear(texture(uTex, uv));
}

out vec4 finalColor;

void main() {
    vec3 normal = vec3(0.0);
    if(u_flat == 1) {
        normal = faceNormals(v_vpos);
    } else {
        normal = v_norm;
    }

    vec4 lightPosition = u_viewMat * vec4(u_light.position, 1.0);
    vec3 lightVector = lightPosition.xyz - v_vpos;
    vec3 color = vec3(0.0);

    float lightDistance = length(lightVector);
    float falloff = attenuation(u_light.radius, u_light.falloff, lightDistance);

    vec2 uv = v_uv * UV_SCALE;
    vec3 diffuseColor = textureLinear(u_texture, uv).rgb;
    
    vec3 L = normalize(lightVector);
    vec3 V = normalize(v_vpos);

    float specular = specularStrength * computeSpecular(L, V, normal, shininess) * specularScale;// * falloff;
    vec3 diffuse = u_light.color * computeDiffuse(L, V, normal, roughness, albedo);// * falloff;
    vec3 ambient = u_light.ambient;

    color += diffuseColor * (diffuse + ambient) + specular;

    color = toGamma(color);
    
    finalColor = vec4(color, 1.0);
}
