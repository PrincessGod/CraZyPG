#version 300 es

precision mediump float;
#pragma glslify: flatnorm = require(./flatnorm.glsl)

in vec2 v_uv;
in vec3 v_pos;
in vec3 v_norm;

struct Material {
    float diffuseFactor;
    float specularFactor;
    float shiness;
    bool isFlat;
    bool isBlinn;
};

struct Light {
    vec3 position;
    vec3 color;
    vec3 ambientColor;
};

uniform sampler2D u_texture;
uniform vec3 u_camPos;
uniform Material u_material;
uniform Light u_light;

out vec4 finalColor;

const float kPi = 3.14159265;

void main() {
    vec3 baseColor = texture(u_texture, v_uv).rgb;

    vec3 ambient = u_light.ambientColor;

    vec3 surfaceToLight = normalize(u_light.position - v_pos);
    vec3 normal = vec3(0.0);

    if(u_material.isFlat) {
        normal = flatnorm(v_pos);
    } else {
        normal = normalize(v_norm);
    }

    float diff = max(dot(surfaceToLight, normal), 0.0);
    vec3 diffuse = diff * u_material.diffuseFactor * u_light.color;

    vec3 surfaceToView = normalize(u_camPos - v_pos);
    float spec = 0.0;
    if(u_material.isBlinn) {
        float kEnergyConservation = ( 8.0 + u_material.shiness ) / ( 8.0 * kPi );
        vec3 halfwayDir = normalize(surfaceToLight + surfaceToView);
        spec = pow(max(dot(normal, halfwayDir), 0.0), u_material.shiness) * kEnergyConservation;
    } else {
        float kEnergyConservation = ( 2.0 + u_material.shiness ) / ( 2.0 * kPi ); 
        vec3 reflectDir = reflect(-surfaceToLight, normal);
        spec = pow(max(dot(surfaceToView, reflectDir), 0.0), u_material.shiness) * kEnergyConservation;
    }
    vec3 specular = u_light.color * spec * u_material.specularFactor;

    finalColor = vec4((ambient + diffuse) * baseColor.rgb + specular.rgb, 1.0);
}
