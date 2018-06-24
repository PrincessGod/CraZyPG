    vec4 mvPosition = u_mvMat * position;
    gl_Position = u_projMat * mvPosition;
