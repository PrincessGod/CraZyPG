import { Texture } from './Texture';
import { isTypedArray } from '../core/typedArray';
import { TextureType, TextureWrapMode } from '../core/constant';

function TextureCubeMap( options ) {

    Texture.call( this, options, TextureType.TEXTURE_CUBE_MAP );

}

TextureCubeMap.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        const {
            src, numElements, bytesPerElement,
        } = this._texture;

        this._texture.wrap = TextureWrapMode.CLAMP_TO_EDGE;
        this._texture.wrapS = TextureWrapMode.CLAMP_TO_EDGE;
        this._texture.wrapT = TextureWrapMode.CLAMP_TO_EDGE;

        if ( isTypedArray( src ) ) {

            const componentsPerElement = bytesPerElement / src.BYTES_PER_ELEMENT;
            this._texture.faceSize = ( numElements / 6 ) * componentsPerElement;

        }

    },

} );

export { TextureCubeMap };
