import { GL2 } from '../webgl2';

export class Texture3D {

    constructor( src, opts = {} ) {

        const {
            internalFormat, format, type, width, height, depth,
            min, mag, minMag, wrapS, wrapT, wrap,
            unpackAlignment, flipY, premultiplyAlpha, colorspaceConversion
        } = opts;

        this.src = src;
        this.target = GL2.TEXTURE_3D;

        this.type = type;
        this.format = format;
        this.internalFormat = internalFormat;

        this.depth = depth;
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
