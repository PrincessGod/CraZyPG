import { id2Color, color2Id } from './FramebufferPicker';
import { readPixcelFromFrameBufferInfo } from '../renderer/framebuffer';

function BufferPicker( gl, models, framebufferInfo, bufferIdx = 1 ) {

    this.gl = gl;
    this.canvas = gl.canvas;
    this.models = models;
    this.bufferIdx = bufferIdx;
    this.framebufferInfo = framebufferInfo;

    this.flag = 0;
    const self = this;
    this.isActive = false;
    this.updateCanvasParam();
    this.mousedown = function () {

        self.flag = 0;

    };
    this.mousemove = function () {

        self.flag = 1;

    };
    this.mouseup = function ( e ) {

        if ( self.flag === 0 && self.isActive ) {

            if ( self.canvas.width !== self.lastCanvasWidth || self.canvas.height !== self.lastCanvasHeight )
                self.updateCanvasParam();

            const x = e.pageX - self.offsetX;
            const y = e.pageY - self.offsetY;
            self.pick( x, y );

        }

    };

    this.canvas.addEventListener( 'mousedown', this.mousedown, false );
    this.canvas.addEventListener( 'mousemove', this.mousemove, false );
    this.canvas.addEventListener( 'mouseup', this.mouseup, false );

}

Object.assign( BufferPicker.prototype, {

    blankColor: id2Color( 0 ),

    id2Color,

    color2Id,

    pick( x, y ) {

        const p = readPixcelFromFrameBufferInfo( this.gl, this.framebufferInfo, x, this.gl.canvas.height - y, this.bufferIdx );
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

        this.canvas.removeEventListener( 'mousedown', this.mousedown, false );
        this.canvas.removeEventListener( 'mousemove', this.mousemove, false );
        this.canvas.removeEventListener( 'mouseup', this.mouseup, false );
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

} );

export { BufferPicker };
