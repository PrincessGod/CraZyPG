import { getGLTypeFromTypedArray } from '../core/typedArray';

// key: attrib.interlace || attrib = {data, bufferUsage, [{ipdateInfo.needUpdate, updateInfo.offset, offsetInfo.count}]}
const buffersMap = new WeakMap();

function createBufferInfo( gl, info, bufferTarget ) {

    const {
        data, bufferUsage,
    } = info;

    const type = getGLTypeFromTypedArray( data );
    const buffer = gl.createBuffer();
    gl.bindBuffer( bufferTarget, buffer );
    if ( data )
        gl.bufferData( bufferTarget, data, bufferUsage );

    return {
        type,
        buffer,
        bytesPerElement: data.BYTES_PER_ELEMENT,
    };

}

function updateBufferInfo( gl, info, buffer, bufferTarget ) {

    const { updateInfo, data, bufferUsage } = info;

    if ( ! updateInfo.needUpdate ) return;

    gl.bindBuffer( bufferTarget, buffer );
    if ( bufferUsage === gl.STATIC_DRAW )
        gl.bufferData( bufferTarget, data, gl.STATIC_DRAW );
    else if ( updateInfo.count === 0 )
        gl.bufferSubData( bufferTarget, 0, data );
    else {

        gl.bufferSubData(
            bufferTarget, updateInfo.offset * data.BYTES_PER_ELEMENT,
            data.subArray( updateInfo.offset, updateInfo.offset + updateInfo.count ),
        );
        updateInfo.count = 0;

    }

    updateInfo.needUpdate = false;

}

function BufferInfos( gl ) {

    this._gl = gl;

}

Object.assign( BufferInfos.prototype, {

    get( attrib ) {

        return buffersMap.get( attrib.interlace || attrib );

    },

    remove( attrib ) {

        if ( buffersMap.has( attrib.interlace || attrib ) ) {

            const value = buffersMap.get( attrib.interlace || attrib );
            if ( value ) {

                this._gl.deleteBuffer( value.buffer );
                buffersMap.delete( attrib );

            }

        }

    },

    update( attrib, bufferTarget ) {

        const value = buffersMap.get( attrib.interlace || attrib );
        if ( value === undefined )
            buffersMap.set( ( attrib.interlace || attrib ), createBufferInfo( this._gl, attrib.interlace || attrib, bufferTarget ) );
        else
            updateBufferInfo( this._gl, attrib.interlace || attrib, value.buffer, bufferTarget );

    },

} );

export { BufferInfos };
