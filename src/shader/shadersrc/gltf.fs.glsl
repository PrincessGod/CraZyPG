#version 300 es
precision mediump float;
#define USE_IBL
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;

#ifdef HAS_VERTEXCOLOR
in vec4 v_color;
#endif

#ifdef ALPHA_MASK
uniform float u_alphaCutoff;
#endif

#ifdef USE_IBL
uniform samplerCube u_diffuseEnvMap;
uniform samplerCube u_specularEnvMap;
uniform sampler2D u_brdfLUT;
#endif

#ifdef HAS_BASECOLORMAP
uniform sampler2D u_baseColorSampler;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D u_metallicRoughnessSampler;
#endif
#ifdef HAS_NORMALMAP
uniform float u_normalScale;
uniform sampler2D u_normalSampler;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D u_emissiveSampler;
uniform vec3 u_emissiveFactor;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D u_occlusionSampler;
uniform float u_occlusionFactor;
#endif

uniform vec4 u_baseColorFactor;
uniform vec2 u_metallicRoughnessValues;

uniform vec3 u_camPos;
in vec3 v_pos;
in vec2 v_uv;

#ifdef HAS_NORMAL
    #ifdef HAS_TANGENT
    in mat3 v_TBN;
    #else
    in vec3 v_normal;
    #endif
#endif

struct PBRInfo
{
    float NdotL;
    float NdotV;
    float NdotH;
    float LdotH;
    float VdotH;
    float perceptualRoughness;
    float metalness;
    vec3 reflectance0;
    vec3 reflectance90;
    float alphaRoughness;
    vec3 diffuseColor;
    vec3 specularColor;
};

const float M_PI = 3.141592653589793;
const float c_MinRoughness = 0.04;

vec4 SRGBtoLINEAR(vec4 srgbIn)
{
    #ifdef MANUAL_SRGB
        #ifdef SRGB_FAST_APPROXIMATION
        vec3 linOut = pow(srgbIn.xyz, vec3(2.2));
        #else
        vec3 bLess = step(vec3(0.04045), srgbIn.xyz);
        vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055), vec3(2.4)), bLess);
        #endif
    return vec4(linOut, srgbIn.w);
    #else
    return srgbIn;
    #endif
}

vec3 getNormal()
{
    #ifndef HAS_TANGENT
    vec3 pos_dx = dFdx(v_pos);
    vec3 pos_dy = dFdy(v_pos);
    vec3 tex_dx = dFdx(vec3(v_uv, 0.0));
    vec3 tex_dy = dFdy(vec3(v_uv, 0.0));
    vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);
        #ifdef HAS_NORMAL
        vec3 ng = normalize(v_normal);
        #else
        vec3 ng = cross(pos_dx, pos_dy);
        #endif
    t = normalize(t - ng * dot(ng, t));
    vec3 b = normalize(cross(ng, t));
    mat3 tbn = mat3(t, b, ng);
    #else
    mat3 tbn = v_TBN;
    #endif

    #ifdef HAS_NORMALMAP
    vec3 n = texture(u_normalSampler, v_uv).rgb;
    n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_normalScale, u_normalScale, 1.0)));
    #else
    vec3 n = normalize(tbn[2].xyz);
    #endif

    return n;
}

#ifdef USE_IBL
vec3 getIBLContribution(PBRInfo pbrInputs, vec3 n, vec3 reflection)
{
    float mipCount = 9.0;
    float lod = (pbrInputs.perceptualRoughness * mipCount);
    vec3 brdf = SRGBtoLINEAR(texture(u_brdfLUT, vec2(pbrInputs.NdotV, 1.0 - pbrInputs.perceptualRoughness))).rgb;
    vec3 diffuseLight = SRGBtoLINEAR(texture(u_diffuseEnvMap, n)).rgb;

    #ifdef USE_TEX_LOD
    vec3 specularLight = SRGBtoLINEAR(texture(u_specularEnvMap, reflection, lod)).rgb;
    #else
    vec3 specularLight = SRGBtoLINEAR(texture(u_specularEnvMap, reflection)).rgb;
    #endif

    vec3 diffuse = diffuseLight * pbrInputs.diffuseColor;
    vec3 specular = specularLight * (pbrInputs.specularColor * brdf.x + brdf.y);

    return diffuse + specular;
}
#endif

