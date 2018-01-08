vec3 flatnorm(vec3 pos) {
  return normalize(cross(dFdx(pos), dFdy(pos)));
}

#pragma glslify: export(flatnorm)
