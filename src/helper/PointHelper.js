import { ColorPointShader } from '../shader/ColorPointShader';
import { Mesh } from '../model/Primatives';
import { Model } from '../model/Model';
import * as Constant from '../renderer/constant';
import { setTypedArrayToBuffer } from '../renderer/attributes';
import { getTypedArray } from '../renderer/typedArray';

function PointHelper( gl, data = [], pointSize, pointColor ) {

    this.shader = new ColorPointShader( gl, pointSize, pointColor );

    const attribArrays = {};
    attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data, drawType: gl.DYNAMIC_DRAW };
    this.mesh = new Mesh( 'PointHelper', attribArrays, { drawMode: gl.POINTS } );
    this.model = new Model( this.mesh );
    this.gl = gl;

}

Object.assign( PointHelper.prototype, {

    render() {

        this.model.transform.updateMatrix().copyToWorldMatrix();
        this.shader.renderModel( this.model );
        return this;

    },

    setCamera( camera ) {

        this.shader.setCamera( camera );
        return this;

    },

    // array or Model.infos
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

        typedArray = getTypedArray( typedArray );

        this.mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data = typedArray;

        const bufferInfo = this.mesh.bufferInfo;
        if ( bufferInfo ) {

            const buffer = bufferInfo.attribs[ Constant.ATTRIB_POSITION_NAME ].buffer;
            setTypedArrayToBuffer( this.gl, buffer, typedArray );

            bufferInfo.numElements = typedArray.length / 3;

        }

        return this;

    },
} );

export { PointHelper };
