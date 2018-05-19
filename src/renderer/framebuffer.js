import { createTexture, resizeTexture } from './texture';

const UNSIGNED_BYTE = 0x1401;

/* PixelFormat */
const DEPTH_COMPONENT = 0x1902;
const RGBA = 0x1908;

/* Framebuffer Object. */
const RGBA4 = 0x8056;
const RGB5_A1 = 0x8057;
const RGB565 = 0x8D62;

const DEPTH_COMPONENT16 = 0x81A5;
const STENCIL_INDEX = 0x1901;
const STENCIL_INDEX8 = 0x8D48;
const DEPTH_STENCIL = 0x84F9;

const DEPTH_ATTACHMENT = 0x8D00;
const STENCIL_ATTACHMENT = 0x8D20;
const DEPTH_STENCIL_ATTACHMENT = 0x821A;

/* TextureWrapMode */
const CLAMP_TO_EDGE = 0x812F;

/* TextureMagFilter */
const LINEAR = 0x2601;

const defaultAttachment = [
    {
        format: RGBA, type: UNSIGNED_BYTE, min: LINEAR, wrap: CLAMP_TO_EDGE,
    },
    { format: DEPTH_STENCIL },
];

const attachmentsByFormat = {};
attachmentsByFormat[ DEPTH_STENCIL ] = DEPTH_STENCIL_ATTACHMENT;
attachmentsByFormat[ STENCIL_INDEX ] = STENCIL_ATTACHMENT;
attachmentsByFormat[ STENCIL_INDEX8 ] = STENCIL_ATTACHMENT;
attachmentsByFormat[ DEPTH_COMPONENT ] = DEPTH_ATTACHMENT;
attachmentsByFormat[ DEPTH_COMPONENT16 ] = DEPTH_ATTACHMENT;

function getAttachmentPointForFormat( format ) {

    return attachmentsByFormat[ format ];

}

const renderbufferFormats = {};
renderbufferFormats[ RGBA4 ] = true;
renderbufferFormats[ RGB5_A1 ] = true;
renderbufferFormats[ RGB565 ] = true;
renderbufferFormats[ DEPTH_STENCIL ] = true;
renderbufferFormats[ DEPTH_COMPONENT16 ] = true;
renderbufferFormats[ STENCIL_INDEX ] = true;
renderbufferFormats[ STENCIL_INDEX8 ] = true;

function isRenderbufferFormat( format ) {

    return renderbufferFormats[ format ];

}

let glRenderbuffer;
function isRenderbuffer( gl, t ) {

    if ( ! glRenderbuffer )
        glRenderbuffer = gl.createRenderbuffer();

    return t instanceof glRenderbuffer.constructor;

}

let glTexture;
function isTexture( gl, t ) {

    if ( ! glTexture )
        glTexture = gl.createTexture();

    return t instanceof glTexture.constructor;

}

