import { Texture } from './Texture';
import { isTypedArray, getTypedArrayTypeFromGLType } from '../core/typedArray';
import { TextureType } from '../core/constant';
import { getDimensions, getFormatAndTypeFromInternalFormat, getTextureTypeFromArrayType, getBytesPerElementForInternalFromat } from './textureUtils';

function Texture2D( options ) {

    Texture.call( this, options );

}

Texture2D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        const {
            src, width, height, internalFormat, format, type,
        } = this._texture;

        this._texture.target = TextureType.TEXTURE_2D;

        if ( Array.isArray( src ) || isTypedArray( src ) ) {

            const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
            this._texture.format = format || formatType.format;
            this._texture.type = type || getTextureTypeFromArrayType( src );

            if ( ! isTypedArray( src ) ) {

                const TypedArrayType = getTypedArrayTypeFromGLType( this._texture.type );
                this._texture.src = new TypedArrayType( src );

            }

            if ( src instanceof Uint8ClampedArray )
                this._texture.src = new Uint8Array( src.buffer );

            const bytesPerElemnet = getBytesPerElementForInternalFromat( internalFormat, this._texture.type );
            const numElements = this._texture.src.byteLength / bytesPerElemnet;
            if ( numElements % 1 )
                throw new Error( `length wrong for format: 0x${this._texture.format.toString( 16 )}` );

            const dimensions = getDimensions( TextureType.TEXTURE_2D, width, height, numElements );
            this._texture.width = dimensions.width;
            this._texture.height = dimensions.height;

        }

    },

} );

export { Texture2D };
