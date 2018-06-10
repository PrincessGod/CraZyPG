    #ifdef HAS_SKIN

        mat4 skinMatrix =
            a_weight.x * u_jointMatrix[int(a_joint.x)] +
            a_weight.y * u_jointMatrix[int(a_joint.y)] +
            a_weight.z * u_jointMatrix[int(a_joint.z)] +
            a_weight.w * u_jointMatrix[int(a_joint.w)];

        position = skinMatrix * position;

        #ifdef HAS_NORMAL

            normal = transpose( inverse( mat3( skinMatrix ) ) ) * normal;

        #endif

    #endif
