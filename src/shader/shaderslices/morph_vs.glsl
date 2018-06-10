    #if defined( HAS_MORPH ) && MORPH_TARGET_NUM

        #ifdef HAS_MORPH_POSITION

            position.xyz += u_morphWeights[0] * a_morphPosition0;

            #if MORPH_TARGET_NUM > 1

                position.xyz += u_morphWeights[1] * a_morphPosition1;

            #endif

            #if MORPH_TARGET_NUM > 2

                position.xyz += u_morphWeights[2] * a_morphPosition2;

            #endif

            #if MORPH_TARGET_NUM > 3

                position.xyz += u_morphWeights[3] * a_morphPosition3;

            #endif

            #if MORPH_TARGET_NUM > 4

                position.xyz += u_morphWeights[4] * a_morphPosition4;

            #endif

            #if MORPH_TARGET_NUM > 5

                position.xyz += u_morphWeights[5] * a_morphPosition5;

            #endif

            #if MORPH_TARGET_NUM > 6

                position.xyz += u_morphWeights[6] * a_morphPosition6;

            #endif

            #if MORPH_TARGET_NUM > 7

                position.xyz += u_morphWeights[7] * a_morphPosition7;

            #endif

        #endif

        #if  defined( HAS_NORMAL ) && defined( HAS_MORPH_NORMAL )

            normal += u_morphWeights[0] * a_morphNromal0;

            #if MORPH_TARGET_NUM > 1

                normal += u_morphWeights[1] * a_morphNromal1;

            #endif

            #if MORPH_TARGET_NUM > 2

                normal += u_morphWeights[2] * a_morphNromal2;

            #endif

            #if MORPH_TARGET_NUM > 3

                normal += u_morphWeights[3] * a_morphNromal3;

            #endif

        #endif

    #endif
