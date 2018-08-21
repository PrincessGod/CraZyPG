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

            if ( arg instanceof Model )
                this.models.push( arg );
            else if ( arg instanceof Light )
                this.lightManager.add( arg );
            else if ( ! ( arg instanceof Node ) )
                return console.warn( 'unknow type add into scene' );

            if ( ! arg.parent )
                this.root.addChild( arg );

            if ( arg.children && arg.children.length )
                return this.add( ...arg.children );

        } );

        return this;

    },

    render() {

        this.root.updateWorldMatrix();
        this.lightManager.updateUniformObj();
        this.renderer.render( this.models, this.currentCamera, this.lightManager, this.fog );

    },

} );

export { Scene };
