import { Texture } from './Texture';
import { TextureType, DefaultColor } from '../core/constant';
import { ImageLoader } from '../loaders/ImageLoader';

const imageLoader = new ImageLoader();

function Texture2D( options ) {

    Texture.call( this, options, TextureType.TEXTURE_2D );

}

Texture2D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        const { src, color } = this._texture;

        if ( typeof src === 'string' ) {

            this._textureConfig.isPending = true;
            this._textureConfig.color = color || DefaultColor.Foreground;
            imageLoader.load( src, ( err, img ) => {

                if ( ! err ) {

                    this._textureConfig.src = img;
                    this._textureConfig.isPending = false;
                    this._textureConfig.needUpdate = true;

                }

            } );

        }

    },

} );

export { Texture2D };
