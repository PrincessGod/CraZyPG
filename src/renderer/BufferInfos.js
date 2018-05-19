function BufferInfos( gl ) {

    // key: attrib.interlace || attrib = {data, type, bufferUsage, [{ipdateInfo.needUpdate, updateInfo.offset, offsetInfo.count}]}
    const buffersMap = new WeakMap();

    function createBufferInfo( info, bufferTarget ) {

        const {
            data, type, bufferUsage,
        } = info;

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

    function updateBufferInfo( info, buffer, bufferTarget ) {

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

    function get( attrib ) {

        return buffersMap.get( attrib.interlace || attrib );

    }

    function remove( attrib ) {

        if ( buffersMap.has( attrib.interlace || attrib ) ) {

            const value = buffersMap.get( attrib.interlace || attrib );
            if ( value ) {

                gl.deleteBuffer( value.buffer );
                buffersMap.delete( attrib );

            }

        }

    }

    function update( attrib, bufferTarget ) {

        const value = buffersMap.get( attrib.interlace || attrib );
        if ( value === undefined )
            buffersMap.set( ( attrib.interlace || attrib ), createBufferInfo( attrib.interlace || attrib, bufferTarget ) );
        else
            updateBufferInfo( value.buffer, attrib.interlace || attrib, bufferTarget );

    }

    return { get, remove, update };

}

export { BufferInfos };
