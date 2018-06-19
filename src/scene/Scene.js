import { Node } from '../object/Node';
import { Model } from '../model/Model';
import { Controler } from '../controls/Controler';

function Scene( renderer ) {

    this.models = [];
    this.currentCamera = null;

    this.root = new Node( 'root_node' );
    this.renderer = renderer;
    this.gl = this.renderer.context;
    this.canvas = this.gl.canvas;
    this.controler = new Controler( this.gl.canvas );

}

Object.defineProperties( Scene.prototype, {

} );

Object.assign( Scene.prototype, {

    add( ...args ) {

        args.forEach( ( arg ) => {

            if ( Array.isArray( arg ) )
                return this.add( ...arg );

            if ( arg instanceof Model ) {

                this.root.addChild( arg );
                return this.models.push( arg );

            }

            return console.warn( 'unknow type add into scene' );

        } );

        return this;

    },

    render() {

        this.root.updateMatrix();
        this.models.forEach( m => this.renderer.render( m, this.currentCamera ) );

    },

} );

export { Scene };
