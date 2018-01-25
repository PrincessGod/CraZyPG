#version 300 es

// https://github.com/spite/THREE.MeshLine/blob/master/src/THREE.MeshLine.js

in vec3 a_position;
in vec2 a_uv;
in vec3 a_previous;
in vec3 a_next;
in float a_side;
in float a_width;
in float a_counters;

uniform mat4 u_projMat;
uniform mat4 u_viewMat;
uniform mat4 u_worldMat;
uniform vec2 u_resolution;
uniform float u_linewidth;
uniform float u_near;
uniform float u_far;
uniform bool u_sizeAttenuation;

out vec2 v_uv;
out float v_counters;

vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    float pixelWidthRatio = 1.0 / (u_resolution.x * u_projMat[0][0]);

    v_uv = a_uv;
    v_counters = a_counters;

    mat4 m = u_projMat * u_viewMat * u_worldMat;
    vec4 finalPosition = m * vec4(a_position, 1.0);
    vec4 prevPos = m * vec4(a_previous, 1.0);
    vec4 nextPos = m * vec4(a_next, 1.0);

    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);

    float pixelWidth = finalPosition.w * pixelWidthRatio;
    float w = 1.8 * pixelWidth * u_linewidth * a_width * 10.0;

    if(u_sizeAttenuation) {
        w = 1.8 * u_linewidth * a_width * 0.01;
    }

    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
        vec2 dir1 = normalize(currentP - prevP);
        vec2 dir2 = normalize(nextP - currentP);
        dir = normalize(dir1 + dir2);
    }

    vec2 normal = vec2(-dir.y, dir.x);
    normal.x /= aspect;
    normal *= 0.5 * w;

    vec4 offset = vec4(normal * a_side, 0.0, 1.0);
    finalPosition.xy += offset.xy;
    
    gl_Position = finalPosition;
}
