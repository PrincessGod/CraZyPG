    #ifdef HAS_NORMALTEXTURE

        normal = perturbNormal2Arb( vec3( v_worldpos.xyz - u_viewMat[ 3 ].xyz ), normal );

    #endif
