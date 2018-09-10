import * as GL2 from './GL2';

export class GL2Texture {

    constructor( target = GL2.TEXTURE_2D, internalformat = GL2.RGBA, width = 0, height = 0, border = 0,
        format = internalformat, type = GL2.UNSIGNED_BYTE,
        TEXTURE_MAG_FILTER = GL2.LINEAR, TEXTURE_MIN_FILTER = GL2.NEAREST_MIPMAP_LINEAR, TEXTURE_WRAP_S = GL2.REPEAT, TEXTURE_WRAP_T = GL2.REPEAT, TEXTURE_WRAP_R = GL2.REPEAT,
        UNPACK_FLIP_Y_WEBGL = false, UNPACK_PREMULTIPLY_ALPHA_WEBGL = false, UNPACK_ALIGNMENT = 4, UNPACK_COLORSPACE_CONVERSION_WEBGL = GL2.BROWSER_DEFAULT_WEBGL ) {

        this.type = type;
        this.width = width;
        this.height = height;
        this.target = target;
        this.border = border;
        this.format = format;
        this.internalformat = internalformat;

        this.TEXTURE_MAG_FILTER = TEXTURE_MAG_FILTER;
        this.TEXTURE_MIN_FILTER = TEXTURE_MIN_FILTER;
        this.TEXTURE_WRAP_S = TEXTURE_WRAP_S;
        this.TEXTURE_WRAP_T = TEXTURE_WRAP_T;
        this.TEXTURE_WRAP_R = TEXTURE_WRAP_R;

        this.UNPACK_ALIGNMENT = UNPACK_ALIGNMENT;
        this.UNPACK_FLIP_Y_WEBGL = UNPACK_FLIP_Y_WEBGL;
        this.UNPACK_PREMULTIPLY_ALPHA_WEBGL = UNPACK_PREMULTIPLY_ALPHA_WEBGL;
        this.UNPACK_COLORSPACE_CONVERSION_WEBGL = UNPACK_COLORSPACE_CONVERSION_WEBGL;

        this.updateCallQueue = [];

    }

    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView srcData, srcOffset);
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, GLintptr offset); // not implementation
    static updateDataTexture( gl2texture, arrayBufferView, width = gl2texture.width, height = gl2texture.height,
        level = 0, border = gl2texture.border, srcOffset = 0 ) {

        const { target, internalformat, format, type } = gl2texture;

        gl2texture.width = width;
        gl2texture.height = height;

        gl2texture.updateCallQueue.push(
            { api: 'texImage2D', args: [ target, level, internalformat, width, height,
                border, format, type, arrayBufferView, srcOffset ], source: 'GL2Texture.updateDataTexture' }
        );

        return GL2Texture;

    }

    // void gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
    // void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
    // void gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
    // void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
    // void gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLCanvasElement source); // ignore webgl2
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLImageElement source);
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLVideoElement source);
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ImageBitmap source);
    // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ImageData source);
    static updateImageTexture( gl2texture, pixels, level = 0 ) {

        const { target, internalformat, format, type } = gl2texture;

        gl2texture.updateCallQueue.push(
            { api: 'texImage2D', args: [ target, level, internalformat, format, type, pixels ], source: 'GL2Texture.updateImageTexture' }
        );

        return GL2Texture;

    }

    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ArrayBufferView? pixels);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ArrayBufferView srcData, srcOffset); // webgl2
    // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, GLintptr offset); // not implementation
    static updateSubDataTexture( gl2texture, data, xoffset, yoffset, width, height, level = 0, srcOffset = 0 ) {

        const { target, format, type } = gl2texture;

        gl2texture.updateCallQueue.push(
            { api: 'texSubImage2D', args: [ target, level, xoffset, yoffset, width, height, format, type, data, srcOffset ],
                source: 'GL2Texture.updateSubDataTexture' }
        );

        return GL2Texture;

    }

    // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, ImageData? pixels);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLImageElement? pixels);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLCanvasElement? pixels);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLVideoElement? pixels);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, ImageBitmap? pixels);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, HTMLCanvasElement source); // webgl2
    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, HTMLImageElement source);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, HTMLVideoElement source);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ImageBitmap source);
    // void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ImageData source);
    static updateSubImageTexture( gl2texture, pixels, xoffset, yoffset, width, height, level = 0 ) {

        const { target, format, type } = gl2texture;

        gl2texture.updateCallQueue.push(
            { api: 'texSubImage2D', args: [ target, level, xoffset, yoffset, width, height, format, type, pixels ],
                source: 'GL2Texture.updateSubImageTexture' }
        );

        return GL2Texture;

    }

    static setParameter( gl2texture, mag = gl2texture.TEXTURE_MAG_FILTER, min = gl2texture.TEXTURE_MIN_FILTER, wrapS = gl2texture.TEXTURE_WRAP_S, wrapT = gl2texture.TEXTURE_WRAP_T, wrapR = gl2texture.TEXTURE_WRAP_R ) {

        gl2texture.TEXTURE_MAG_FILTER = mag;
        gl2texture.TEXTURE_MIN_FILTER = min;
        gl2texture.TEXTURE_WRAP_S = wrapS;
        gl2texture.TEXTURE_WRAP_T = wrapT;
        gl2texture.TEXTURE_WRAP_R = wrapR;
        gl2texture.updateCallQueue.push( { api: 'texParameteri', args: [ GL2.TEXTURE_MAG_FILTER, mag ], source: 'GL2Texture.setFilters' } );
        gl2texture.updateCallQueue.push( { api: 'texParameteri', args: [ GL2.TEXTURE_MIN_FILTER, min ], source: 'GL2Texture.setFilters' } );
        gl2texture.updateCallQueue.push( { api: 'texParameteri', args: [ GL2.TEXTURE_WRAP_S, wrapS ], source: 'GL2Texture.setFilters' } );
        gl2texture.updateCallQueue.push( { api: 'texParameteri', args: [ GL2.TEXTURE_WRAP_T, wrapT ], source: 'GL2Texture.setFilters' } );
        gl2texture.updateCallQueue.push( { api: 'texParameteri', args: [ GL2.TEXTURE_WRAP_R, wrapR ], source: 'GL2Texture.setFilters' } );

        return GL2Texture;

    }

    static setPixelStorage( gl2texture, flipY = gl2texture.UNPACK_FLIP_Y_WEBGL, preMultAlpha = gl2texture.UNPACK_PREMULTIPLY_ALPHA_WEBGL, aligment = gl2texture.UNPACK_ALIGNMENT, convertColorSpace = gl2texture.UNPACK_COLORSPACE_CONVERSION_WEBGL  ) {

        gl2texture.UNPACK_ALIGNMENT = aligment;
        gl2texture.UNPACK_FLIP_Y_WEBGL = flipY;
        gl2texture.UNPACK_PREMULTIPLY_ALPHA_WEBGL = preMultAlpha;
        gl2texture.UNPACK_COLORSPACE_CONVERSION_WEBGL = convertColorSpace;
        gl2texture.updateCallQueue.push( { api: 'pixelStorei', args: [ GL2.UNPACK_ALIGNMENT, aligment ], source: 'GL2Texture.setPixelStorage' } );
        gl2texture.updateCallQueue.push( { api: 'pixelStorei', args: [ GL2.UNPACK_FLIP_Y_WEBGL, flipY ], source: 'GL2Texture.setPixelStorage' } );
        gl2texture.updateCallQueue.push( { api: 'pixelStorei', args: [ GL2.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultAlpha ], source: 'GL2Texture.setPixelStorage' } );
        gl2texture.updateCallQueue.push( { api: 'pixelStorei', args: [ GL2.UNPACK_COLORSPACE_CONVERSION_WEBGL, convertColorSpace ], source: 'GL2Texture.setPixelStorage' } );

        return GL2Texture;

    }

}
