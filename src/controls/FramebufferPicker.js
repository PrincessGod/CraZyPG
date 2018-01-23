import { ColorpickShader } from '../shader/ColorpickShader';
import { createFramebufferInfo, bindFramebufferInfo, readPixcelFromFrameBufferInfo, resizeFramebufferInfo } from '../renderer/framebuffer';
import { clear } from '../renderer/webgl';

function id2Color( id ) {

    if ( id >= 0xffffff ) {

        id = 0; // eslint-disable-line
        console.warn( `Color picker models length bigger than max length ${0xffffff - 1}` );

    }

    const a = new Float32Array( 3 );
    a[ 0 ] = ( id & 0xff ) / 255.0;
    a[ 1 ] = ( ( id & 0xff00 ) >> 8 ) / 255.0;
    a[ 2 ] = ( ( id & 0xff0000 ) >> 16 ) / 255.0;
    return a;

}

function color2Id( colorArray ) {

    return colorArray[ 0 ] | ( colorArray[ 1 ] << 8 ) | ( colorArray[ 2 ] << 16 );

}

function FramebufferPicker( gl, camera, controler ) {

    this.gl = gl;
    this.canvas = gl.canvas;
    this.controler = controler;
    this.shader = new ColorpickShader( gl, camera );
    this.models = [];
    this.blankColor = this.id2Color( this.blankId );
    this.framebufferInfo = createFramebufferInfo( gl );
    this.flag = 0;

    this.isActive = false;
    this.updateCanvasParam();

    this.eventListeners = { type: 'mouseleftclick', listener: this.onmouseclick.bind( this ) };

    this.controler.addListeners( this.eventListeners );

}

Object.assign( FramebufferPicker.prototype, {

    blankId: 0,

    maxId: 0xffffff,

    id2Color,

    color2Id,

    addModels( ...models ) {

        if ( this.models.length >= this.maxId - 1 )
            throw new Error( `Color picker models length bigger than max length ${this.maxId - 1}` );

        for ( let i = 0; i < models.length; i ++ )
            if ( Array.isArray( models[ i ] ) )
                this.addModels( ...models[ i ] );
            else
                this.models.push( models[ i ] );

        return this;

    },

    removeModels( ...models ) {

        let index = - 1;

        for ( let i = 0; i < models.length; i ++ )
            if ( Array.isArray( models[ i ] ) )
                this.removeModels( ...models[ i ] );
            else {

                index = this.models.indexOf( models[ i ] );
                if ( index > - 1 )
                    this.models.splice( index, 1 );

            }

        return this;

    },

    clear() {

        bindFramebufferInfo( this.gl, this.framebufferInfo );
        clear( this.gl );
        bindFramebufferInfo( this.gl, null );

        return this;

    },

    render() {

        bindFramebufferInfo( this.gl, this.framebufferInfo );
        this.shader.updateCamera();
        this.models.forEach( ( model, index ) => {

            this.shader.setColor( this.id2Color( index + 1 ) ).renderModel( model );

        } );
        bindFramebufferInfo( this.gl, null );

        return this;

    },

    pick( x, y ) {

        const p = readPixcelFromFrameBufferInfo( this.gl, this.framebufferInfo, x, this.gl.canvas.height - y );
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

    onmouseclick( e ) {

        if ( this.isActive ) {

            const x = e.pageX - this.offsetX;
            const y = e.pageY - this.offsetY;
            this.needPick = true;
            this.pickx = x;
            this.picky = y;

        }

    },

    dispose() {

        this.controler.removeListeners( this.eventListeners );
        return this;

    },

    update() {

        if ( this.needPick ) {

            if ( this.canvas.width !== this.lastCanvasWidth || this.canvas.height !== this.lastCanvasHeight ) {

                this.resizeFramebufferInfo();
                this.updateCanvasParam();

            }
            this.clear().render();
            this.pick( this.pickx, this.picky );
            this.needPick = false;

        }

        return this;

    },

    activate() {

        this.isActive = true;
        this.updateCanvasParam();
        return this;

    },

    deactivate() {

        this.isActive = false;
        return this;

    },

    resizeFramebufferInfo( width, height ) {

        resizeFramebufferInfo( this.gl, this.framebufferInfo, undefined, width, height );
        return this;

    },

} );

export { FramebufferPicker, id2Color, color2Id };
