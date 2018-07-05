import { Texture } from './Texture';
import { isTypedArray } from '../core/typedArray';
import { TextureType, TextureWrapMode, DefaultColor } from '../core/constant';
import { ImageLoader } from '../loaders/ImageLoader';

const imageLoader = new ImageLoader();

function TextureCubeMap( options ) {

    Texture.call( this, options, TextureType.TEXTURE_CUBE_MAP );

}

TextureCubeMap.prototype = Object.assign( Object.create( Texture.prototype ), {

    setDefaultValue() {

        Texture.prototype.setDefaultValue.call( this );

        const {
            src, numElements, bytesPerElement, color,
        } = this._texture;

        this._textureConfig.wrap = TextureWrapMode.CLAMP_TO_EDGE;
        this._textureConfig.wrapS = TextureWrapMode.CLAMP_TO_EDGE;
        this._textureConfig.wrapT = TextureWrapMode.CLAMP_TO_EDGE;

        if ( isTypedArray( src ) ) {

            const componentsPerElement = bytesPerElement / src.BYTES_PER_ELEMENT;
            this._textureConfig.faceSize = ( numElements / 6 ) * componentsPerElement;

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

            this._textureConfig.size = size;
            this._textureConfig.slices = slices;

        } else if ( Array.isArray( src ) ) {

            if ( Array.isArray( src[ 0 ] ) && src.length > 1 )
                this._textureConfig.autoFiltering = false;

            const updateInfo = [];
            if ( typeof src[ 0 ] === 'string' || typeof src[ 0 ] instanceof HTMLElement )
                updateInfo.push( new Array( 6 ) );
            else
                updateInfo.fill( new Array( 6 ), 0, src[ 0 ].length );

            this._textureConfig.updateInfo = updateInfo;

            if ( typeof src[ 0 ] === 'string' || typeof src[ 0 ][ 0 ] === 'string' ) {

                this._textureConfig.isPending = true;
                this._textureConfig.color = color || DefaultColor.Foreground;

                imageLoader.load( src, ( err, {
                    results, img, x, y,
                } ) => {

                    if ( err ) return;

                    if ( updateInfo[ x ][ 0 ] === undefined ) {

                        results[ x ].length = 6; // eslint-disable-line
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

export { TextureCubeMap };
