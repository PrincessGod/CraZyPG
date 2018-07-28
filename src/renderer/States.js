
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
    colorMask: {},
    blendColor: {},
    pixelStorei: {},
    blendFuncSeparate: {},
    bufferDataArrayUsage: {},
    blendEquationSeparate: {},
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

        const cached = ( cache.enable[ cap ] === false );
        cache.enable[ cap ] = false;
        return cached;

    } ).bind( gl );

    const useProgram = _h( gl.useProgram, ( program ) => {

        const cached = ( cache.usingProgram === program );
        cache.usingProgram = program;
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

    const blendColor = _h( gl.blendColor, ( r, g, b, a ) => {

        const cached = ( cache.blendColor.r === r && cache.blendColor.g === g && cache.blendColor.b === b && cache.blendColor.a === a );
        Object.assign( cache.blendColor, {
            r, g, b, a,
        } );
        return cached;

    } ).bind( gl );

    const blendEquationSeparate = _h( gl.blendEquationSeparate, ( modeRGB, modeAlpha ) => {

        const cached = ( cache.blendEquationSeparate.modeRGB === modeRGB && cache.blendEquationSeparate.modeAlpha === modeAlpha );
        Object.assign( cache.blendEquationSeparate, {
            modeRGB, modeAlpha,
        } );
        return cached;

    } ).bind( gl );

    const blendFuncSeparate = _h( gl.blendFuncSeparate, ( srcRGB, dstRGB, srcAlpha, dstAlpha ) => {

        const cached = ( cache.blendFuncSeparate.srcRGB === srcRGB && cache.blendFuncSeparate.dstRGB === dstRGB && cache.blendFuncSeparate.srcAlpha === srcAlpha && cache.blendFuncSeparate.dstAlpha === dstAlpha );
        Object.assign( cache.blendFuncSeparate, {
            srcRGB, dstRGB, srcAlpha, dstAlpha,
        } );
        return cached;

    } ).bind( gl );

    const colorMask = _h( gl.colorMask, ( r, g, b, a ) => {

        const cached = ( cache.colorMask.r === r && cache.colorMask.g === g && cache.colorMask.b === b && cache.colorMask.a === a );
        Object.assign( cache.colorMask, {
            r, g, b, a,
        } );
        return cached;

    } ).bind( gl );

    const depthFunc = _h( gl.depthFunc, ( func ) => {

        const cached = ( cache.depthFuncFunc === func );
        cache.depthFuncFunc = func;
        return cached;

    } ).bind( gl );

    const depthMask = _h( gl.depthMask, ( v ) => {

        const cached = ( cache.depthMaskEnable === v );
        cache.depthMaskEnable = v;
        return cached;

    } ).bind( gl );

    Object.assign( gl, {
        enable,
        disable,
        useProgram,
        bindRenderbuffer,
        bindFramebuffer,
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
        blendColor,
        blendEquationSeparate,
        blendFuncSeparate,
        colorMask,
        depthFunc,
        depthMask,
    } );

}

export { States };
