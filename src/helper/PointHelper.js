import { ColorPointShader } from '../shader/ColorPointShader';
import { Primatives } from '../model/Primatives';
import { Model } from '../model/Model';
import * as Constant from '../renderer/constant';

function PointHelper( gl, camera, data, pointSize, pointColor ) {

    this.shader = new ColorPointShader( gl, camera, pointSize, pointColor );

    const attribArrays = {};
    attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data, drawType: gl.DYNAMIC_DRAW };
    this.mesh = Primatives.createMesh( 'PointHelper', attribArrays, { drawMode: gl.POINTS } );
    this.model = new Model( this.mesh );
    this.gl = gl;

}

Object.assign( PointHelper.prototype, {

    render() {

        this.shader.renderModel( this.model.preRender() );
        return this;

    },

    setTransform( transform ) {

        if ( this.model )
            this.model.transform = transform;

        return this;

    },

    setData( array ) {

        let typedArray = array;

        if ( array.data ) {

            typedArray = array.data;
            if ( array.numComponents && array.numComponents !== 3 )
                if ( array.numComponents === 4 ) {

                    typedArray = [];
                    for ( let i = 0; i < array.data.length / 4; i ++ )
                        typedArray.push( array.data[ i * 4 ], array.data[ i * 4 + 1 ], array.data[ i * 4 + 2 ] );

                } else {

                    console.error( 'array data numElement nor 3 or 4 for PointHelper.' );
                    return null;

                }

        }

        if ( ! ( typedArray && typedArray.buffer && typedArray.buffer instanceof ArrayBuffer ) )
            typedArray = new Float32Array( typedArray );

        const bufferInfo = this.mesh.bufferInfo;
        if ( bufferInfo ) {

            const buffer = bufferInfo.attribs[ Constant.ATTRIB_POSITION_NAME ].buffer;
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, buffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, typedArray, this.gl.DYNAMIC_DRAW );

            bufferInfo.numElements = typedArray.length / 3;

            return this;

        }

        this.mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data = typedArray;
        return this;

    },

} );

export { PointHelper };