function createFramebufferInfo( gl, attachments = defaultAttachment, width = gl.drawingBufferWidth, height = gl.drawingBufferHeight ) {

    const target = gl.FRAMEBUFFER;
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer( target, fb );

    let colorAttachmentCount = 0;
    const framebufferInfo = {
        framebuffer: fb,
        attachments: [],
        width,
        height,
    };

    attachments.forEach( ( attachmentOptions ) => {

        let attachment = attachmentOptions.attachment;
        const format = attachmentOptions.format;
        let attachmentPoint = getAttachmentPointForFormat( format );
        if ( ! attachmentPoint )
            attachmentPoint = gl.COLOR_ATTACHMENT0 + colorAttachmentCount ++;

        if ( ! attachment )
            if ( isRenderbufferFormat( format ) ) {

                attachment = gl.createRenderbuffer();
                gl.bindRenderbuffer( gl.RENDERBUFFER, attachment );
                gl.renderbufferStorage( gl.RENDERBUFFER, format, width, height );
                gl.bindRenderbuffer( gl.RENDERBUFFER, null );

            } else {

                const textureOptions = Object.assign( {}, attachmentOptions, { width, height } );

                if ( textureOptions.auto === undefined ) {

                    textureOptions.auto = false;
                    textureOptions.min = textureOptions.min || textureOptions.minMag || gl.LINEAR;
                    textureOptions.mag = textureOptions.mag || textureOptions.minMag || gl.LINEAR;
                    textureOptions.wrapS = textureOptions.wrapS || textureOptions.wrap || gl.CLAMP_TO_EDGE;
                    textureOptions.wrapT = textureOptions.wrapT || textureOptions.wrap || gl.CLAMP_TO_EDGE;

                }
                attachment = createTexture( gl, textureOptions );

            }

        if ( isRenderbuffer( gl, attachment ) )
            gl.framebufferRenderbuffer( target, attachmentPoint, gl.RENDERBUFFER, attachment );
        else if ( isTexture( gl, attachment ) )
            gl.framebufferTexture2D(
                target,
                attachmentPoint,
                attachmentOptions.texTarget || gl.TEXTURE_2D,
                attachment,
                attachmentOptions.level || 0,
            );
        else
            throw new Error( 'unkonwn attachment type for framebuffer' );

        framebufferInfo.attachments.push( attachment );

    } );

    if ( colorAttachmentCount > 1 ) {

        const colorBuffers = [];
        for ( let i = 0; i < colorAttachmentCount; i ++ )
            colorBuffers.push( gl.COLOR_ATTACHMENT0 + i );
        gl.drawBuffers( colorBuffers );

    }


    switch ( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) ) {

    case gl.FRAMEBUFFER_COMPLETE: break;
    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: console.log( 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT' ); break;
    case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: console.log( 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT' ); break;
    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: console.log( 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS' ); break;
    case gl.FRAMEBUFFER_UNSUPPORTED: console.log( 'FRAMEBUFFER_UNSUPPORTED' ); break;
    case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: console.log( 'FRAMEBUFFER_INCOMPLETE_MULTISAMPLE' ); break;
    case gl.RENDERBUFFER_SAMPLES: console.log( 'RENDERBUFFER_SAMPLES' ); break;
    default: break;

    }

    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    return framebufferInfo;

}

function bindFramebufferInfo( gl, framebufferInfo ) {

    const target = gl.FRAMEBUFFER;
    if ( framebufferInfo ) {

        gl.bindFramebuffer( target, framebufferInfo.framebuffer );
        gl.viewport( 0, 0, framebufferInfo.width, framebufferInfo.height );

    } else {

        gl.bindFramebuffer( target, null );
        gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight );

    }

}

function readPixcelFromFrameBufferInfo( gl, framebufferInfo, x, y, index = 0 ) {

    const pix = new Uint8Array( 4 );
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferInfo.framebuffer || framebufferInfo );
    gl.readBuffer( gl.COLOR_ATTACHMENT0 + index );
    gl.readPixels( x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pix );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    return pix;

}

function resizeFramebufferInfo( gl, framebufferInfo, attachments = defaultAttachment, width = gl.drawingBufferWidth, height = gl.drawingBufferHeight ) {

    framebufferInfo.width = width; // eslint-disable-line
    framebufferInfo.height = height; // eslint-disable-line

    attachments.forEach( ( attachmentOpts, idx ) => {

        const attachment = framebufferInfo.attachments[ idx ];
        const format = attachmentOpts.format;
        if ( isRenderbuffer( gl, attachment ) ) {

            gl.bindRenderbuffer( gl.RENDERBUFFER, attachment );
            gl.renderbufferStorage( gl.RENDERBUFFER, format, width, height );

        } else if ( isTexture( gl, attachment ) )
            resizeTexture( gl, attachment, attachmentOpts, width, height );
        else
            throw new Error( 'unknown attachment type -- fun resizeFramebufferInfo()' );

    } );

}

export { createFramebufferInfo, bindFramebufferInfo, readPixcelFromFrameBufferInfo, resizeFramebufferInfo };
