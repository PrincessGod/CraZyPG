import { GLDataType } from './constant';

function isTypedArray( array ) {

    return (
        array instanceof Int8Array
     || array instanceof Int16Array
     || array instanceof Int32Array
     || array instanceof Uint8Array
     || array instanceof Uint8ClampedArray
     || array instanceof Uint16Array
     || array instanceof Uint32Array
     || array instanceof Float32Array
     || array instanceof Float64Array
    );

}

function isArrayBuffer( array ) {

    return ( array instanceof ArrayBuffer && Object.prototype.toString.call( array ) === '[object ArrayBuffer]' );

}

const glTypeToTypedArray = {};
{

    const tt = glTypeToTypedArray;
    tt[ GLDataType.BYTE ] = Int8Array;
    tt[ GLDataType.UNSIGNED_BYTE ] = Uint8Array;
    tt[ GLDataType.SHORT ] = Int16Array;
    tt[ GLDataType.UNSIGNED_SHORT ] = Uint16Array;
    tt[ GLDataType.INT ] = Int32Array;
    tt[ GLDataType.UNSIGNED_INT ] = Uint32Array;
    tt[ GLDataType.FLOAT ] = Float32Array;
    tt[ GLDataType.UNSIGNED_SHORT_4_4_4_4 ] = Uint16Array;
    tt[ GLDataType.UNSIGNED_SHORT_5_5_5_1 ] = Uint16Array;
    tt[ GLDataType.UNSIGNED_SHORT_5_6_5 ] = Uint16Array;
    tt[ GLDataType.HALF_FLOAT ] = Uint16Array;
    tt[ GLDataType.UNSIGNED_INT_2_10_10_10_REV ] = Uint32Array;
    tt[ GLDataType.UNSIGNED_INT_10F_11F_11F_REV ] = Uint32Array;
    tt[ GLDataType.UNSIGNED_INT_5_9_9_9_REV ] = Uint32Array;
    tt[ GLDataType.FLOAT_32_UNSIGNED_INT_24_8_REV ] = Uint32Array;
    tt[ GLDataType.UNSIGNED_INT_24_8 ] = Uint32Array;

}

function getGLTypeFromTypedArrayType( typedArrayType ) {

    switch ( typedArrayType ) {

    case Int8Array:
        return GLDataType.BYTE;
    case Uint8Array:
        return GLDataType.UNSIGNED_BYTE;
    case Uint8ClampedArray:
        return GLDataType.UNSIGNED_BYTE;
    case Int16Array:
        return GLDataType.SHORT;
    case Uint16Array:
        return GLDataType.UNSIGNED_SHORT;
    case Int32Array:
        return GLDataType.INT;
    case Uint32Array:
        return GLDataType.UNSIGNED_INT;
    case Float32Array:
        return GLDataType.FLOAT;
    default:
        throw new Error( 'unsupported typed array type' );

    }

}

function getGLTypeFromTypedArray( typedArray ) {

    if ( typedArray instanceof Int8Array ) return GLDataType.BYTE;
    if ( typedArray instanceof Uint8Array ) return GLDataType.UNSIGNED_BYTE;
    if ( typedArray instanceof Uint8ClampedArray ) return GLDataType.UNSIGNED_BYTE;
    if ( typedArray instanceof Int16Array ) return GLDataType.SHORT;
    if ( typedArray instanceof Uint16Array ) return GLDataType.UNSIGNED_SHORT;
    if ( typedArray instanceof Int32Array ) return GLDataType.INT;
    if ( typedArray instanceof Uint32Array ) return GLDataType.UNSIGNED_INT;
    if ( typedArray instanceof Float32Array ) return GLDataType.FLOAT;
    throw new Error( 'unsupported typed array type' );

}

function getTypedArrayTypeFromGLType( type ) {

    const arrayType = glTypeToTypedArray[ type ];
    if ( ! arrayType ) throw new Error( 'unkonw gl type' );
    return arrayType;

}

function getTypedArray( array, Type = Float32Array ) {

    if ( isTypedArray( array ) )
        return array;
    if ( Array.isArray( array ) || isArrayBuffer( array ) )
        return new Type( array );
    throw new Error( 'unkonw array type' );

}

export {
    isTypedArray,
    isArrayBuffer,
    getTypedArray,
    getGLTypeFromTypedArray,
    getGLTypeFromTypedArrayType,
    getTypedArrayTypeFromGLType,
};
