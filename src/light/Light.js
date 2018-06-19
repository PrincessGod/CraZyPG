import { Node } from '../object/Node';

function Light( color = [ 1, 1, 1 ], intensity = 1 ) {

    Node.call( this );
    this.color = color;
    this.intensity = intensity;

}

Light.prototype = Object.assign( Object.create( Node.prototype ), {

    constructor: Light,

} );

export { Light };
