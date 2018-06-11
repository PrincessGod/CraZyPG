import { RawShader } from './RawShader';
import { Material } from './Material';
import { BeginMode } from '../core/constant';
import vs from './shadersrc/gridaxis.vs.glsl';
import fs from './shadersrc/gridaxis.fs.glsl';

function GridAxisShader() {

    RawShader.call( this, vs, fs );

}

GridAxisShader.prototype = Object.assign( Object.create( RawShader.prototype ), {

    constructor: GridAxisShader,

} );

function GridAxisMaterial( opts = {} ) {

    const defaultOpts = {
        polygon: true,
        polygonOffset: [ 1, 1 ],
        drawMode: BeginMode.LINES,
    };

    Material.call( this, GridAxisShader, Object.assign( opts, defaultOpts ) );

    this.setUniformObj( { u_colors: [ 0.5, 0.5, 0.5, 1, 0, 0, 0, 1, 0, 0, 0, 1 ] } );

}

GridAxisMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: GridAxisMaterial,

} );

export { GridAxisMaterial };
