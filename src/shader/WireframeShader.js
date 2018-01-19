import { Shader } from './Shader';
import vs from './shadersrc/wireframe.vs.glsl';
import fs from './shadersrc/wireframe.fs.glsl';

function WireframeShader( gl, camera ) {

    Shader.call( this, gl, WireframeShader.vs, WireframeShader.fs );
    this.sampleBlend = true;
    this.setCamera( camera );
    this.setUniformObj( {
        thickness: 0.5,
        screenWidth: true,
        stroke: [ 0 / 255, 157 / 255, 118 / 255, 1.0 ],
        fill: [ 255 / 255, 147 / 255, 172 / 255, 0.0 ],
        backStroke: [ 0 / 255, 88 / 255, 83 / 255, 1.0 ],
        colorBack: false,
        noiseSmall: false,
        noiseBig: false,
        squeeze: false,
        squeezeMin: 0.5,
        suqeezeMax: 1.0,
        dash: false,
        dashRepeats: 10,
        dashLength: 0.5,
        dashOverlap: true,
        dashAnimate: false,
        dualStroke: false,
        secondThickness: 0.2,
    } );
    this.deactivate();

}

WireframeShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: WireframeShader,

    preRender() {

        if ( this.currentUniformObj.stroke[ 3 ] < 1.0 || this.currentUniformObj.fill[ 3 ] < 1.0 ) {

            this.sampleBlend = true;
            this.cullFace = false;

        } else {

            this.sampleBlend = false;
            this.cullFace = true;

        }

        Shader.prototype.preRender.call( this );

    },

} );

Object.assign( WireframeShader, {

    vs,
    fs,

} );

export { WireframeShader };
