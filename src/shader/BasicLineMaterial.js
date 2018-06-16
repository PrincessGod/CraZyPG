import { Shader } from './Shader';
import { Material } from './Material';
import vs from './shadersrc/basic.vs.glsl';
import fs from './shadersrc/basic.fs.glsl';
import { BeginMode } from '../core/constant';

function BasicLineShader() {

    Shader.call( this, vs, fs );

}

BasicLineShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: BasicLineShader,

} );

// {}
function BasicLineMaterial( opts = {} ) {

    const defaultOpt = { name: 'BasicLineMaterial', drawMode: BeginMode.LINES };
    const opt = Object.assign( defaultOpt, opts );
    Material.call( this, BasicLineShader, opt );

}

BasicLineMaterial.prototype = Object.assign( Object.create( Material.prototype ), {

    constructor: BasicLineMaterial,

} );

Object.defineProperties( BasicLineMaterial.prototype, {


} );

export { BasicLineMaterial };
