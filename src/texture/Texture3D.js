import { Texture } from './Texture';
import { TextureType } from '../core/constant';
// import { isTypedArray } from '../core/typedArray';

function Texture3D( options ) {

    Texture.call( this, options, TextureType.TEXTURE_3D );

}

Texture3D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        // const {src} = this._texture;

        // if(isTypedArray(src)) {

        // }

    },

} );

export { Texture3D };
