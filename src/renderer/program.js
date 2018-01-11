import { isWebGL2 } from './utils';
import * as Constant from './constant';

function getHTMLElementSrc( id ) {

    const ele = document.getElementById( id );

    if ( ! ele || ele.textContent === '' )
        throw new Error( `${id} shader element does not exist or have text.` );


    return ele.textContent;

}

function addLineNum( str ) {

    const lines = str.split( '\n' );
    const limitLength = ( lines.length + 1 ).toString().length + 6;
    let prefix;
    return lines.map( ( line, index ) => {

        prefix = `0:${index + 1}`;
        if ( prefix.length >= limitLength )
            return prefix.substring( 0, limitLength ) + line;

        for ( let i = 0; i < limitLength - prefix.length; i ++ )
            prefix += ' ';

        return prefix + line;

    } ).join( '\n' );

}

function createShader( gl, src, type ) {

    const shader = gl.createShader( type );
    gl.shaderSource( shader, src );
    gl.compileShader( shader );

    if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
        throw new Error( `Error compiling shader: \n${addLineNum( src )} \n\n${gl.getShaderInfoLog( shader )}` );

    return shader;

}

function createProgram( gl, vs, fs ) {

    let vShader;
    let fShader;

    if ( typeof vs === 'string' && vs.length < 20 ) {

        const src = getHTMLElementSrc( vs );
        vShader = createShader( gl, src, gl.VERTEX_SHADER );

    } else if ( typeof vs === 'string' )
        vShader = createShader( gl, vs, gl.VERTEX_SHADER );

    if ( typeof fs === 'string' && fs.length < 20 ) {

        const src = getHTMLElementSrc( fs );
        fShader = createShader( gl, src, gl.FRAGMENT_SHADER );

    } else if ( typeof fs === 'string' )
        fShader = createShader( gl, fs, gl.FRAGMENT_SHADER );

    const prog = gl.createProgram();
    gl.attachShader( prog, vShader );
    gl.attachShader( prog, fShader );
    gl.linkProgram( prog );

    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS ) )
        throw new Error( `Error createing shader program.\n\n${gl.getProgramInfoLog( prog )}` );


    gl.validateProgram( prog );
    if ( ! gl.getProgramParameter( prog, gl.VALIDATE_STATUS ) )
        throw new Error( `Error validating shader program.\n\n${gl.getProgramInfoLog( prog )}` );


    gl.detachShader( prog, vShader );
    gl.detachShader( prog, fShader );
    gl.deleteShader( vShader );
    gl.deleteShader( fShader );

    return prog;

}


const FLOAT = 0x1406;
const FLOAT_VEC2 = 0x8B50;
const FLOAT_VEC3 = 0x8B51;
const FLOAT_VEC4 = 0x8B52;
const INT = 0x1404;
const INT_VEC2 = 0x8B53;
const INT_VEC3 = 0x8B54;
const INT_VEC4 = 0x8B55;
const BOOL = 0x8B56;
const BOOL_VEC2 = 0x8B57;
const BOOL_VEC3 = 0x8B58;
const BOOL_VEC4 = 0x8B59;
const FLOAT_MAT2 = 0x8B5A;
const FLOAT_MAT3 = 0x8B5B;
const FLOAT_MAT4 = 0x8B5C;
const SAMPLER_2D = 0x8B5E;
const SAMPLER_CUBE = 0x8B60;
const SAMPLER_3D = 0x8B5F;
const SAMPLER_2D_SHADOW = 0x8B62;
const FLOAT_MAT2x3 = 0x8B65; // eslint-disable-line
const FLOAT_MAT2x4 = 0x8B66; // eslint-disable-line
const FLOAT_MAT3x2 = 0x8B67; // eslint-disable-line
const FLOAT_MAT3x4 = 0x8B68; // eslint-disable-line
const FLOAT_MAT4x2 = 0x8B69; // eslint-disable-line
const FLOAT_MAT4x3 = 0x8B6A; // eslint-disable-line
const SAMPLER_2D_ARRAY = 0x8DC1;
const SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
const SAMPLER_CUBE_SHADOW = 0x8DC5;
const UNSIGNED_INT = 0x1405;
const UNSIGNED_INT_VEC2 = 0x8DC6;
const UNSIGNED_INT_VEC3 = 0x8DC7;
const UNSIGNED_INT_VEC4 = 0x8DC8;
const INT_SAMPLER_2D = 0x8DCA;
const INT_SAMPLER_3D = 0x8DCB;
const INT_SAMPLER_CUBE = 0x8DCC;
const INT_SAMPLER_2D_ARRAY = 0x8DCF;
const UNSIGNED_INT_SAMPLER_2D = 0x8DD2;
const UNSIGNED_INT_SAMPLER_3D = 0x8DD3;
const UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4;
const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

