function isWebgl2( gl ) {

    return !! gl.texStorage2D;

}

export { isWebgl2 };
