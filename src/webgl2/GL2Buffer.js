import * as GL2 from './GL2';

export class GL2Buffer {

    constructor( usage = GL2.STATIC_DRAW, target = GL2.ARRAY_BUFFER ) {

        this.usage = usage;
        this.target = target;
        this.offset = null;
        this.updateCallQueue = [];

    }

    // void gl.bufferData(target, size, usage);
    // void gl.bufferData(target, ArrayBuffer? srcData, usage);
    // void gl.bufferData(target, ArrayBufferView srcData, usage);
    static updateData( gl2buffer, data, usage = gl2buffer.usage ) {

        const { target } = gl2buffer;

        gl2buffer.usage = usage;
        gl2buffer.updateCallQueue.push(
            { api: 'bufferData', args: [ target, data, usage ], source: 'GL2Buffer.updateData' }
        );

        return GL2Buffer;

    }

    // void gl.bufferSubData(target, offset, ArrayBuffer srcData);
    // void gl.bufferSubData(target, offset, ArrayBufferView srcData);
    static updateSubData( gl2buffer, srcData, offset = gl2buffer.offset ) {

        const { target } = gl2buffer;

        gl2buffer.offset = offset;
        gl2buffer.updateCallQueue.push(
            { api: 'bufferSubData', args: [ target, offset, srcData ], source: 'GL2Buffer.updateSubData' }
        );

        return GL2Buffer;

    }

}
