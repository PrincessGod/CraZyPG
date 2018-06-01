import { BufferInfos } from './BufferInfos';
import { Programs, setUniforms } from './Programs';
import { VertexArrays } from './VertexArrays';
import { DefaultColor } from '../core/constant';

function getContext( canvasOrId, opts ) {

    let canvas;
    if ( typeof canvasOrId === 'string' )
        canvas = document.getElementById( canvasOrId );
    else
        canvas = canvasOrId;

    const names = [ 'webgl2', 'experimental-webgl2', 'webgl', 'experimental-webgl' ];
    let context = null;
    for ( let i = 0; i < names.length; i ++ ) {

        context = canvas.getContext( names[ i ], opts );
        if ( context ) {

            console.log( `renderer: ${context.getParameter( context.VERSION ) || names[ i ]}` );
            break;

        }

    }

    if ( ! context )
        throw new Error( 'Please use a decent browser, this browser not support WebglContext.' );

    return context;

}

function resizeCanvasToDisplaySize( canvas, multiplier ) {

    let mult = multiplier || 1;
    mult = Math.max( 0, mult );
    const width = canvas.clientWidth * mult | 0;
    const height = canvas.clientHeight * mult | 0;
    if ( canvas.width !== width || canvas.height !== height ) {

        canvas.width = width; // eslint-disable-line
        canvas.height = height; // eslint-disable-line
        return true;

    }
    return false;

}

function clear(
    gl,
    r = DefaultColor.BackgroundNormalized[ 0 ],
    g = DefaultColor.BackgroundNormalized[ 1 ],
    b = DefaultColor.BackgroundNormalized[ 2 ],
    a = DefaultColor.BackgroundNormalized[ 3 ],
) {

    gl.clearColor( r, g, b, a );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

}

function WebGLRenderer( canvasOrId, opts ) {

    this.context = getContext( canvasOrId, opts );
    this.canvas = this.context.canvas;
    this.multiplier = 1.0;

    this.context.cullFace( this.context.BACK );
    this.context.frontFace( this.context.CCW );
    this.context.enable( this.context.CULL_FACE );
    this.context.enable( this.context.DEPTH_TEST );
    this.context.depthFunc( this.context.LEQUAL );
    this.context.blendFunc( this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA );

    this.buffers = new BufferInfos( this.context );
    this.programs = new Programs( this.context, this.buffers );
    this.vaos = new VertexArrays( this.context, this.programs, this.buffers );

}

Object.assign( WebGLRenderer.prototype, {

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

    render( programInfo, model ) {

        const { primitive, instanceCount } = model;
        const { vaoInfo } = primitive;
        if ( vaoInfo.programInfo !== programInfo )
            primitive.updateVaoInfo( programInfo );
        const { bufferInfo } = vaoInfo;
        const vao = this.vaos.update( vaoInfo ).get( vaoInfo );
        const { program, uniformSetters } = this.programs.update( programInfo ).get( programInfo );
        this.context.useProgram( program );
        setUniforms( uniformSetters, model.uniformObj );
        this.context.bindVertexArray( vao );

        if ( bufferInfo.indices || bufferInfo.elementType )
            if ( typeof instanceCount === 'number' )
                this.context.drawElementsInstanced( model.drawMode, bufferInfo.numElements, bufferInfo.elementType, primitive.offset, instanceCount );
            else
                this.context.drawElements( model.drawMode, bufferInfo.numElements, bufferInfo.elementType, primitive.offset ); // eslint-disable-line
        else
        /* eslint-disable */ // eslint bug
            if ( typeof instanceCount === 'number' )
                this.context.drawArraysInstanced( model.drawMode, primitive.offset, bufferInfo.numElements, instanceCount );
            else
                this.context.drawArrays( model.drawMode, primitive.offset, bufferInfo.numElements );
        /* eslint-enable */
        this.context.bindVertexArray( null );

        return this;

    },

} );

export { WebGLRenderer };
