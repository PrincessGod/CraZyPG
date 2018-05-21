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

        } else if ( src instanceof HTMLElement ) {

            const imgWidth = src.width;
            const imgHeight = src.height;
            let size;
            let slices;
            if ( imgWidth / 6 === imgHeight ) {

                size = imgHeight;
                slices = [ 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0 ];

            } else if ( imgHeight / 6 === imgWidth ) {

                size = imgWidth;
                slices = [ 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5 ];

            } else if ( imgWidth / 3 === imgHeight / 2 ) {

                size = imgWidth / 3;
                slices = [ 0, 0, 1, 0, 2, 0, 0, 1, 1, 1, 2, 1 ];

            } else if ( imgWidth / 2 === imgHeight / 3 ) {

                size = imgWidth / 2;
                slices = [ 0, 0, 1, 0, 0, 1, 1, 1, 0, 2, 1, 2 ];

            } else
                throw new Error( `can't guess cube map from element: ${src.src ? src.src : src.nodeName}` );

            this._texture.size = size;
            this._texture.slices = slices;

        }

    },

} );

export { TextureCubeMap };
