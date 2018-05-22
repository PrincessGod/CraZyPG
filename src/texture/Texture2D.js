import { Texture } from './Texture';
import { TextureType } from '../core/constant';
// import { isTypedArray } from '../core/typedArray';

function Texture2D( options ) {

    Texture.call( this, options, TextureType.TEXTURE_2D );

}

Texture2D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        // const {src} = this._textureConfig;

        // if(isTypedArray(src)) {

        // }

    },

} );

export { Texture2D };
