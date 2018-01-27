import { isArrayBuffer, getGLTypeFromTypedArray } from './typedArray';

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
            const typedArray = getTypedArray( getArray( array ), key );
            const buffer = array.buffer || createBufferFromTypedArray( gl, typedArray, gl.ARRAY_BUFFER, array.drawType );
            const type = getGLTypeFromTypedArray( typedArray );
            const normalization = array.normalize !== undefined ? array.normalize : false;
            const numComponents = getNumComponents( array, key );
            array.numComponents = numComponents;

            attribs[ attribName ] = {
                buffer,
                numComponents,
                type,
                normalize: normalization,
                stride: array.stride || 0,
                offset: array.offset || 0,
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
        bufferInfo.numElements = getNumElementsFromNonIndicedArrays( arrays );

    return bufferInfo;

}

function setTypedArrayToBuffer( gl, buffer, typedArray, drawType = gl.DYNAMIC_DRAW ) {

    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, typedArray, drawType );

}

export { createBuffersFromArrays, createBufferInfoFromArrays, isIndices, setTypedArrayToBuffer, getNumComponents, createBufferFromArray };