const TEXTURE_2D = 0x0DE1;
const TEXTURE_CUBE_MAP = 0x8513;
const TEXTURE_3D = 0x806F;
const TEXTURE_2D_ARRAY = 0x8C1A;


const typeMap = {};

function getBindPointForSamplerType( gl, type ) {

    return typeMap[ type ].bindPoint;

}

function floatSetter( gl, location ) {

    return function ( v ) {

        gl.uniform1f( location, v );

    };

}

function floatArraySetter( gl, location ) {

    return function ( v ) {

        gl.uniform1fv( location, v );

    };

}

function floatVec2Setter( gl, location ) {

    return function ( v ) {

        gl.uniform2fv( location, v );

    };

}

function floatVec3Setter( gl, location ) {

    return function ( v ) {

        gl.uniform3fv( location, v );

    };

}

function floatVec4Setter( gl, location ) {

    return function ( v ) {

        gl.uniform4fv( location, v );

    };

}

function intSetter( gl, location ) {

    return function ( v ) {

        gl.uniform1i( location, v );

    };

}

function intArraySetter( gl, location ) {

    return function ( v ) {

        gl.uniform1iv( location, v );

    };

}

function intVec2Setter( gl, location ) {

    return function ( v ) {

        gl.uniform2iv( location, v );

    };

}

function intVec3Setter( gl, location ) {

    return function ( v ) {

        gl.uniform3iv( location, v );

    };

}

function intVec4Setter( gl, location ) {

    return function ( v ) {

        gl.uniform4iv( location, v );

    };

}

function uintSetter( gl, location ) {

    return function ( v ) {

        gl.uniform1ui( location, v );

    };

}

function uintArraySetter( gl, location ) {

    return function ( v ) {

        gl.uniform1uiv( location, v );

    };

}

function uintVec2Setter( gl, location ) {

    return function ( v ) {

        gl.uniform2uiv( location, v );

    };

}

function uintVec3Setter( gl, location ) {

    return function ( v ) {

        gl.uniform3uiv( location, v );

    };

}

function uintVec4Setter( gl, location ) {

    return function ( v ) {

        gl.uniform4uiv( location, v );

    };

}

function floatMat2Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix2fv( location, false, v );

    };

}

function floatMat3Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix3fv( location, false, v );

    };

}

function floatMat4Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix4fv( location, false, v );

    };

}

function floatMat23Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix2x3fv( location, false, v );

    };

}

function floatMat32Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix3x2fv( location, false, v );

    };

}

function floatMat24Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix2x4fv( location, false, v );

    };

}

function floatMat42Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix4x2fv( location, false, v );

    };

}

function floatMat34Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix3x4fv( location, false, v );

    };

}

function floatMat43Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix4x3fv( location, false, v );

    };

}

function samplerSetter( gl, type, unit, location ) {

    const bindPoint = getBindPointForSamplerType( gl, type );
    return isWebGL2( gl ) ? function ( textureOrPair ) {

        let texture;
        let sampler;
        if ( textureOrPair instanceof WebGLTexture ) {

            texture = textureOrPair;
            sampler = null;

        } else {

            texture = textureOrPair.texture;
            sampler = textureOrPair.sampler;

        }
        gl.uniform1i( location, unit );
        gl.activeTexture( gl.TEXTURE0 + unit );
        gl.bindTexture( bindPoint, texture );
        gl.bindSampler( unit, sampler );

    } : function ( texture ) {

        gl.uniform1i( location, unit );
        gl.activeTexture( gl.TEXTURE0 + unit );
        gl.bindTexture( bindPoint, texture );

    };

}

