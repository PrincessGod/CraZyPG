// key: attrib.interlace || attrib = {data, usage, [{ipdateInfo.needUpdate, updateInfo.offset, offsetInfo.count}]}
const buffersMap = new WeakMap();

function createBufferInfo( gl, info ) {

    const {
        data, usage, target,
    } = info;

    const buffer = gl.createBuffer();
    gl.bindBuffer( target, buffer );
    if ( data )
        gl.bufferData( target, data, usage );

    return buffer;

}

function updateBufferInfo( gl, info, buffer ) {

    const {
        updateInfo, data, usage, target,
    } = info;

    gl.bindBuffer( target, buffer );
    if ( usage === gl.STATIC_DRAW )
        gl.bufferData( target, data, gl.STATIC_DRAW );
    else if ( updateInfo.count === 0 )
        gl.bufferSubData( target, 0, data );
    else {

        gl.bufferSubData(
            target, updateInfo.offset * data.BYTES_PER_ELEMENT,
            data.subArray( updateInfo.offset, updateInfo.offset + updateInfo.count ),
        );
        updateInfo.count = 0;

    }

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
            this._gl.deleteBuffer( value.buffer );
            buffersMap.delete( attrib );


        }

    },

    update( attrib ) {

        if ( ! attrib.needUpdate ) return this;

        const buffer = buffersMap.get( attrib.interlace || attrib );
        if ( buffer === undefined )
            buffersMap.set( ( attrib.interlace || attrib ), createBufferInfo( this._gl, attrib.interlace || attrib ) );
        else
            updateBufferInfo( this._gl, attrib.interlace || attrib, buffer );

        attrib.needUpdate = false // eslint-disable-line

        return this;

    },

} );

export { BufferInfos };