vec3 diffuse(PBRInfo pbrInputs)
{
    return pbrInputs.diffuseColor / M_PI;
}

vec3 specularReflection(PBRInfo pbrInputs)
{
    return pbrInputs.reflectance0 + (pbrInputs.reflectance90 - pbrInputs.reflectance0) * pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);
}

float geometricOcclusion(PBRInfo pbrInputs)
{
    float NdotL = pbrInputs.NdotL;
    float NdotV = pbrInputs.NdotV;
    float r = pbrInputs.alphaRoughness;

    float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
    float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
    return attenuationL * attenuationV;
}

float microfacetDistribution(PBRInfo pbrInputs)
{
    float roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;
    float f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;
    return roughnessSq / (M_PI * f * f);
}

layout(location = 0) out vec4 finalColor;

#ifdef ColorPick
uniform vec3 u_colorId;
layout(location = 1) out vec4 pickColor;
#endif

void main() {

    float perceptualRoughness = u_metallicRoughnessValues.y;
    float metallic = u_metallicRoughnessValues.x;

    #ifdef HAS_METALROUGHNESSMAP
    vec4 mrSample = texture(u_metallicRoughnessSampler, v_uv);
    perceptualRoughness = mrSample.g * perceptualRoughness;
    metallic = mrSample.b * metallic;
    #endif

    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    float alphaRoughness = perceptualRoughness * perceptualRoughness;

    #ifdef HAS_BASECOLORMAP
    vec4 baseColor = SRGBtoLINEAR(texture(u_baseColorSampler, v_uv)) * u_baseColorFactor;
    #else
    vec4 baseColor = u_baseColorFactor;
    #endif
    #ifdef HAS_VERTEXCOLOR
    baseColor.rgb *= v_color.rgb;
    #endif

    float alpha = baseColor.a;
    #ifdef ALPHA_MASK
    if(alpha < u_alphaCutoff){
        discard;
    }
    #endif
    #ifndef ALPHA_BLEND
    alpha = 1.0;
    #endif

    vec3 f0 = vec3(0.04);
    vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
    diffuseColor *= 1.0 - metallic;
    vec3 specularColor = mix(f0, baseColor.rgb, metallic);

    float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    vec3 specularEnvironmentR0 = specularColor.rgb;
    vec3 specularEnvironmentR90 = vec3(1.0) * reflectance90;

    vec3 n = getNormal();
    vec3 v = normalize(u_camPos - v_pos);
    vec3 l = normalize(u_lightDirection);
    vec3 h = normalize(l+v);
    vec3 reflection = -normalize(reflect(v, n));

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = abs(dot(n, v)) + 0.001;
    float NdotH = clamp(dot(n, h), 0.0, 1.0);
    float LdotH = clamp(dot(l, h), 0.0, 1.0);
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    PBRInfo pbrInputs = PBRInfo(
        NdotL,
        NdotV,
        NdotH,
        LdotH,
        VdotH,
        perceptualRoughness,
        metallic,
        specularEnvironmentR0,
        specularEnvironmentR90,
        alphaRoughness,
        diffuseColor,
        specularColor
    );

    vec3 F = specularReflection(pbrInputs);
    float G = geometricOcclusion(pbrInputs);
    float D = microfacetDistribution(pbrInputs);

    vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);
    vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);
    vec3 color = NdotL * u_lightColor * (diffuseContrib + specContrib);

    #ifdef USE_IBL
    color += getIBLContribution(pbrInputs, n, reflection);
    #endif

    #ifdef HAS_OCCLUSIONMAP
    float ao = texture(u_occlusionSampler, v_uv).r;
    color = mix(color, color * ao, u_occlusionFactor);
    #endif

    #ifdef HAS_EMISSIVEMAP
    vec3 emissive = SRGBtoLINEAR(texture(u_emissiveSampler, v_uv)).rgb * u_emissiveFactor;
    color += emissive;
    #endif

    finalColor = vec4(color, alpha);
    #ifdef ColorPick
    pickColor = vec4(u_colorId, 1.0);
    #endif
}
