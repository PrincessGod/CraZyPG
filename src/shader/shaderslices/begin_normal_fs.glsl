    #if ! defined( HAS_NORMAL )

        vec3 fdx = vec3( dFdx( v_worldpos.x ), dFdx( v_worldpos.y ), dFdx( v_worldpos.z ) );
        vec3 fdy = vec3( dFdy( v_worldpos.x ), dFdy( v_worldpos.y ), dFdy( v_worldpos.z ) );
        vec3 normal = normalize( cross( fdx, fdy ) );

    #else

        vec3 normal = normalize( v_normal );

        #ifdef DOUBLE_SIDE

            normal *= float( gl_FrontFacing ) * 2.0 - 1.0;

        #endif

    #endif
