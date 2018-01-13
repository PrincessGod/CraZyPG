import { ColorpickShader } from '../shader/ColorpickShader';
import { createFramebufferInfo, bindFramebufferInfo, readPixcelFromFrameBufferInfo } from '../renderer/framebuffer';
import { clear } from '../renderer/webgl';

function FramebufferPicker( gl, camera ) {

    this.gl = gl;
    this.shader = new ColorpickShader( gl, camera );
    this.models = [];
    this.blankColor = this.id2Color( this.blankId );
    this.framebufferInfo = createFramebufferInfo( gl );

}

Object.assign( FramebufferPicker.prototype, {

    blankId: 0,

    id2Color( id ) {

        const a = new Float32Array( 3 );
        a[ 0 ] = ( id & 0xff ) / 255.0;
        a[ 1 ] = ( ( id & 0xff00 ) >> 8 ) / 255.0;
        a[ 2 ] = ( ( id & 0xff0000 ) >> 16 ) / 255.0;
        return a;

    },

    color2Id( colorArray ) {

        return colorArray[ 0 ] | ( colorArray[ 1 ] << 8 ) | ( colorArray[ 2 ] << 16 );

    },

    addModels( ...models ) {

        for ( let i = 0; i < models.length; i ++ )
            if ( Array.isArray( models[ i ] ) )
                models[ i ].forEach( ele => this.addModels( ele ) );
            else
                this.models.push( models[ i ] );

        return this;

    },

    removeModels( ...models ) {

        let index = - 1;
        models.forEach( ( model ) => {

            index = this.models.indexOf( model );
            if ( index > - 1 )
                this.models.splice( index, 1 );

        } );

        return this;

    },

    clear() {

        bindFramebufferInfo( this.gl, this.framebufferInfo );
        clear( this.gl );
        bindFramebufferInfo( this.gl, null );

        return this;

    },

    render() {

        bindFramebufferInfo( this.gl, this.framebufferInfo );
        this.shader.updateCamera();
        this.models.forEach( ( model, index ) => {

            this.shader.setColor( this.id2Color( index + 1 ) ).renderModel( model );

        } );
        bindFramebufferInfo( this.gl, null );

        return this;

    },

    click( x, y ) {

        const p = readPixcelFromFrameBufferInfo( this.gl, this.framebufferInfo, x, this.gl.canvas.height - y );
        console.log( x, y, p, this.color2Id( p ), this.models[ this.color2Id( p ) - 1 ] );

    },

} );

export { FramebufferPicker };
