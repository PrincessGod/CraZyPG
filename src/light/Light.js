import { Node } from '../object/Node';

let lightNumber = 0;
export class Light extends Node {

    constructor( color = [ 1, 1, 1 ], intensity = 1 ) {

        super( `LIGHT_NODE_${lightNumber ++}` );
        this.color = color;
        this.intensity = intensity;

    }

}
