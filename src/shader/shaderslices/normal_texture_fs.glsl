    #ifdef HAS_NORMALTEXTURE

        normal = perturbNormal2Arb( v_worldpos.xyz, normal );

    #elif defined( HAS_BUMPTEXTURE )

        normal = perturbNormalArb( v_worldpos.xyz, normal, dHdxy_fwd() );

    #endif
