import { Node } from '../object/Node';
import { Model } from '../model/Model';
import { Controler } from '../controls/Controler';
import { Light } from '../light/Light';
import { LightManager } from '../light/LightManger';

function Scene( renderer ) {

    this.models = [];
    this.currentCamera = null;

    this.root = new Node( 'root_node' );
    this.renderer = renderer;
    this.gl = this.renderer.context;
    this.canvas = this.gl.canvas;
    this.controler = new Controler( this.gl.canvas );
    this.lightManager = new LightManager();
    this.fog = null;

}

Object.defineProperties( Scene.prototype, {

} );

Object.assign( Scene.prototype, {

    add( ...args ) {

        args.forEach( ( arg ) => {

            if ( Array.isArray( arg ) )
                return this.add( ...arg );

            this.root.addChild( arg );

            if ( arg instanceof Model )
                return this.models.push( arg );

            if ( arg instanceof Light )
                return this.lightManager.add( arg );

            return console.warn( 'unknow type add into scene' );

        } );

        return this;

    },

    render() {

        this.root.updateMatrix();
        this.lightManager.updateUniformObj();
        this.renderer.render( this.models, this.currentCamera, this.lightManager, this.fog );

    },

} );

export { Scene };
