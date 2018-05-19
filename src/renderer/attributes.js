import { isArrayBuffer, getGLTypeFromTypedArray, getGLTypeFromTypedArrayType } from '../core/typedArray';

function isIndices( name ) {

    return name === 'index' || name === 'indices';

}

function getArray( array ) {

    return array.length ? array : array.data;

}

function getTypedArray( array, name ) {

    if ( isArrayBuffer( array ) ) return array;

    if ( isIndices( name ) ) return new Uint16Array( array );

    return new Float32Array( array );

}

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

    return array.numComponents || array.size || guessNumComponentsFromName( name, getArray( array ).length );

}

function createBufferFromTypedArray( gl, typedArray, type = gl.ARRAY_BUFFER, drawType = gl.STATIC_DRAW ) {

    if ( typedArray instanceof WebGLBuffer )
        return typedArray;

    const buffer = gl.createBuffer();
    gl.bindBuffer( type, buffer );
    gl.bufferData( type, typedArray, drawType );
    return buffer;

}

const positionNames = [ 'position', 'positions', 'a_position' ];

function getNumElementsFromNonIndicedArrays( arrays ) {

    let key;
    let i;
    for ( i = 0; i < positionNames.length; i ++ )
        if ( positionNames[ i ] in arrays ) {

            key = positionNames[ i ];
            break;

        }

    if ( i === positionNames.length ) [ key ] = Object.keys( arrays );
    const array = arrays[ key ];
    const dataArray = getArray( array );
    return dataArray.length / getNumComponents( array, key );

}

function getBytesPerValueForGLType( gl, type ) {

    if (type === gl.BYTE)           return 1;  // eslint-disable-line
    if (type === gl.UNSIGNED_BYTE)  return 1;  // eslint-disable-line
    if (type === gl.SHORT)          return 2;  // eslint-disable-line
    if (type === gl.UNSIGNED_SHORT) return 2;  // eslint-disable-line
    if (type === gl.INT)            return 4;  // eslint-disable-line
    if (type === gl.UNSIGNED_INT)   return 4;  // eslint-disable-line
    if (type === gl.FLOAT)          return 4;  // eslint-disable-line
    return 0;

}

function getNumElementsFromAttribs( gl, attribs ) {

    let key;
    let i;
    for ( i = 0; i < positionNames.length; i ++ )
        if ( positionNames[ i ] in attribs ) {

            key = positionNames[ i ];
            break;

        }

    if ( i === positionNames.length ) [ key ] = Object.keys( attribs );
    const attrib = attribs[ key ];
    gl.bindBuffer( gl.ARRAY_BUFFER, attrib.buffer );
    const numBytes = gl.getBufferParameter( gl.ARRAY_BUFFER, gl.BUFFER_SIZE );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    let numElements;
    if ( attrib.stride !== 0 )
        numElements = Math.floor( ( numBytes - attrib.offset ) / attrib.stride ); // need consider padding end
    else {

        const bytesPerValue = getBytesPerValueForGLType( gl, attrib.type );
        const totalElements = ( numBytes - attrib.offset ) / bytesPerValue;
        const numComponents = attrib.numComponents || attrib.size;
        numElements = totalElements / numComponents;
        if ( numElements % 1 !== 0 )
            throw new Error( `numComponent ${numComponents} not correct for length ${totalElements}` );

    }

    return numElements;

}

function createBufferFromArray( gl, array, name ) {

    const type = name === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    const typedArray = getTypedArray( getArray( array ), name );
    return createBufferFromTypedArray( gl, typedArray, type, array.drawType );

}

function createBuffersFromArrays( gl, arrays ) {

    const buffers = {};

    Object.keys( arrays ).forEach( ( key ) => {

        buffers[ key ] = createBufferFromArray( gl, arrays[ key ], key );

    } );

    if ( arrays.indices )
        buffers.numElements = arrays.indices.length;
    else
        buffers.numElements = getNumElementsFromNonIndicedArrays( arrays );

    return buffers;

}

function createAttribsFromArrays( gl, arrays ) {

    const attribs = {};

    Object.keys( arrays ).forEach( ( key ) => {

        if ( ! isIndices( key ) ) {

            const array = arrays[ key ];
            const attribName = array.name || array.attrib || array.attribName || key;
            const normalization = array.normalize !== undefined ? array.normalize : false;
            let buffer;
            let type;
            let numComponents;
            if ( typeof array === 'number' || typeof array.data === 'number' ) {

                const numEle = array.data || array;
                const arrayType = array.type || Float32Array;
                const numBytes = numEle * arrayType.BYTES_PER_ELEMENT;
                type = getGLTypeFromTypedArrayType( arrayType );
                numComponents = array.numComponents || array.size || guessNumComponentsFromName( key, numEle );
                buffer = gl.createBuffer();
                gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
                gl.bufferData( gl.ARRAY_BUFFER, numBytes, array.drawType || gl.STATIC_DRAW );

            } else {

                const typedArray = getTypedArray( getArray( array ), key );
                buffer = array.buffer || createBufferFromTypedArray( gl, typedArray, gl.ARRAY_BUFFER, array.drawType );
                type = getGLTypeFromTypedArray( typedArray );
                numComponents = getNumComponents( array, key );
                array.numComponents = numComponents;

            }

            attribs[ attribName ] = {
                buffer,
                numComponents,
                type,
                normalize: normalization,
                stride: array.stride || 0,
                offset: array.offset || 0,
                divisor: typeof array.divisor === 'undefined' ? undefined : array.divisor,
                drawType: array.drawType || gl.STATIC_DRAW,
            };

        }

    } );

    return attribs;

}

function createBufferInfoFromArrays( gl, arrays ) {

    const bufferInfo = {
        attribs: createAttribsFromArrays( gl, arrays ),
    };

    const { indices } = arrays;
    if ( indices ) {

        const newIndices = getTypedArray( getArray( indices ), 'indices' );
        bufferInfo.indices = createBufferFromTypedArray( gl, newIndices, gl.ELEMENT_ARRAY_BUFFER );
        bufferInfo.numElements = newIndices.length;
        bufferInfo.elementType = getGLTypeFromTypedArray( newIndices );

    } else
        bufferInfo.numElements = getNumElementsFromAttribs( gl, bufferInfo.attribs );

    return bufferInfo;

}

function setTypedArrayToBuffer( gl, buffer, typedArray, drawType = gl.DYNAMIC_DRAW ) {

    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, typedArray, drawType );

}

export { createBuffersFromArrays, createBufferInfoFromArrays, isIndices, setTypedArrayToBuffer, getNumComponents, createBufferFromArray };
