import { Texture } from './Texture';
import { TextureType } from '../core/constant';
// import { isTypedArray } from '../core/typedArray';

function Texture3D( options ) {

    Texture.call( this, options, TextureType.TEXTURE_3D );

}

Texture3D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        const { src } = this._textureConfig;

        if ( src instanceof HTMLElement ) {

            const size = Math.min( src.width, src.height );
            const largest = Math.max( src.width, src.height );
            const depth = largest / size;
            if ( depth % 1 !== 0 )
                throw new Error( 'can not compute TEXTURE_3D dimensions of element' );

            const xMult = src.width === largest ? 1 : 0;
            const yMult = src.height === largest ? 1 : 0;

            this._texture = Object.assign( this._texture, {
                size, depth, xMult, yMult,
            } );

        }

    },

} );

export { Texture3D };