function samplerArraySetter( gl, type, unit, location, size ) {

    const bindPoint = getBindPointForSamplerType( gl, type );
    const units = new Int32Array( size );
    for ( let ii = 0; ii < size; ++ ii )
        units[ ii ] = unit + ii;


    return isWebGL2( gl ) ? function ( textures ) {

        gl.uniform1iv( location, units );
        textures.forEach( ( textureOrPair, index ) => {

            gl.activeTexture( gl.TEXTURE0 + units[ index ] );
            let texture;
            let sampler;
            if ( textureOrPair instanceof WebGLTexture ) {

                texture = textureOrPair;
                sampler = null;

            } else {

                texture = textureOrPair.texture;
                sampler = textureOrPair.sampler;

            }
            gl.bindSampler( unit, sampler );
            gl.bindTexture( bindPoint, texture );

        } );

    } : function ( textures ) {

        gl.uniform1iv( location, units );
        textures.forEach( ( texture, index ) => {

            gl.activeTexture( gl.TEXTURE0 + units[ index ] );
            gl.bindTexture( bindPoint, texture );

        } );

    };

}

typeMap[ FLOAT ] = {
    Type: Float32Array, size: 4, setter: floatSetter, arraySetter: floatArraySetter,
};
typeMap[ FLOAT_VEC2 ] = { Type: Float32Array, size: 8, setter: floatVec2Setter };
typeMap[ FLOAT_VEC3 ] = { Type: Float32Array, size: 12, setter: floatVec3Setter };
typeMap[ FLOAT_VEC4 ] = { Type: Float32Array, size: 16, setter: floatVec4Setter };
typeMap[ INT ] = {
    Type: Int32Array, size: 4, setter: intSetter, arraySetter: intArraySetter,
};
typeMap[ INT_VEC2 ] = { Type: Int32Array, size: 8, setter: intVec2Setter };
typeMap[ INT_VEC3 ] = { Type: Int32Array, size: 12, setter: intVec3Setter };
typeMap[ INT_VEC4 ] = { Type: Int32Array, size: 16, setter: intVec4Setter };
typeMap[ UNSIGNED_INT ] = {
    Type: Uint32Array, size: 4, setter: uintSetter, arraySetter: uintArraySetter,
};
typeMap[ UNSIGNED_INT_VEC2 ] = { Type: Uint32Array, size: 8, setter: uintVec2Setter };
typeMap[ UNSIGNED_INT_VEC3 ] = { Type: Uint32Array, size: 12, setter: uintVec3Setter };
typeMap[ UNSIGNED_INT_VEC4 ] = { Type: Uint32Array, size: 16, setter: uintVec4Setter };
typeMap[ BOOL ] = {
    Type: Uint32Array, size: 4, setter: intSetter, arraySetter: intArraySetter,
};
typeMap[ BOOL_VEC2 ] = { Type: Uint32Array, size: 8, setter: intVec2Setter };
typeMap[ BOOL_VEC3 ] = { Type: Uint32Array, size: 12, setter: intVec3Setter };
typeMap[ BOOL_VEC4 ] = { Type: Uint32Array, size: 16, setter: intVec4Setter };
typeMap[ FLOAT_MAT2 ] = { Type: Float32Array, size: 16, setter: floatMat2Setter };
typeMap[ FLOAT_MAT3 ] = { Type: Float32Array, size: 36, setter: floatMat3Setter };
typeMap[ FLOAT_MAT4 ] = { Type: Float32Array, size: 64, setter: floatMat4Setter };
typeMap[ FLOAT_MAT2x3 ] = { Type: Float32Array, size: 24, setter: floatMat23Setter };
typeMap[ FLOAT_MAT2x4 ] = { Type: Float32Array, size: 32, setter: floatMat24Setter };
typeMap[ FLOAT_MAT3x2 ] = { Type: Float32Array, size: 24, setter: floatMat32Setter };
typeMap[ FLOAT_MAT3x4 ] = { Type: Float32Array, size: 48, setter: floatMat34Setter };
typeMap[ FLOAT_MAT4x2 ] = { Type: Float32Array, size: 32, setter: floatMat42Setter };
typeMap[ FLOAT_MAT4x3 ] = { Type: Float32Array, size: 48, setter: floatMat43Setter };
typeMap[ SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,
};
typeMap[ SAMPLER_2D_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};
typeMap[ SAMPLER_2D_ARRAY_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};
typeMap[ SAMPLER_CUBE_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ INT_SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ INT_SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,
};
typeMap[ INT_SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ INT_SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};
typeMap[ UNSIGNED_INT_SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ UNSIGNED_INT_SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,
};
typeMap[ UNSIGNED_INT_SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ UNSIGNED_INT_SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};

