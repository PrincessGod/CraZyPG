import { Light } from './Light';

function AmbientLight( color, intensity ) {

    Light.call( this, color, intensity );

}

AmbientLight.prototype = Object.assign( Object.create( Light.prototype ), {

    constructor: AmbientLight,

} );

export { AmbientLight };
