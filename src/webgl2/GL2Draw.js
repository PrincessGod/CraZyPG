import * as GL2 from './GL2';

export class GL2Draw {

    constructor( drawFunc, mode = GL2.TRIANGLES, count, type, instanceCount, first = 0, offset = 0 ) {

        this.mode = mode;
        this.type = type;
        this.first = first;
        this.count = count;
        this.offset = offset;
        this.drawFunc = drawFunc;
        this.instanceCount = instanceCount;

        this.updateCallQueue = [];

    }

    // void gl.drawArrays(mode, first, count);
    // void gl.drawElements(mode, count, type, offset);
    // void gl.drawArraysInstanced(mode, first, count, instanceCount);
    // void gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
    static draw( gl2draw ) {

        const { drawFunc, mode, first, offset, count, type, instanceCount } = gl2draw;

        if ( drawFunc === 'drawArrays' || drawFunc === 'drawArraysInstanced' )
            gl2draw.updateCallQueue.push( {
                api: drawFunc, args: [ mode, first, count, instanceCount ], source: 'GL2Draw.drawArrays'
            } );
        else if ( drawFunc === 'drawElements' || drawFunc === 'drawElementsInstanced' )
            gl2draw.updateCallQueue.push( {
                api: drawFunc, args: [ mode, count, type, offset, instanceCount ], source: 'GL2Draw.drawArrays'
            } );

        return GL2Draw;

    }

}
