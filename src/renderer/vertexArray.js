import { createAttributesSetters, setAttributes } from './program';

function createVertexArray( gl, bufferInfo, program, attribSetters ) {

    const vao = gl.createVertexArray();
    gl.bindVertexArray( vao );
    setAttributes( attribSetters || createAttributesSetters( gl, program ), bufferInfo.attribs );
    if ( bufferInfo.indices )
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices );

    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    gl.bindVertexArray( null );
    return vao;

}

export { createVertexArray };
