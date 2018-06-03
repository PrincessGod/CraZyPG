import { States } from './States';
import { BufferInfos } from './BufferInfos';
import { Programs, setUniforms } from './Programs';
import { VertexArrays } from './VertexArrays';
import { DefaultColor } from '../core/constant';

const shaders = new Map();

const enableMap = {

    blend: 'BLEND',
    cullFace: 'CULL_FACE',
    depth: 'DEPTH_TEST',
    polygonOffset: 'POLYGON_OFFSET_FILL',
    sampleBlend: 'SAMPLE_ALPHA_TO_COVERAGE',

};

function getContext( canvasOrId, opts ) {

    let canvas;
    if ( typeof canvasOrId === 'string' )
        canvas = document.getElementById( canvasOrId );
    else if ( canvasOrId instanceof HTMLCanvasElement )
        canvas = canvasOrId;
    else
        throw TypeError( 'renderer expect a Canvas or Canvas\' ID' );

    const names = [ 'webgl2', 'experimental-webgl2' ];
    let context = null;
    for ( let i = 0; i < names.length; i ++ ) {

        context = canvas.getContext( names[ i ], opts );
        if ( context ) {

            console.log( `renderer: ${context.getParameter( context.VERSION ) || names[ i ]}` );
            break;

        }

    }

    if ( ! context )
        throw new Error( 'Please use a browser support WebGL 2.0 (like Chrome), this browser not support WebGL2Context.' );

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

    this.states = new States( this.context );
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

    applyStates( programInfo, material ) {

        Object.keys( enableMap ).forEach( ( key ) => {

            if ( programInfo[ key ] || material[ key ] )
                this.context.enable( this.context[ enableMap[ key ] ] );
            else
                this.context.disable( this.context[ enableMap[ key ] ] );

        } );

    },

    render( model ) {


        const { material, primitive } = model;

        let shader;
        if ( shaders.has( material.ShaderType ) )
            shader = shaders.get( material.ShaderType );
        else {

            shader = new material.ShaderType();
            shaders.set( material.ShaderType, shader );

        }

        const { programInfo } = shader;
        const { vaoInfo, start } = primitive;
        const { bufferInfo } = vaoInfo;

        primitive.updateVaoInfo( programInfo );
        this.programs.update( programInfo );
        this.vaos.update( vaoInfo );

        const vao = this.vaos.get( vaoInfo );
        const program = this.programs.get( programInfo );
        const { uniformSetters } = programInfo;

        this.context.useProgram( program );
        this.applyStates( programInfo, material );
        shader.setUniformObj( material.uniformObj );
        setUniforms( uniformSetters, shader.uniformObj );
        this.context.bindVertexArray( vao );

        const { drawMode, instanceCount } = material;
        const { indices, numElements, elementType } = bufferInfo;
        const isIndexed = ( indices || elementType );
        const drawFun = `draw${isIndexed ? 'Elements' : 'Arrays'}${( typeof instanceCount === 'number' ) ? 'Instanced' : ''}`;

        if ( isIndexed )
            this.context[ drawFun ]( drawMode, numElements, elementType, start, instanceCount );
        else
            this.context[ drawFun ]( drawMode, start, numElements, instanceCount );

        this.context.bindVertexArray( null );

        return this;

    },

} );

export { WebGLRenderer };
