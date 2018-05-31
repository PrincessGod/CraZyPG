import { IndicesKey, BufferParams, ShaderParams, BeginMode } from '../core/constant';
import { getGLTypeFromTypedArray, getTypedArrayTypeFromGLType, isTypedArray } from '../core/typedArray';

let nameIdx = 0;

const colorRE = /color|colour/i;
const textureRE = /uv|coord/i;

function guessNumComponentsFromName( name, length ) {

    let numComponents;
    if ( colorRE.test( name ) ) numComponents = 4;
    else if ( textureRE.test( name ) ) numComponents = 2;
    else numComponents = 3;

    if ( length % numComponents > 0 )
        throw new Error( `Can not guess numComponents for attribute ${name}.` );

    return numComponents;

}

function getNumComponents( array, name ) {

    return array.numComponents || guessNumComponentsFromName( name, array.length );

}

function Primitive( name = `NO_NAME_PRIMITIVE${nameIdx ++}`, props = {} ) {

    const {
        attribArrays, drawMode, cullFace, blend, depth, sampleBlend, instanceCount, offset,
    } = props;

    this.name = name;
    this.attribArrays = attribArrays;
    this.drawMode = drawMode === undefined ? BeginMode.TRIANGLES : drawMode;
    this.cullFace = cullFace === undefined ? true : cullFace;
    this.blend = blend === undefined ? false : blend;
    this.depth = depth === undefined ? true : depth;
    this.sampleBlend = sampleBlend === undefined ? false : sampleBlend;
    this.instanceCount = instanceCount;
    this.offset = offset === undefined ? 0 : offset;
    this.vaoInfo = { needUpdate: true };

    this.createBufferInfo();

}

Object.assign( Primitive.prototype, {

    // { key: number }
    // { key: { data: number|array|typedArray, [name=key], [normalize=false], [type=GLTYPE], [stride=0], [offset=0], [diverse=0], [usage=STATIC_DRAW], [target=ARRAY_BUFFER] } }
    createBufferInfo() {

        const bufferInfo = {};
        const attribs = {};

        Object.keys( this.attribArrays ).forEach( ( key ) => {

            if ( key !== IndicesKey ) {

                const array = this.attribArrays[ key ];
                const attribName = array.name || key;

                let typedData = array.data;
                if ( typeof array === 'number' || typeof array.data === 'number' ) {

                    const numEle = array.data || array;
                    const ArrayType = array.type ? getTypedArrayTypeFromGLType( array.type ) : Float32Array;
                    typedData = new ArrayType( numEle );

                } else if ( Array.isArray( array.data ) )
                    typedData = new Float32Array( array.data );

                const type = getGLTypeFromTypedArray( typedData );
                const numComponents = getNumComponents( typedData, key );

                attribs[ attribName ] = {
                    data: typedData,
                    numComponents,
                    type,
                    normalize: array.normalize !== undefined ? array.normalize : false,
                    stride: array.stride || 0,
                    offset: array.offset || 0,
                    divisor: typeof array.divisor === 'undefined' ? undefined : array.divisor,
                    usage: array.drawType || BufferParams.STATIC_DRAW,
                    target: array.target || BufferParams.ARRAY_BUFFER,
                };

            }

        } );
        bufferInfo.attribs = attribs;

        if ( this.attribArrays[ IndicesKey ] ) {

            let typedIndices = this.attribArrays[ IndicesKey ];
            if ( ! isTypedArray( typedIndices ) ) {

                const ArrayType = Math.max.apply( null, typedIndices ) > 0xffff ? Uint32Array : Uint16Array;
                typedIndices = new ArrayType( typedIndices );

            }
            const indices = {
                data: typedIndices,
                usage: BufferParams.STATIC_DRAW,
                target: BufferParams.ELEMENT_ARRAY_BUFFER,
            };
            bufferInfo[ IndicesKey ] = indices;
            bufferInfo.numElements = typedIndices.length;
            bufferInfo.elementType = getGLTypeFromTypedArray( typedIndices );

        } else {

            const position = attribs[ ShaderParams.ATTRIB_POSITION_NAME ];
            if ( position )
                throw Error( 'Primitive do not have position info' );

            const {
                data, offset, stride, numComponents,
            } = position;
            let numElements = 0;
            const byteLenght = data.length * data.BYTES_PER_ELEMENT - offset;
            if ( stride )
                numElements = byteLenght / stride;
            else
                numElements = byteLenght / data.BYTES_PER_ELEMENT / numComponents;

            if ( numComponents % 1 )
                throw Error( 'Can not get elemnet number from position array' );

            bufferInfo.numElements = numElements;

        }

        bufferInfo.needUpdate = true;
        bufferInfo.updateInfo = { count: 0, offset: 0 };
        this.bufferInfo = bufferInfo;
        this.vaoInfo.bufferInfo = bufferInfo;

    },

    updateVaoInfo( programInfo ) {

        this.vaoInfo.programInfo = programInfo;
        this.vaoInfo.needUpdate = true;

    },

} );

export { Primitive };
