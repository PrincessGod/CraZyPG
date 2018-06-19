import { Light } from './Light';

function PointLight( color, intensity, distance = 0, decay = 1 ) {

    Light.call( this, color, intensity );
    this.distance = distance;
    this.decay = decay;

}

PointLight.prototype = Object.assign( Object.create( Light.prototype ), {

    constructor: PointLight,

} );

export { PointLight };
