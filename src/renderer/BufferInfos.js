import { getGLTypeFromTypedArray } from '../core/typedArray';

// key: attrib.interlace || attrib = {data, usage, [{ipdateInfo.needUpdate, updateInfo.offset, offsetInfo.count}]}
const buffersMap = new WeakMap();

function createBufferInfo( gl, info, target ) {

    const {
        data, usage,
    } = info;

    const type = getGLTypeFromTypedArray( data );
    const buffer = gl.createBuffer();
    gl.bindBuffer( target, buffer );
    if ( data )
        gl.bufferData( target, data, usage );

    return {
        type,
        buffer,
        bytesPerElement: data.BYTES_PER_ELEMENT,
    };

}

function updateBufferInfo( gl, info, buffer, target ) {

    const { updateInfo, data, usage } = info;

    if ( ! updateInfo.needUpdate ) return;

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

    update( attrib, target ) {

        const value = buffersMap.get( attrib.interlace || attrib );
        if ( value === undefined )
            buffersMap.set( ( attrib.interlace || attrib ), createBufferInfo( this._gl, attrib.interlace || attrib, target ) );
        else
            updateBufferInfo( this._gl, attrib.interlace || attrib, value.buffer, target );

    },

} );

export { BufferInfos };
