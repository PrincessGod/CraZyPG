import { id2Color, color2Id } from './FramebufferPicker';
import { readPixcelFromFrameBufferInfo } from '../renderer/framebuffer';

function BufferPicker( gl, models, framebufferInfo, controler, bufferIdx = 1 ) {

    this.gl = gl;
    this.canvas = gl.canvas;
    this.models = models;
    this.bufferIdx = bufferIdx;
    this.framebufferInfo = framebufferInfo;
    this.controler = controler;
    this.eventListeners = { type: 'mouseleftclick', listener: this.onmouseclick.bind( this ) };
    this.controler.addListeners( this.eventListeners );

    this.isActive = false;
    this.updateCanvasParam();

}

Object.assign( BufferPicker.prototype, {

    blankColor: id2Color( 0 ),

    id2Color,

    color2Id,

    pick( x, y ) {

        const ratio = this.framebufferInfo.width / this.canvas.clientWidth;
        const p = readPixcelFromFrameBufferInfo( this.gl, this.framebufferInfo, x * ratio, this.gl.canvas.height - y * ratio, this.bufferIdx );
        const id = this.color2Id( p );
        console.log( x, y, p, id, this.models[ id - 1 ] );

    },

    updateCanvasParam() {

        const box = this.canvas.getBoundingClientRect();
        this.offsetX = box.left;
        this.offsetY = box.top;
        this.lastCanvasWidth = this.canvas.width;
        this.lastCanvasHeight = this.canvas.height;
        return this;

    },

    dispose() {

        this.controler.removeListeners( this.eventListeners );
        return this;

    },

    setActivate( activate ) {

        if ( activate ) {

            this.isActive = true;
            this.updateCanvasParam();

        } else
            this.isActive = false;

        return this;

    },

    onmouseclick( e ) {

        if ( this.isActive ) {

            if ( this.canvas.width !== this.lastCanvasWidth || this.canvas.height !== this.lastCanvasHeight )
                this.updateCanvasParam();

            const x = e.pageX - this.offsetX;
            const y = e.pageY - this.offsetY;
            this.pick( x, y );

        }

    },

} );

export { BufferPicker };
