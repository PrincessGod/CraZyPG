in vec3 a_position;

#ifdef HAS_UV

    in vec3 a_uv;

#endif

#ifdef HAS_NORMAL

    in vec3 a_normal;

#endif

#ifdef HAS_COLOR

    in vec4 a_color;

#endif

#ifdef HAS_SKIN

    in vec4 a_joint;
    in vec4 a_weight;

#endif

// max targets num is 8 when position only, 4 when has normal
#if defined( HAS_MORPH ) && MORPH_TARGET_NUM

    uniform float u_morphWeights[ MORPH_TARGET_NUM ];

    #ifdef HAS_MORPH_POSITION

        in vec3 a_morphPosition0;

        #if MORPH_TARGET_NUM > 1

            in vec3 a_morphPosition1;

        #endif

        #if MORPH_TARGET_NUM > 2

            in vec3 a_morphPosition2;

        #endif

        #if MORPH_TARGET_NUM > 3

            in vec3 a_morphPosition3;

        #endif

        #if MORPH_TARGET_NUM > 4

            in vec3 a_morphPosition4;

        #endif

        #if MORPH_TARGET_NUM > 5

            in vec3 a_morphPosition5;

        #endif

        #if MORPH_TARGET_NUM > 6

            in vec3 a_morphPosition6;

        #endif

        #if MORPH_TARGET_NUM > 7

            in vec3 a_morphPosition7;

        #endif

    #endif

    #ifdef HAS_MORPH_NORMAL

        in vec3 a_morphNromal0;

        #if MORPH_TARGET_NUM > 1

            in vec3 a_morphNromal1;

        #endif

        #if MORPH_TARGET_NUM > 2

            in vec3 a_morphNromal2;

        #endif

        #if MORPH_TARGET_NUM > 3

            in vec3 a_morphNromal3;

        #endif

    #endif

#endif

uniform mat4 u_modelMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform mat4 u_mvpMat;
uniform mat4 u_mvMat;
uniform mat3 u_normMat;
uniform vec3 u_camPos;
