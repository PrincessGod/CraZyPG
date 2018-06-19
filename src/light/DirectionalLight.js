import { Light } from './Light';

function DirectionalLight( color, intensity ) {

    Light.call( this, color, intensity );

}

DirectionalLight.prototype = Object.assign( Object.create( Light.prototype ), {

    constructor: DirectionalLight,

} );

export { DirectionalLight };
