#ifdef HAS_ENVTEXTURE

    #if defined( HAS_BUMPTEXTURE ) || defined( HAS_NORMALTEXTURE ) || defined( PHONG )

        out vec3 v_worldPos;

    #else

        out vec3 v_reflect;
        uniform float u_refractionRatio;

    #endif

#endif
