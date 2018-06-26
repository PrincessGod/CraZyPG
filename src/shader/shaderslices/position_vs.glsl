    vec4 worldpos = u_modelMat * position;
    gl_Position = u_projMat * u_viewMat * worldpos;