function floatAttribSetter( gl, index ) {

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        gl.enableVertexAttribArray( index );
        gl.vertexAttribPointer( index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0 );

    };

}

function intAttribSetter( gl, index ) {

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        gl.enableVertexAttribArray( index );
        gl.vertexAttribIPointer( index, b.numComponents || b.size, b.type || gl.INT, b.stride || 0, b.offset || 0 );

    };

}

function matAttribSetter( gl, index, typeInfo ) {

    const defaultSize = typeInfo.size;
    const count = typeInfo.count;

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        const numComponents = b.size || b.numComponents || defaultSize;
        const size = numComponents / count;
        const type = b.type || gl.FLOAT;
        const typeInfoNew = typeMap[ type ];
        const stride = typeInfoNew.size * numComponents;
        const normalize = b.normalize || false;
        const offset = b.offset || 0;
        const rowOffset = stride / count;
        for ( let i = 0; i < count; ++ i ) {

            gl.enableVertexAttribArray( index + i );
            gl.vertexAttribPointer( index + i, size, type, normalize, stride, offset + ( rowOffset * i ) );

        }

    };

}

const attrTypeMap = {};
attrTypeMap[ FLOAT ] = { size: 4, setter: floatAttribSetter };
attrTypeMap[ FLOAT_VEC2 ] = { size: 8, setter: floatAttribSetter };
attrTypeMap[ FLOAT_VEC3 ] = { size: 12, setter: floatAttribSetter };
attrTypeMap[ FLOAT_VEC4 ] = { size: 16, setter: floatAttribSetter };
attrTypeMap[ INT ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ INT_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ INT_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ INT_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ BOOL ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ BOOL_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ BOOL_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ BOOL_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ FLOAT_MAT2 ] = { size: 4, setter: matAttribSetter, count: 2 };
attrTypeMap[ FLOAT_MAT3 ] = { size: 9, setter: matAttribSetter, count: 3 };
attrTypeMap[ FLOAT_MAT4 ] = { size: 16, setter: matAttribSetter, count: 4 };

function isBuiltIn( info ) {

    const name = info.name;
    return name.startsWith( 'gl_' ) || name.startsWith( 'webgl_' );

}

function createAttributesSetters( gl, program ) {

    const attribSetters = {};

    const numAttribs = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );
    for ( let i = 0; i < numAttribs; i ++ ) {

        const attribInfo = gl.getActiveAttrib( program, i );
        if ( isBuiltIn( attribInfo ) )
            continue; // eslint-disable-line
        const index = gl.getAttribLocation( program, attribInfo.name );
        const typeInfo = attrTypeMap[ attribInfo.type ];
        const setter = typeInfo.setter( gl, index, typeInfo );
        setter.location = index;
        attribSetters[ attribInfo.name ] = setter;

    }

    return attribSetters;

}

function setAttributes( setters, buffers ) {

    Object.keys( buffers ).forEach( ( attrib ) => {

        const setter = setters[ attrib ];
        if ( setter )
            setter( buffers[ attrib ] );

    } );

}

