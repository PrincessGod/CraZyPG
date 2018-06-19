import { Light } from './Light';

function SpotLight( color, intensity, distance = 0, angle = Math.PI / 4, penumbra = 0, decay = 1 ) {

    Light.call( this, color, intensity );
    this.distance = distance;
    this.angle = angle;
    this.penumbra = penumbra;
    this.decay = decay;

}

SpotLight.prototype = Object.assign( Object.create( Light.prototype ), {

    constructor: SpotLight,

} );

export { SpotLight };
