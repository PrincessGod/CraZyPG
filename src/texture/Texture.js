import { PixelFormat } from '../core/constant';
import { isTypedArray, getTypedArrayTypeFromGLType } from '../core/typedArray';
import { canFilter, canGenerateMipmap, getDimensions, getFormatAndTypeFromInternalFormat, getTextureTypeFromArrayType, getBytesPerElementForInternalFromat } from './textureUtils';

function Texture( texture, target ) {

    this._texture = texture;
    this._texture.target = target;
    this.setDefaultValue();

}

Object.defineProperties( Texture.prototype, {

    texture: {

        get() {

            return this._texture;

        },

    },

} );

Object.assign( Texture.prototype, {

    setDefaultValue() {

        const {
            src, target, level, internalFormat, format, type,
            unpackAlignment, autoFiltering, width, height,
        } = this._texture;

        this._texture.level = level || 0;
        this._texture.internalFormat = internalFormat || PixelFormat.RGBA;

        this._texture.unpackAlignment = unpackAlignment || 1;

        this._texture.autoFiltering = autoFiltering === undefined ? ( level === undefined ) : autoFiltering;
        if ( this._texture.autoFiltering ) {

            this._texture.canGenerateMipmap = canGenerateMipmap( this._texture.internalFormat );
            this._texture.canFilter = canFilter( this._texture.internalFormat );

        }

        if ( ( Array.isArray( src ) && typeof src[ 0 ] === 'number' ) || isTypedArray( src ) ) {

            const formatType = getFormatAndTypeFromInternalFormat( this._texture.internalFormat );
            this._texture.format = format || formatType.format;
            this._texture.type = type || getTextureTypeFromArrayType( src );

            if ( ! isTypedArray( src ) ) {

                const TypedArrayType = getTypedArrayTypeFromGLType( this._texture.type );
                this._texture.src = new TypedArrayType( src );

            }

            if ( src instanceof Uint8ClampedArray )
                this._texture.src = new Uint8Array( src.buffer );

            const bytesPerElemnet = getBytesPerElementForInternalFromat( this._texture.internalFormat, this._texture.type );
            const numElements = this._texture.src.byteLength / bytesPerElemnet;
            if ( numElements % 1 )
                throw new Error( `length wrong for format: 0x${this._texture.format.toString( 16 )}` );

            const dimensions = getDimensions( target, width, height, numElements );
            this._texture.width = dimensions.width;
            this._texture.height = dimensions.height;

            this._texture.bytesPerElement = bytesPerElemnet;
            this._texture.numElements = numElements;

        }

    },

} );

export { Texture };
