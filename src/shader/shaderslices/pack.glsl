vec3 packNormal2RGB( const in vec3 normal ) {

    return normalize( normal ) * 0.5 + 0.5;

}

vec3 unpackRGB2Normal( const in vec3 rgb ) {

    return 2.0 * saturate( rgb ).rgb - 1.0;

}
