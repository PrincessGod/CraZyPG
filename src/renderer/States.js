
function _h( f, c ) {

    return function ( ...args ) {

        let res;
        if ( ! c.apply( this, args ) )
            res = f.apply( this, args );
        return res;

    };

}

const cache = {

    enable: {},
    uniform1f: {},
    pixelStorei: {},
    bufferDataArrayUsage: {},
    bufferDataArraySizeOrData: {},
    bufferDataElementArrayUsage: {},
    bufferDataElementArraySizeOrData: {},

};

function States( gl ) {

    const pixelStorei = _h( gl.pixelStorei, ( pname, param ) => {

        const cached = ( cache.pixelStorei[ pname ] === param );
        cache.pixelStorei[ pname ] = param;
        return cached;

    } ).bind( gl );

    const enable = _h( gl.enable, ( cap ) => {

        const cached = ( cache.enable[ cap ] === true );
        cache.enable[ cap ] = true;
        return cached;

    } ).bind( gl );

    const disable = _h( gl.disable, ( cap ) => {

        const cached = ( cache.disable[ cap ] === false );
        cache.disable[ cap ] = false;
        return cached;

    } ).bind( gl );

    const useProgram = _h( gl.useProgram, ( program ) => {

        const cached = ( cache.usingProgram === program );
        cache.usingProgram = program;
        return cached;

    } ).bind( gl );

    const bindBuffer = _h( gl.bindBuffer, ( target, buffer ) => {

        let cached;

        switch ( target ) {

        case gl.ARRAY_BUFFER:
            cached = ( cache.bindBufferTargetArray === buffer );
            cache.bindBufferTargetArray = buffer;
            break;
        case gl.ELEMENT_ARRAY_BUFFER:
            cached = ( cache.bindBufferTargetElementArray === buffer );
            cache.bindBufferTargetElementArray = buffer;
            break;
        default:
            break;

        }

        return cached;


    } ).bind( gl );

    const bindRenderbuffer = _h( gl.bindRenderbuffer, ( target, buffer ) => {

        const cached = ( cache.bindRenderbufferTarget === target ) && ( cache.bindRenderbufferBuffer === buffer );
        cache.bindRenderbufferTarget = target;
        cache.bindRenderbufferBuffer = buffer;
        return cached;

    } ).bind( gl );

    const bindFramebuffer = _h( gl.bindFramebuffer, ( target, framebuffer ) => {

        const cached = ( cache.bindFramebufferTarget === target ) && ( cache.bindFramebufferFramebuffer === framebuffer );
        cache.bindFramebufferTarget = target;
        cache.bindFramebufferFramebuffer = framebuffer;
        return cached;

    } ).bind( gl );

    const bindTexture = _h( gl.bindTexture, ( target, texture ) => {

        let cached;

        switch ( target ) {

        case gl.TEXTURE_2D:
            cached = ( cache.bindTexture2D === texture );
            cache.bindTexture2D = texture;
            break;
        case gl.TEXTURE_CUBE_MAP:
            cached = ( cache.bindTextureCubeMap === texture );
            cache.bindTextureCubeMap = texture;
            break;
        default:
            break;

        }

        return cached;

    } ).bind( gl );

    const activeTexture = _h( gl.activeTexture, ( texture ) => {

        const cached = ( cache.activeTexture === texture );
        cache.activeTexture = texture;
        return cached;

    } ).bind( gl );

    const viewport = _h( gl.viewport, ( x, y, w, h ) => {

        const cached = ( cache.viewportX === x ) && ( cache.viewportY === y ) && ( cache.viewportW === w ) && ( cache.viewportH === h );

        cache.viewportX = x;
        cache.viewportY = y;
        cache.viewportW = w;
        cache.viewportH = h;

        return cached;

    } ).bind( gl );

    const blendEquation = _h( gl.blendEquation, ( mode ) => {

        const cached = ( cache.blendEquation === mode );
        cache.blendEquation = mode;
        return cached;

    } ).bind( gl );

    const scissor = _h( gl.scissor, ( x, y, w, h ) => {

        const cached = ( cache.scissorX === x ) && ( cache.scissorY === y ) && ( cache.scissorW === w ) && ( cache.scissorH === h );

        cache.scissorX = x;
        cache.scissorY = y;
        cache.scissorW = w;
        cache.scissorH = h;

        return cached;

    } ).bind( gl );

    const depthRange = _h( gl.depthRange, ( near, far ) => {

        const cached = cache.depthRangeNear === near && cache.depthRangeFar === far;
        cache.depthRangeNear = near;
        cache.depthRangeFar = far;

        return cached;

    } ).bind( gl );

    const cullFace = _h( gl.cullFace, ( mode ) => {

        const cached = cache.cullFaceMode === mode;
        cache.cullFaceMode = mode;

        return cached;

    } ).bind( gl );

    const frontFace = _h( gl.frontFace, ( mode ) => {

        const cached = cache.frontFaceMode === mode;
        cache.frontFaceMode = mode;

        return cached;

    } ).bind( gl );

    const lineWidth = _h( gl.lineWidth, ( width ) => {

        const cached = cache.lineWidthWidth === width;
        cache.lineWidthWidth = width;

        return cached;

    } ).bind( gl );

    const polygonOffset = _h( gl.polygonOffset, ( factor, units ) => {

        const cached = cache.polygonOffsetFactor === factor && cache.polygonOffsetUnits === units;
        cache.polygonOffsetFactor = factor;
        cache.polygonOffsetUnits = units;

        return cached;

    } ).bind( gl );

    const disableVertexAttribArray = _h( gl.disableVertexAttribArray, ( index ) => {

        const cached = ( cache.disableVertexAttribArrayIndex === index );
        cache.disableVertexAttribArray = index;
        return cached;

    } ).bind( gl );

    const enableVertexAttribArray = _h( gl.enableVertexAttribArray, ( index ) => {

        const cached = ( cache.enableVertexAttribArrayIndex === index );
        cache.enableVertexAttribArray = index;
        return cached;

    } ).bind( gl );

    Object.assign( gl, {
        enable,
        disable,
        useProgram,
        bindBuffer,
        bindRenderbuffer,
        bindFramebuffer,
        bindTexture,
        activeTexture,
        viewport,
        blendEquation,
        scissor,
        depthRange,
        cullFace,
        frontFace,
        lineWidth,
        pixelStorei,
        polygonOffset,
        disableVertexAttribArray,
        enableVertexAttribArray,
    } );

}

export { States };
