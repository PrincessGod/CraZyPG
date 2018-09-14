import { GL2 } from '../webgl2';

export class Texture2D {

    constructor( src, opts = {} ) {

        const {
            internalFormat, format, type, width, height,
            min, mag, minMag, wrapS, wrapT, wrap,
            unpackAlignment, flipY, premultiplyAlpha, colorspaceConversion
        } = opts;

        this.src = src;
        this.target = GL2.TEXTURE_2D;

        this.type = type;
        this.format = format;
        this.internalFormat = internalFormat;

        this.width = width;
        this.height = height;

        this.min = min;
        this.mag = mag;
        this.wrap = wrap;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minMag = minMag;

        this.flipY = flipY;
        this.unpackAlignment = unpackAlignment;
        this.premultiplyAlpha = premultiplyAlpha;
        this.colorspaceConversion = colorspaceConversion;

    }

}
