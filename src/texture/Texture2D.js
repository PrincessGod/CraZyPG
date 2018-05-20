import { Texture } from './Texture';
import { TextureType } from '../core/constant';

function Texture2D( options ) {

    Texture.call( this, options, TextureType.TEXTURE_2D );

}

Texture2D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

    },

} );

export { Texture2D };
