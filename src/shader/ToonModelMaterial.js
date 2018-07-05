import { PhongModelMaterial } from './PhongModelMaterial';

// {}
function ToonModelMaterial( opts = {} ) {

    const defaultOpt = { name: 'ToonModelMaterial' };
    const opt = Object.assign( defaultOpt, opts );
    PhongModelMaterial.call( this, opt );

    this.customDefine = { TOON: '' };
    const { gradientTexture } = opt;
    if ( gradientTexture )
        this.gradientTexture = gradientTexture;

}

ToonModelMaterial.prototype = Object.assign( Object.create( PhongModelMaterial.prototype ), {

    constructor: ToonModelMaterial,

} );

Object.defineProperties( ToonModelMaterial.prototype, {

    gradientTexture: {

        get() {

            return this._gradientTexture;

        },

        set( v ) {

            if ( v ) {

                this._gradientTexture = v;
                this.customDefine.HAS_TOONTEXTURE = '';
                this.setUniformObj( { u_gradientTexture: v } );

            } else
                delete this.customDefine.HAS_TOONTEXTURE;

        },

    },

} );

export { ToonModelMaterial };