function createUniformSetters( gl, program ) {

    let textureUnit = 0;

    function createUnifromSetter( uniformInfo ) {

        const location = gl.getUniformLocation( program, uniformInfo.name );
        const isArray = ( uniformInfo.size > 1 && uniformInfo.name.substr( - 3 ) === '[0]' );
        const type = uniformInfo.type;
        const typeInfo = typeMap[ type ];
        if ( ! typeInfo )
            throw new Error( `unknown type: 0x${type.toString( 16 )}` );
        let setter;
        if ( typeInfo.bindPoint ) {

            const uint = textureUnit;
            textureUnit += uniformInfo.size;
            if ( isArray )
                setter = typeInfo.arraySetter( gl, type, uint, location, uniformInfo.size );
            else
                setter = typeInfo.setter( gl, type, uint, location, uniformInfo.size );

        } else if ( typeInfo.arraySetter && isArray )
            setter = typeInfo.arraySetter( gl, location );
        else
            setter = typeInfo.setter( gl, location );

        setter.location = location;
        return setter;

    }

    const uniformSetters = {};
    const numUnifroms = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

    for ( let i = 0; i < numUnifroms; i ++ ) {

        const uniformInfo = gl.getActiveUniform( program, i );
        if ( isBuiltIn( uniformInfo ) )
            continue; // eslint-disable-line
        let name = uniformInfo.name;
        if ( name.substr( - 3 ) === '[0]' )
            name = name.substr( 0, name.length - 3 );

        const setter = createUnifromSetter( uniformInfo );
        uniformSetters[ name ] = setter;

    }

    const keyMap = {};
    uniformSetters.keyMap = keyMap;
    Object.keys( uniformSetters ).forEach( ( key ) => {

        if ( key.indexOf( Constant.UNIFORM_PREFIX ) === 0 )
            keyMap[ key.replace( Constant.UNIFORM_PREFIX, '' ) ] = key;

    } );

    return uniformSetters;

}

function setUniforms( setters, ...unifroms ) {

    const numArgs = unifroms.length;
    for ( let i = 0; i < numArgs; i ++ ) {

        const vals = unifroms[ i ];
        if ( Array.isArray( vals ) ) {

            const numVals = vals.length;
            for ( let j = 0; j < numVals; j ++ )
                setUniforms( setters, vals[ j ] );

        } else
            Object.keys( vals ).forEach( ( name ) => {

                let setter = setters[ name ];
                if ( setter === undefined && Object.prototype.hasOwnProperty.call( setters.keyMap, name ) )
                    setter = setters[ setters.keyMap[ name ] ];

                if ( setter )
                    setter( vals[ name ] );

            } );

    }

}

function createUniformBlockSpec( gl, program ) {

    const numUnifroms = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );
    const uniformData = [];
    const uniformIndices = [];

    for ( let i = 0; i < numUnifroms; i ++ ) {

        uniformIndices.push( i );
        uniformData.push( {} );
        const uniformInfo = gl.getActiveUniform( program, i );
        if ( isBuiltIn( uniformInfo ) )
            break;
        uniformData[ i ].name = uniformInfo.name;

    }

    [
        [ 'UNIFORM_TYPE', 'type' ],
        [ 'UNIFORM_SIZE', 'size' ],
        [ 'UNIFORM_BLOCK_INDEX', 'blockIndex' ],
        [ 'UNIFORM_OFFSET', 'offset' ],
    ].forEach( ( pair ) => {

        const gname = pair[ 0 ];
        const key = pair[ 1 ];
        gl.getActiveUniforms( program, uniformIndices, gl[ gname ] ).forEach( ( value, idx ) => {

            uniformData[ idx ][ key ] = value;

        } );

    } );

    const blockSpecs = {};

    const numUniformBlock = gl.getProgramParameter( program, gl.ACTIVE_UNIFORM_BLOCKS );
    for ( let i = 0; i < numUniformBlock; i ++ ) {

        const name = gl.getActiveUniformBlockName( program, i );
        const blockSpec = {
            index: i,
            usedByVertexShader: gl.getActiveUniformBlockParameter( program, i, gl.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER ),
            usedByFragmentShader: gl.getActiveUniformBlockParameter( program, i, gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER ),
            size: gl.getActiveUniformBlockParameter( program, i, gl.UNIFORM_BLOCK_DATA_SIZE ),
            uniformIndices: gl.getActiveUniformBlockParameter( program, i, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES ),
        };

        blockSpec.used = blockSpec.usedByVertexShader || blockSpec.usedByFragmentShader;
        blockSpecs[ name ] = blockSpec;

    }

    return {
        blockSpecs,
        uniformData,
    };

}

