    vec4 worldpos = u_modelMat * position;
    vec4 viewpos = u_viewMat * worldpos;
    gl_Position = u_projMat * viewpos;
