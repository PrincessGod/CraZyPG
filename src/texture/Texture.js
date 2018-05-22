import { PixelFormat, TextureType } from '../core/constant';
import { isTypedArray, getTypedArrayTypeFromGLType } from '../core/typedArray';
import { canFilter, canGenerateMipmap, getDimensions, getFormatAndTypeFromInternalFormat, getTextureTypeFromArrayType, getBytesPerElementForInternalFromat } from './textureUtils';

function Texture( texture = {}, target = TextureType.TEXTURE_2D ) {

    this._texture = texture;
    this._textureConfig = Object.assign( {}, texture );
    this._textureConfig.target = target;
    this.setDefaultValue();

}

Object.defineProperties( Texture.prototype, {

    texture: {

        get() {

            return this._textureConfig;

        },

    },

} );

Object.assign( Texture.prototype, {

    setDefaultValue() {

        const {
            src, target, level, internalFormat, format, type,
            unpackAlignment, autoFiltering, width, height, depth,
        } = this._texture;

        this._textureConfig.level = level || 0;
        this._textureConfig.internalFormat = internalFormat || PixelFormat.RGBA;
        const formatType = getFormatAndTypeFromInternalFormat( this._textureConfig.internalFormat );
        this._textureConfig.format = format || formatType.format;
        this._textureConfig.type = type || formatType.type;

        this._textureConfig.unpackAlignment = unpackAlignment || 1;

        this._textureConfig.autoFiltering = autoFiltering === undefined ? ( level === undefined ) : autoFiltering;
        if ( this._textureConfig.autoFiltering ) {

            this._textureConfig.canGenerateMipmap = canGenerateMipmap( this._textureConfig.internalFormat );
            this._textureConfig.canFilter = canFilter( this._textureConfig.internalFormat );

        }

        if ( src )
            if ( ( Array.isArray( src ) && typeof src[ 0 ] === 'number' ) || isTypedArray( src ) ) {

                this._textureConfig.type = type || getTextureTypeFromArrayType( src );

                if ( ! isTypedArray( src ) ) {

                    const TypedArrayType = getTypedArrayTypeFromGLType( this._textureConfig.type );
                    this._textureConfig.src = new TypedArrayType( src );

                } else if ( src instanceof Uint8ClampedArray )
                    this._textureConfig.src = new Uint8Array( src.buffer );

                const bytesPerElemnet = getBytesPerElementForInternalFromat( this._textureConfig.internalFormat, this._textureConfig.type );
                const numElements = this._textureConfig.src.byteLength / bytesPerElemnet;
                if ( numElements % 1 )
                    throw new Error( `length wrong for format: 0x${this._textureConfig.format.toString( 16 )}` );

                this._textureConfig.bytesPerElement = bytesPerElemnet;
                this._textureConfig.numElements = numElements;

                const dimensions = getDimensions( target, width, height, depth, numElements );
                this._textureConfig.width = dimensions.width;
                this._textureConfig.height = dimensions.height;
                if ( dimensions.depth )
                    this._textureConfig.depth = dimensions.depth;

            }

        if ( ! src ) {

            this._textureConfig.width = width || 1;
            this._textureConfig.height = height || 1;
            this._textureConfig.depth = depth || 1;

        }

    },

} );

export { Texture };
