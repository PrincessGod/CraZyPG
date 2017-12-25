import { getContext, clear, resizeCanvasToDisplaySize } from './webgl';

class Renderer {

    constructor( canvasId ) {

        this.context = getContext( canvasId );
        this.canvas = this.context.canvas;
        this.multiplier = 1.0;

        this.context.cullFace( this.context.BACK );
        this.context.frontFace( this.context.CCW );
        this.context.enable( this.context.CULL_FACE );
        this.context.enable( this.context.DEPTH_TEST );
        this.context.depthFunc( this.context.LEQUAL );
        this.context.blendFunc( this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA );

    }

    clear( r, g, b, a ) {

        if ( Array.isArray( r ) ) {

            if ( r.length === 3 ) {

                clear( this.context, r[ 0 ], r[ 1 ], r[ 2 ], 1.0 );
                return this;

            }
            if ( r.length === 4 ) {

                clear( this.context, r[ 0 ], r[ 1 ], r[ 2 ], r[ 3 ] );
                return this;

            }

        }

        clear( this.context, r, g, b, a );
        return this;

    }

    setSize( width, height ) {

        this.canvas.style.width = width;
        this.canvas.style.height = height;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.context.viewport( 0, 0, this.canvas.width, this.canvas.height );
        return this;

    }

    fixCanvasToDisplay( multiplier ) {

        if ( typeof multiplier === 'number' && multiplier > 0 && this.multiplier !== multiplier )
            this.multiplier = multiplier;

        if ( resizeCanvasToDisplaySize( this.canvas, this.multiplier ) )
            this.context.viewport( 0, 0, this.canvas.width, this.canvas.height );

        return this;

    }

}
