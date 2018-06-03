import { IndicesKey, BufferParams, ShaderParams } from '../core/constant';
import { getGLTypeFromTypedArray, getTypedArrayTypeFromGLType, isTypedArray } from '../core/typedArray';

let nameIdx = 0;

const colorRE = /color|colour/i;
const textureRE = /uv|coord/i;
const positionRE = /a_position|a_pos|position/i;

function guessNumComponentsFromName( name, length ) {

    let numComponents;
    if ( colorRE.test( name ) ) numComponents = 4;
    else if ( textureRE.test( name ) ) numComponents = 2;
    else numComponents = 3;

    if ( length % numComponents > 0 )
        throw new Error( `can not guess numComponents for attribute ${name}.` );

    return numComponents;

}

function getNumComponents( array, name ) {

    return array.numComponents || guessNumComponentsFromName( name, array.length );

}

function guessNumberElementForNoIndices( attribs, primitiveOffset ) {

    let position = attribs[ ShaderParams.ATTRIB_POSITION_NAME ];
    if ( ! position ) {

        let positionKey;
        Object.keys( attribs ).forEach( ( k ) => {

            if ( positionRE.test( k ) )
                positionKey = k;

        } );
        position = attribs[ positionKey ];

    }
    if ( position )
        throw Error( 'primitive do not have position info' );

    const {
        data, offset, stride, numComponents,
    } = position;
    let numElements = 0;
    const byteLenght = ( data.length - primitiveOffset ) * data.BYTES_PER_ELEMENT - offset;
    if ( stride )
        numElements = byteLenght / stride;
    else
        numElements = byteLenght / data.BYTES_PER_ELEMENT / numComponents;

    if ( numElements % 1 )
        throw Error( 'can not get elemnet number from position array' );

    return numElements;

}

// opts { name }
function Primitive( attribArrays, opts = {} ) {

    const {
        name, offset,
    } = opts;

    this.name = name === undefined ? `NO_NAME_PRIMITIVE${nameIdx ++}` : name;
    this.attribArrays = attribArrays;
    this._offset = offset === undefined ? 0 : offset;
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

                array.data = typedData;
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
                    usage: array.usage || BufferParams.STATIC_DRAW,
                    target: array.target || BufferParams.ARRAY_BUFFER,
                    needUpdate: true,
                };

            }

        } );
        bufferInfo.attribs = attribs;

        if ( this.attribArrays[ IndicesKey ] ) {

            let typedIndices = this.attribArrays[ IndicesKey ].data;
            if ( ! isTypedArray( typedIndices ) ) {

                const ArrayType = Math.max.apply( null, typedIndices ) > 0xffff ? Uint32Array : Uint16Array;
                typedIndices = new ArrayType( typedIndices );
                this.attribArrays[ IndicesKey ].data = typedIndices;

            }
            const indices = {
                data: typedIndices,
                usage: BufferParams.STATIC_DRAW,
                target: BufferParams.ELEMENT_ARRAY_BUFFER,
                needUpdate: true,
            };
            bufferInfo[ IndicesKey ] = indices;
            bufferInfo.numElements = typedIndices.length - this._offset;
            bufferInfo.elementType = getGLTypeFromTypedArray( typedIndices );

        } else
            bufferInfo.numElements = guessNumberElementForNoIndices( attribs, this._offset );

        bufferInfo.needUpdate = true;
        bufferInfo.updateInfo = { count: 0, offset: 0 };
        this.bufferInfo = bufferInfo;
        this.vaoInfo.bufferInfo = bufferInfo;

        return this;

    },

    updateVaoInfo( programInfo ) {

        if ( this.vaoInfo.programInfo !== programInfo ) {

            this.vaoInfo.programInfo = programInfo;
            this.vaoInfo.needUpdate = true;

        }

        return this;

    },

} );

Object.defineProperties( Primitive.prototype, {

    start: {

        get() {

            return this._offset === 0 ? 0 : this._offset - 1;

        },

    },

    offset: {

        get() {

            return this._offset;

        },

        set( v ) {

            if ( v !== this._offset ) {

                this._offset = v;

                if ( this.bufferInfo.indices )
                    this.bufferInfo.numElements = this.bufferInfo.indices.data.length - this._offset;
                else
                    this.bufferInfo.numElements = guessNumberElementForNoIndices( this.bufferInfo.attribs, this._offset );

            }

        },

    },

} );

export { Primitive };
