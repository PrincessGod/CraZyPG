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

    },

    setData( array ) {

        let typedArray = array;
        if ( ! ( array && array.buffer && array.buffer instanceof ArrayBuffer ) )
            typedArray = new Float32Array( array );

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
