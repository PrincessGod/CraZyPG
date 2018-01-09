#version 300 es

precision mediump float;
#pragma glslify: flatnorm = require(./flatnorm.glsl)

in highp vec2 v_uv;
in vec3 v_pos;
in vec3 v_norm;

uniform sampler2D u_texture;
uniform vec3 u_lightPos;
uniform vec3 u_camPos;
uniform float u_ambientStrength;
uniform float u_diffuseStrength;
uniform float u_specularStrength;
uniform float u_shiness;

out vec4 finalColor;

void main() {
    vec4 baseColor = texture(u_texture, v_uv);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 norm = normalize(v_norm);

    #ifdef FLAT 
    norm = flatnorm(v_pos);
    #endif

    vec3 ambientColor = lightColor * u_ambientStrength;

    vec3 surfaceToLight = normalize(u_lightPos - v_pos);
    float diffAngle = max(dot(norm, surfaceToLight), 0.0);
    vec3 diffuseColor = lightColor * diffAngle * u_diffuseStrength;

    vec3 surfaceToCam = normalize(u_camPos - v_pos);
    vec3 reflectDir = normalize(reflect(-surfaceToLight, norm));
    float rate = pow(max(dot(reflectDir, surfaceToCam), 0.0), u_shiness);
    vec3 specularColor = lightColor * rate * u_specularStrength;

    finalColor = vec4((ambientColor + diffuseColor) * baseColor.rgb + specularColor.rgb, 1.0);
    // finalColor = vec4(diffAngle, diffAngle, diffAngle, 1.0);
}
