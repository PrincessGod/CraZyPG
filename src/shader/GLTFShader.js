import { Shader } from './Shader';
import vs from './shadersrc/gltf.vs.glsl';
import fs from './shadersrc/gltf.fs.glsl';
import { PMath } from '../math/Math';

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
const MORPH_POSITION_PREFIX = 'a_morphPositions_';
const MORPH_NORMAL_PREFIX = 'a_morphNromals_';
const MORPH_TANGENT_PREFIX = 'a_morphTangents_';
const MORPH_WEIGHT_UNIFORM = 'u_morphWeights';

GLTFShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: GLTFShader,

    makeSafe( model ) {

        if ( ! model.makeSafeGLTF ) {

            const attribs = Object.keys( model.mesh.attribArrays );
            if ( attribs.length > this._maxVertexAttribs ) {

                const attribNum = attribs.length;
                const defines = model.defines;
                const morphInfo = {};
                let morphAttribCount = 0;
                if ( defines.indexOf( HasMorphPositionDefine ) > - 1 ) {

                    morphAttribCount ++;
                    morphInfo.morphPosition = true;

                }
                if ( defines.indexOf( HasMorphNormalDefine ) > - 1 ) {

                    morphAttribCount ++;
                    morphInfo.morphNormal = true;

                }
                if ( defines.indexOf( HasMorphTangentDefine ) > - 1 ) {

                    morphAttribCount ++;
                    morphInfo.morphTangent = true;

                }

                const morphDefine = ( defines.filter( define => define.startsWith( MorphTargetNumPrefix ) ) )[ 0 ];
                defines.splice( defines.indexOf( morphDefine ), 1 );
                const originCount = Number( morphDefine.slice( MorphTargetNumPrefix.length ) );

                let morphCount = originCount;
                let activerAttribNum = attribNum;
                while ( activerAttribNum > this._maxVertexAttribs ) {

                    morphCount --;
                    activerAttribNum -= morphAttribCount;

                }

                if ( morphCount > 0 ) {

                    defines.push( getMorphTargetDefine( morphCount ) );
                    morphInfo.morphTargetNum = morphCount;
                    morphInfo.originCount = originCount;

                    morphInfo.originPositionArrays = [];
                    morphInfo.originNormalArrays = [];
                    morphInfo.originTangentArrays = [];
                    for ( let i = 0; i < originCount; i ++ ) {

                        if ( morphInfo.morphPosition )
                            morphInfo.originPositionArrays.push( model.mesh.attribArrays[ MORPH_POSITION_PREFIX + i ] );
                        if ( morphInfo.morphNormal )
                            morphInfo.originNormalArrays.push( model.mesh.attribArrays[ MORPH_NORMAL_PREFIX + i ] );
                        if ( morphInfo.morphTangent )
                            morphInfo.originTangentArrays.push( model.mesh.attribArrays[ MORPH_TANGENT_PREFIX + i ] );

                    }
                    if ( morphInfo.originPositionArrays.length < 1 ) delete morphInfo.originPositionArrays;
                    if ( morphInfo.originNormalArrays.length < 1 ) delete morphInfo.originNormalArrays;
                    if ( morphInfo.originTangentArrays.length < 1 ) delete morphInfo.originTangentArrays;

                    if ( ! model.bufferInfo ) model.createBufferInfo( this.gl );

                    morphInfo.originPositionBufferInfo = [];
                    morphInfo.originNormalBufferInfo = [];
                    morphInfo.originTangentBufferInfo = [];
                    const bufferInfo = model.mesh.bufferInfo.attribs;
                    for ( let i = 0; i < morphInfo.originCount; i ++ ) {

                        if ( morphInfo.morphPosition )
                            morphInfo.originPositionBufferInfo.push( bufferInfo[ MORPH_POSITION_PREFIX + i ] );
                        if ( morphInfo.morphNormal )
                            morphInfo.originNormalBufferInfo.push( bufferInfo[ MORPH_NORMAL_PREFIX + i ] );
                        if ( morphInfo.morphTangent )
                            morphInfo.originTangentBufferInfo.push( bufferInfo[ MORPH_TANGENT_PREFIX + i ] );

                    }
                    if ( morphInfo.originPositionBufferInfo.length < 1 ) delete morphInfo.originPositionBufferInfo;
                    if ( morphInfo.originNormalBufferInfo.length < 1 ) delete morphInfo.originNormalBufferInfo;
                    if ( morphInfo.originTangentBufferInfo.length < 1 ) delete morphInfo.originTangentBufferInfo;


                    model.morphInfo = morphInfo; // eslint-disable-line

                }

                console.warn( `model '${model.name}' use ${morphCount} morph targets instead of origin's ${originCount} morph targets, so animate maybe get strange behaver.` );

            }

            model.makeSafeGLTF = true; // eslint-disable-line

        }

        return this;

    },

    resortMorph: ( function () {

        function compareWeight( a, b ) {

            return b.weight - a.weight;

        }

        function compareNum( a, b ) {

            return b - a;

        }

        return function resortMorph( model ) {

            if ( model.morphInfo ) {

                const morphInfo = model.morphInfo;
                const bufferInfo = {};
                const {
                    lastWeight, morphTargetNum, originPositionBufferInfo, originNormalBufferInfo, originTangentBufferInfo,
                } = morphInfo;
                const currentWeight = model.uniformObj[ MORPH_WEIGHT_UNIFORM ];

                if ( ! lastWeight || ! PMath.arrayEquals( currentWeight, lastWeight ) ) {

                    morphInfo.lastWeight = currentWeight.slice();
                    const newWeights = currentWeight.slice().sort( compareNum );
                    const uniformObj = {};
                    uniformObj[ MORPH_WEIGHT_UNIFORM ] = newWeights;
                    model.setUniformObj( uniformObj );

                    const weights = [];
                    for ( let i = 0; i < currentWeight.length; i ++ ) // in case weight equals
                        weights[ i ] = { weight: currentWeight[ i ] };
                    const sort = weights.slice().sort( compareWeight );
                    const origin = sort.map( w => weights.indexOf( w ) );
                    for ( let i = 0; i < morphTargetNum; i ++ ) {

                        if ( originPositionBufferInfo )
                            bufferInfo[ MORPH_POSITION_PREFIX + i ] = originPositionBufferInfo[ origin[ i ] ];
                        if ( originNormalBufferInfo )
                            bufferInfo[ MORPH_NORMAL_PREFIX + i ] = originNormalBufferInfo[ origin[ i ] ];
                        if ( originTangentBufferInfo )
                            bufferInfo[ MORPH_TANGENT_PREFIX + i ] = originTangentBufferInfo[ origin[ i ] ];

                    }
                    model.mesh.updateBufferInfo( bufferInfo );

                }

            }

            return this;

        };

    }() ),

    renderModel( model ) {

        if ( model.defines ) this.makeSafe( model ).resortMorph( model ).setDefines( ...model.defines );
        return Shader.prototype.renderModel.call( this, model );

    },

} );

Object.assign( GLTFShader, {

    vs,
    fs,

} );

export { GLTFShader };
