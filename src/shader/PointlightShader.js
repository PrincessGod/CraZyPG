import { Shader } from './Shader';
import vs from './shadersrc/phongLightSimple.vs.glsl';
import fs from './shadersrc/phongLightSimple.fs.glsl';

function PointlightShader( gl, camera, texture, flat = false ) {

    Shader.call( this, gl, PointlightShader.vs, PointlightShader.fs );

    this.setCamera( camera );

    this.setUniformObj( {
        u_texture: texture,
        position: [ 10, 10, 10 ],
        color: [ 1.0, 1.0, 1.0 ],
        ambientColor: [ 0.07, 0.07, 0.07 ],
        shiness: 20.0,
        diffuseFactor: 0.3,
        specularFactor: 0.1,
        isFlat: !! flat,
        isBlinn: true,
        isGamma: true,
    } );

    this.deactivate();

}

PointlightShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: PointlightShader,

} );

Object.assign( PointlightShader, {

    vs,
    fs,

} );

export { PointlightShader };
