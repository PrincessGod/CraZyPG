import { Shader } from './Shader';
import vs from './shadersrc/pointlight.vs';
import fs from './shadersrc/pointlight.fs';
import * as Constant from '../renderer/constant';

function PointlightShader( gl, camera, texture, flat = true ) {

    let frag = PointlightShader.fs;
    if ( flat )
        frag = Shader.injectDefines( PointlightShader.fs, Constant.DEFINE_FLAT );

    Shader.call( this, gl, PointlightShader.vs, frag );

    this.camera = camera;
    this.setUniformObj( {
        u_texture: texture,
        u_ambientStrength: 0.15,
        u_diffuseStrength: flat ? 1.0 : 0.3,
        u_specularStrength: 0.2,
        u_shiness: 100,
        u_normMat: new Float32Array( [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ] ),
        u_lightPos: [ 10, 10, 10 ],
    } );

    this.deactivate();

}

PointlightShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: PointlightShader,

    setTexture( tex ) {

        this.setUniformObj( { u_texture: tex } );
        return this;

    },

} );

Object.assign( PointlightShader, {

    vs,
    fs,

} );

export { PointlightShader };
