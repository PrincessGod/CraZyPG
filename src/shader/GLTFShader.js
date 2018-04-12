import { Shader } from './Shader';
import vs from './shadersrc/gltf.vs.glsl';
import fs from './shadersrc/gltf.fs.glsl';

function GLTFShader( gl, camera ) {

    Shader.call( this, gl, GLTFShader.vs, GLTFShader.fs );

    this.setCamera( camera );
    this.deactivate();

}

GLTFShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: GLTFShader,

    renderModel( model ) {

        if ( model.defines ) this.setDefines( ...model.defines );
        return Shader.prototype.renderModel.call( this, model );

    },

} );

Object.assign( GLTFShader, {

    vs,
    fs,

} );

export { GLTFShader };
