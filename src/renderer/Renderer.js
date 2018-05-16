import { getContext, clear, resizeCanvasToDisplaySize } from './webgl';

function Renderer( canvasOrId, opts ) {

    this.context = getContext( canvasOrId, opts );
    this.canvas = this.context.canvas;
    this.multiplier = 1.0;

    this.context.cullFace( this.context.BACK );
    this.context.frontFace( this.context.CCW );
    this.context.enable( this.context.CULL_FACE );
    this.context.enable( this.context.DEPTH_TEST );
    this.context.depthFunc( this.context.LEQUAL );
    this.context.blendFunc( this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA );

}

Object.assign( Renderer.prototype, {

    clear( ...args ) {

        if ( Array.isArray( args[ 0 ] ) )
            clear( this.context, ...args[ 0 ] );
        else
            clear( this.context, ...args );

        return this;

    },

    setSize( width, height ) {

        this.canvas.style.width = width;
        this.canvas.style.height = height;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.context.viewport( 0, 0, this.canvas.width, this.canvas.height );
        return this;

    },

    fixCanvasToDisplay( multiplier, updateViewport = true ) {

        if ( typeof multiplier === 'number' && multiplier > 0 && this.multiplier !== multiplier )
            this.multiplier = multiplier;

        if ( resizeCanvasToDisplaySize( this.canvas, this.multiplier ) ) {

            if ( updateViewport )
                this.context.viewport( 0, 0, this.canvas.width, this.canvas.height );
            return true;

        }

        return false;

    },

} );

export { Renderer };
