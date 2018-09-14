import { GL2 } from '../webgl2';

export class TextureCubeMap {

    constructor( src, opts = {} ) {

        const {
            internalFormat, format, type, width, height,
            min, mag, minMag,
            unpackAlignment, flipY, premultiplyAlpha, colorspaceConversion
        } = opts;

        this.src = src;
        this.target = GL2.TEXTURE_CUBE_MAP;

        this.type = type;
        this.format = format;
        this.internalFormat = internalFormat;

        this.width = width;
        this.height = height;

        this.min = min;
        this.mag = mag;
        this.minMag = minMag;

        this.wrap = GL2.CLAMP_TO_EDGE;
        this.wrapS = GL2.CLAMP_TO_EDGE;
        this.wrapT = GL2.CLAMP_TO_EDGE;

        this.flipY = flipY;
        this.unpackAlignment = unpackAlignment;
        this.premultiplyAlpha = premultiplyAlpha;
        this.colorspaceConversion = colorspaceConversion;

    }

}
