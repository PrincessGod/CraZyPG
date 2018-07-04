#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define EPSILON 1e-6
#define LOG2 1.442695

#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )

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

struct GeometricContext {

	vec3 position;
	vec3 normal;
	vec3 viewDir;

};
