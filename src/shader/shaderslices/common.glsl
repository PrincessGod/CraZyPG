struct IncidentLight {
    vec3 color;
    vec3 direction;
    bool visible;
};

struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};
