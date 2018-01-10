#version 300 es

precision mediump float;

struct Light {
    vec3 position;
    vec3 color;
    vec3 ambientColor;
    float falloff;
    float radius;
};

struct Material {
    float specularFactor;
    float shiness;
    float roughness;
    float albedo;
    bool isFlat;
    bool isGamma;
};

in vec2 v_uv;
in vec3 v_pos;
in vec3 v_norm;

#pragma glslify: faceNormals = require('glsl-face-normal')
#pragma glslify: computeDiffuse = require('glsl-diffuse-oren-nayar')
#pragma glslify: computeSpecular = require('glsl-specular-phong')
#pragma glslify: attenuation = require('./madams-attenuation.glsl')
#pragma glslify: toLinear = require('glsl-gamma/in')
#pragma glslify: toGamma = require('glsl-gamma/out')

uniform sampler2D u_texture;
uniform vec3 u_camPos;

uniform Light u_light;
uniform Material u_material;

vec4 textureLinear(sampler2D uTex, vec2 uv) {
    return toLinear(texture(uTex, uv));
}

out vec4 finalColor;

void main() {
    vec3 normal = vec3(0.0);
    if(u_material.isFlat) {
        normal = faceNormals(v_pos);
    } else {
        normal = normalize(v_norm);
    }

    vec3 lightVector = u_light.position - v_pos;
    vec3 color = vec3(0.0);

    float lightDistance = length(lightVector);
    float falloff = attenuation(u_light.radius, u_light.falloff, lightDistance);

    vec4 baseColor = vec4(0.0);
    if(u_material.isGamma) {
        baseColor = textureLinear(u_texture, v_uv);
    } else {
        baseColor = texture(u_texture, v_uv);
    }
    vec3 diffuseColor = baseColor.rgb;
    
    vec3 L = normalize(lightVector);
    vec3 V = normalize(u_camPos - v_pos);

    float specular = u_material.specularFactor * computeSpecular(L, V, normal, u_material.shiness) * falloff;
    vec3 diffuse = u_light.color * computeDiffuse(L, V, normal, u_material.roughness, u_material.albedo) * falloff;
    vec3 ambient = u_light.ambientColor;

    color += diffuseColor * (diffuse + ambient) + specular;

    if (u_material.isGamma) {
        color = toGamma(color);
    }
    
    finalColor = vec4(color, baseColor.a);
}
