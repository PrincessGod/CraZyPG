import { Texture } from './Texture';
import { TextureType, DefaultColor } from '../core/constant';
import { ImageLoader } from '../loaders/ImageLoader';

const imageLoader = new ImageLoader();

function Texture3D( options ) {

    Texture.call( this, options, TextureType.TEXTURE_3D );

}

Texture3D.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        const { src, color } = this._texture;

        if ( src instanceof HTMLElement ) {

            const size = Math.min( src.width, src.height );
            const largest = Math.max( src.width, src.height );
            const depth = largest / size;
            if ( depth % 1 !== 0 )
                throw new Error( 'can not compute TEXTURE_3D dimensions of element' );

            const xMult = src.width === largest ? 1 : 0;
            const yMult = src.height === largest ? 1 : 0;

            this._textureConfig = Object.assign( this._textureConfig, {
                size, depth, xMult, yMult,
            } );

        } else if ( Array.isArray( src ) ) {

            if ( Array.isArray( src[ 0 ] ) && src.length > 1 )
                this._textureConfig.autoFiltering = false;

            const updateInfo = [];
            const depth = src[ 0 ][ 0 ].length || src[ 0 ].length;
            if ( typeof src[ 0 ] === 'string' || typeof src[ 0 ] instanceof HTMLElement )
                updateInfo.push( new Array( depth ) );
            else
                updateInfo.fill( new Array( depth ), 0, src[ 0 ].length );

            this._textureConfig.updateInfo = updateInfo;
            this._textureConfig.depth = depth;

            if ( typeof src[ 0 ] === 'string' || typeof src[ 0 ][ 0 ] === 'string' ) {

                this._textureConfig.isPending = true;
                this._textureConfig.color = color || DefaultColor.Foreground;

                imageLoader.load( src, ( err, {
                    results, img, x, y,
                } ) => {

                    if ( err ) return;

                    if ( updateInfo[ x ][ 0 ] === undefined ) {

                        results[ x ].fill( img );
                        updateInfo[ x ].fill( true );
                        if ( x === 0 ) {

                            this._textureConfig.width = img.width;
                            this._textureConfig.height = img.height;

                        }

                    }
                    updateInfo[ x ][ y ] = true;
                    this._textureConfig.src = results;
                    this._textureConfig.isPending = false;
                    this._textureConfig.needUpdate = true;

                } );

            } else if ( src[ 0 ] instanceof HTMLElement || src[ 0 ][ 0 ] instanceof HTMLElement ) {

                if ( src[ 0 ] instanceof HTMLElement )
                    this._textureConfig.src = [ src ];
                updateInfo.forEach( a => a.fill( true ) );
                this._textureConfig.width = src[ 0 ][ 0 ].width;
                this._textureConfig.height = src[ 0 ][ 0 ].height;

            }

        }

    },

} );

export { Texture3D };
