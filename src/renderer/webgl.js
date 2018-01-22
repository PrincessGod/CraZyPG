function getContext( canvasOrId, opts ) {

    let canvas;
    if ( typeof canvasOrId === 'string' )
        canvas = document.getElementById( canvasOrId );
    else
        canvas = canvasOrId;

    const names = [ 'webgl2', 'webgl', 'experimental-webgl' ];
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

function clear( gl, r = 1.0, g = 1.0, b = 1.0, a = 1.0 ) {

    gl.clearColor( r, g, b, a );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

}

export { getContext, resizeCanvasToDisplaySize, clear };
