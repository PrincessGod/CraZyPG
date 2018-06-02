import { setAttributes } from './Programs';
import { IndicesKey } from '../core/constant';

const vaosMap = new WeakMap();

function createVao( gl, programs, buffers, vaoInfo ) {

    const { programInfo, bufferInfo } = vaoInfo;
    const { attribSetters } = programInfo;

    const vao = gl.createVertexArray();
    gl.bindVertexArray( vao );

    setAttributes( attribSetters, bufferInfo.attribs );

    if ( bufferInfo[ IndicesKey ] ) {

        const indexBuffer = buffers.update( bufferInfo[ IndicesKey ] ).get( bufferInfo[ IndicesKey ] );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );

    }

    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    gl.bindVertexArray( null );

    return vao;

}

function VertexArrays( gl, programs, buffers ) {

    this._gl = gl;
    this._programs = programs;
    this._buffers = buffers;

}

Object.assign( VertexArrays.prototype, {

    get( vaoInfo ) {

        return vaosMap.get( vaoInfo );

    },

    remove( vaoInfo ) {

        if ( vaosMap.has( vaoInfo ) ) {

            const vao = vaosMap.get( vaoInfo );
            this._gl.deleteVertexArray( vao );
            vaosMap.delete( vaoInfo );

        }

    },

    update( vaoInfo ) {

        if ( ! vaoInfo.needUpdate ) return this;

        if ( vaosMap.has( vaoInfo ) )
            this.remove( vaoInfo );

        vaosMap.set( vaoInfo, createVao( this._gl, this._programs, this._buffers, vaoInfo ) );
        vaoInfo.needUpdate = false; // eslint-disable-line

        return this;

    },

} );

export { VertexArrays };
