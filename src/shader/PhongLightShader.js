import { Shader } from './Shader';
import vs from './shadersrc/phongLight.vs';
import fs from './shadersrc/phongLight.fs';

function PhongLightShader( gl, camera, texture, flat = false ) {

    Shader.call( this, gl, PhongLightShader.vs, PhongLightShader.fs );

    this.setCamera( camera );

    this.setUniformObj( {
        u_texture: texture,
        position: [ 10, 10, 10 ],
        color: [ 1.0, 1.0, 1.0 ],
        ambientColor: [ 0.15, 0.15, 0.15 ],
        falloff: 0.15,
        radius: 5.0,
        shiness: 20.0,
        specularFactor: 0.1,
        roughness: 0.5,
        albedo: 0.85,
        isFlat: !! flat,
        isGamma: true,
    } );

    this.deactivate();

}

PhongLightShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: PhongLightShader,

} );

Object.assign( PhongLightShader, {

    vs,
    fs,

} );

export { PhongLightShader };
