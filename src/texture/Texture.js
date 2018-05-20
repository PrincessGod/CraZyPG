import { PixelFormat } from '../core/constant';
import { canFilter, canGenerateMipmap } from './textureUtils';

function Texture( texture ) {

    this._texture = texture;
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
            level, internalFormat,
            unpackAlignment, autoFiltering,
        } = this._texture;

        this._texture.level = level || 0;
        this._texture.internalFormat = internalFormat || PixelFormat.RGBA;

        this._texture.unpackAlignment = unpackAlignment || 1;

        this._texture.autoFiltering = autoFiltering === undefined ? ( level === undefined ) : autoFiltering;
        if ( this._texture.autoFiltering ) {

            this._texture.canGenerateMipmap = canGenerateMipmap( this._texture.internalFormat );
            this._texture.canFilter = canFilter( this._texture.internalFormat );

        }

    },

} );

export { Texture };
