import { Shader } from './Shader';
import vs from './shadersrc/gltf.vs.glsl';
import fs from './shadersrc/gltf.fs.glsl';

function GLTFShader( gl, camera ) {

    Shader.call( this, gl, GLTFShader.vs, GLTFShader.fs, { validateProgram: false } );

    this.setCamera( camera );
    this.deactivate();
    this._maxVertexAttribs = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );

}

function getMorphTargetDefine( num ) {

    return `MORPH_TARGET_NUM ${num}`;

}
const MorphTargetNumPrefix = 'MORPH_TARGET_NUM ';
const HasMorphPositionDefine = 'HAS_MORPH_POSITION';
const HasMorphNormalDefine = 'HAS_MORPH_NORMAL';
const HasMorphTangentDefine = 'HAS_MORPH_TANGENT';

GLTFShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: GLTFShader,

    makeSafe( model ) {

        if ( model.makeSafeGLTF ) return this;

        const attribs = Object.keys( model.mesh.attribArrays );
        if ( attribs.length > this._maxVertexAttribs ) {

            const attribNum = attribs.length;
            const defines = model.defines;
            let morphAttribCount = 0;
            if ( defines.indexOf( HasMorphPositionDefine ) > - 1 )
                morphAttribCount ++;
            if ( defines.indexOf( HasMorphNormalDefine ) > - 1 )
                morphAttribCount ++;
            if ( defines.indexOf( HasMorphTangentDefine ) > - 1 )
                morphAttribCount ++;

            const morphDefine = ( defines.filter( define => define.startsWith( MorphTargetNumPrefix ) ) )[ 0 ];
            defines.splice( defines.indexOf( morphDefine ), 1 );
            const originCount = Number( morphDefine.slice( MorphTargetNumPrefix.length ) );

            let morphCount = originCount;
            let activerAttribNum = attribNum;
            while ( activerAttribNum > this._maxVertexAttribs ) {

                morphCount --;
                activerAttribNum -= morphAttribCount;

            }

            if ( morphCount > 0 )
                defines.push( getMorphTargetDefine( morphCount ) );

            console.warn( `model '${model.name}' use ${morphCount} morph targets instead of origin's ${originCount} morph targets, so animate maybe get strange behaver.` );

        }
        model.makeSafeGLTF = true; // eslint-disable-line
        return this;

    },

    renderModel( model ) {

        if ( model.defines ) this.makeSafe( model ).setDefines( ...model.defines );
        return Shader.prototype.renderModel.call( this, model );

    },

} );

Object.assign( GLTFShader, {

    vs,
    fs,

} );

export { GLTFShader };