const arraySuffixRE = /\[\d+\]\.$/;

function createUniformBlockInfo( gl, program, uniformBlockSpec, blockName ) {

    const blockSpecs = uniformBlockSpec.blockSpecs;
    const uniformData = uniformBlockSpec.uniformData;
    const blockSpec = blockSpecs[ blockName ];
    if ( ! blockSpec ) {

        console.warn( `no uniform block object named: ${blockName}` );
        return {
            name: blockName,
            uniforms: {},
        };

    }

    const array = new ArrayBuffer( blockSpec.size );
    const buffer = gl.createBuffer();
    const uniformBufferIndex = blockSpec.index;
    gl.bindBuffer( gl.UNIFORM_BUFFER, buffer );
    gl.uniformBlockBinding( program, blockSpec.index, uniformBufferIndex );

    let prefix = `${blockName}.`;
    if ( arraySuffixRE.test( prefix ) )
        prefix = prefix.replace( arraySuffixRE, '.' );

    const uniforms = {};
    blockSpec.uniformIndices.forEach( ( uniformidx ) => {

        const data = uniformData[ uniformidx ];
        const typeInfo = typeMap[ data.type ];
        const Type = typeInfo.Type;
        const length = data.size * typeInfo.size;
        let name = data.name;
        if ( name.substr( 0, prefix.length ) === prefix )
            name = name.substr( prefix.length );
        uniforms[ name ] = new Type( array, data.offset, length / Type.BYTES_PER_ELEMENT );

    } );

    return {
        name: blockName,
        array,
        typedArray: new Float32Array( array ),
        buffer,
        uniforms,
    };

}

function createUniformBlockInfos( gl, program, uniformBlockSpec ) {

    const uboInfos = {};
    Object.keys( uniformBlockSpec.blockSpecs ).forEach( ( blockName ) => {

        uboInfos[ blockName ] = createUniformBlockInfo( gl, program, uniformBlockSpec, blockName );

    } );

    return uboInfos;

}

function bindUniformBlock( gl, uniformBlockSpec, uniformBlcokInfo ) {

    const blockSpec = uniformBlockSpec.blockSpecs[ uniformBlcokInfo.name ];
    if ( blockSpec ) {

        const bufferBindIndex = blockSpec.index;
        gl.bindBufferRange( gl.UNIFORM_BUFFER, bufferBindIndex, uniformBlcokInfo.buffer, uniformBlcokInfo.offset || 0, uniformBlcokInfo.array.byteLength );

        return true;

    }
    return false;

}

function setUniformBlock( gl, uniformBlockSpec, uniformBlockInfo ) {

    if ( bindUniformBlock( gl, uniformBlockSpec, uniformBlockInfo ) )
        gl.bufferData( gl.UNIFORM_BUFFER, uniformBlockInfo.array, gl.DYNAMIC_DRAW );

}

function setBlockUniforms( uniformBlockInfo, values ) {

    const uniforms = uniformBlockInfo.uniforms;
    let changed = false;
    Object.keys( values ).forEach( ( name ) => {

        const array = uniforms[ name ];

        if ( array ) {

            const value = values[ name ];
            if ( value.length )
                array.set( value );
            else
                array[ 0 ] = value;

            changed = true;

        }

    } );

    return changed;

}

function setBlockUniformsForProgram( gl, uniformBlockSpec, uniformBlockInfos, values ) {

    Object.keys( uniformBlockInfos ).forEach( ( blockName ) => {

        if ( setBlockUniforms( uniformBlockInfos[ blockName ], values ) )
            setUniformBlock( gl, uniformBlockSpec, uniformBlockInfos[ blockName ] );
        else
            bindUniformBlock( gl, uniformBlockSpec, uniformBlockInfos[ blockName ] );

    } );

}

export {
    createProgram,
    createAttributesSetters,
    setAttributes,
    createUniformSetters,
    setUniforms,

    createUniformBlockSpec,
    createUniformBlockInfo,
    createUniformBlockInfos,
    setUniformBlock,
    setBlockUniforms,
    setBlockUniformsForProgram,
};
