import { Shader } from './Shader';
import vs from './shadersrc/pointlight.vs';
import fs from './shadersrc/pointlight.fs';
import * as Constant from '../renderer/constant';

function PointlightShader( gl, camera, texture, flat = true ) {

    Shader.call( this, gl, PointlightShader.vs, PointlightShader.fs );

    this.setCamera( camera );

    this.setUniformObj( {
        u_texture: texture,
        u_ambientStrength: 0.3,
        u_diffuseStrength: 0.7,
        u_specularStrength: 0.1,
        u_shiness: 1.0,
        u_normMat: new Float32Array( [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ] ),
        u_lightPos: [ 10, 10, 10 ],
    } );

    if ( flat ) {

        this.setDefines( Constant.DEFINE_FLAT );

        this.setUniformObj( {
            u_texture: texture,
            u_ambientStrength: 0.3,
            u_diffuseStrength: 0.9,
            u_specularStrength: 0.2,
            u_shiness: 100,
            u_normMat: new Float32Array( [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ] ),
            u_lightPos: [ 10, 10, 10 ],
        } );

    }

    this.deactivate();

}

PointlightShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: PointlightShader,

    setTexture( tex ) {

        this.setUniformObj( { u_texture: tex } );
        return this;

    },

    updateCamera() {

        Shader.prototype.updateCamera.call( this );
        this.setUniformObj( { u_camPos: [ this.camera.matrix[ 12 ], this.camera.matrix[ 13 ], this.camera.matrix[ 14 ] ] } );
        return this;

    },

} );

Object.assign( PointlightShader, {

    vs,
    fs,

} );

export { PointlightShader };
