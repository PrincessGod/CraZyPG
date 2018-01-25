import { Shader } from './Shader';
import vs from './shadersrc/meshline.vs.glsl';
import fs from './shadersrc/meshline.fs.glsl';

function MeshLineShader( gl, camera ) {

    Shader.call( this, gl, MeshLineShader.vs, MeshLineShader.fs );

    this.setCamera( camera );

    this.setUniformObj( {
        linewidth: 1.0,
        color: [ 255 / 255, 105 / 255, 180 / 255, 255 / 255 ],
        sizeAttenuation: true,
        u_tile: 0.3,
    } );

    this.blend = true;

    this.deactivate();

}

MeshLineShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: MeshLineShader,

    preRender() {

        this.setUniformObj( {
            resolution: [ this.gl.drawingBufferWidth, this.gl.drawingBufferHeight ],
            near: this.camera.near,
            far: this.camera.far,
        } );

        Shader.prototype.preRender.call( this );

    },

} );

Object.assign( MeshLineShader, {

    vs,
    fs,

} );

export { MeshLineShader };
