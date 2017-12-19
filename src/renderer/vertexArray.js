import { setAttributes } from './program';

function createVertexArray( gl, bufferInfo ) {

    const vao = gl.createVertexArray();
    gl.bindVertexArray( vao );
    setAttributes( gl, bufferInfo.attribs );
    if ( bufferInfo.indices )
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices );

}

export { createVertexArray };
