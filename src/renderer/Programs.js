import { ShaderParams, UniformTypes, TextureType } from '../core/constant';

const programsMap = new WeakMap();

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
    return function ( textureOrPair ) {

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

    };

}

function samplerArraySetter( gl, type, unit, location, size ) {

    const bindPoint = getBindPointForSamplerType( gl, type );
    const units = new Int32Array( size );
    for ( let ii = 0; ii < size; ++ ii )
        units[ ii ] = unit + ii;

    return function ( textures ) {

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

    };

}

typeMap[ UniformTypes.FLOAT ] = {
    Type: Float32Array, size: 4, setter: floatSetter, arraySetter: floatArraySetter,
};
typeMap[ UniformTypes.FLOAT_VEC2 ] = { Type: Float32Array, size: 8, setter: floatVec2Setter };
typeMap[ UniformTypes.FLOAT_VEC3 ] = { Type: Float32Array, size: 12, setter: floatVec3Setter };
typeMap[ UniformTypes.FLOAT_VEC4 ] = { Type: Float32Array, size: 16, setter: floatVec4Setter };
typeMap[ UniformTypes.INT ] = {
    Type: Int32Array, size: 4, setter: intSetter, arraySetter: intArraySetter,
};
typeMap[ UniformTypes.INT_VEC2 ] = { Type: Int32Array, size: 8, setter: intVec2Setter };
typeMap[ UniformTypes.INT_VEC3 ] = { Type: Int32Array, size: 12, setter: intVec3Setter };
typeMap[ UniformTypes.INT_VEC4 ] = { Type: Int32Array, size: 16, setter: intVec4Setter };
typeMap[ UniformTypes.UNSIGNED_INT ] = {
    Type: Uint32Array, size: 4, setter: uintSetter, arraySetter: uintArraySetter,
};
typeMap[ UniformTypes.UNSIGNED_INT_VEC2 ] = { Type: Uint32Array, size: 8, setter: uintVec2Setter };
typeMap[ UniformTypes.UNSIGNED_INT_VEC3 ] = { Type: Uint32Array, size: 12, setter: uintVec3Setter };
typeMap[ UniformTypes.UNSIGNED_INT_VEC4 ] = { Type: Uint32Array, size: 16, setter: uintVec4Setter };
typeMap[ UniformTypes.BOOL ] = {
    Type: Uint32Array, size: 4, setter: intSetter, arraySetter: intArraySetter,
};
typeMap[ UniformTypes.BOOL_VEC2 ] = { Type: Uint32Array, size: 8, setter: intVec2Setter };
typeMap[ UniformTypes.BOOL_VEC3 ] = { Type: Uint32Array, size: 12, setter: intVec3Setter };
typeMap[ UniformTypes.BOOL_VEC4 ] = { Type: Uint32Array, size: 16, setter: intVec4Setter };
typeMap[ UniformTypes.FLOAT_MAT2 ] = { Type: Float32Array, size: 16, setter: floatMat2Setter };
typeMap[ UniformTypes.FLOAT_MAT3 ] = { Type: Float32Array, size: 36, setter: floatMat3Setter };
typeMap[ UniformTypes.FLOAT_MAT4 ] = { Type: Float32Array, size: 64, setter: floatMat4Setter };
typeMap[ UniformTypes.FLOAT_MAT2x3 ] = { Type: Float32Array, size: 24, setter: floatMat23Setter };
typeMap[ UniformTypes.FLOAT_MAT2x4 ] = { Type: Float32Array, size: 32, setter: floatMat24Setter };
typeMap[ UniformTypes.FLOAT_MAT3x2 ] = { Type: Float32Array, size: 24, setter: floatMat32Setter };
typeMap[ UniformTypes.FLOAT_MAT3x4 ] = { Type: Float32Array, size: 48, setter: floatMat34Setter };
typeMap[ UniformTypes.FLOAT_MAT4x2 ] = { Type: Float32Array, size: 32, setter: floatMat42Setter };
typeMap[ UniformTypes.FLOAT_MAT4x3 ] = { Type: Float32Array, size: 48, setter: floatMat43Setter };
typeMap[ UniformTypes.SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D,
};
typeMap[ UniformTypes.SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_CUBE_MAP,
};
typeMap[ UniformTypes.SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_3D,
};
typeMap[ UniformTypes.SAMPLER_2D_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D,
};
typeMap[ UniformTypes.SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D_ARRAY,
};
typeMap[ UniformTypes.SAMPLER_2D_ARRAY_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D_ARRAY,
};
typeMap[ UniformTypes.SAMPLER_CUBE_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_CUBE_MAP,
};
typeMap[ UniformTypes.FLOAT_MAT4x2INT_SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D,
};
typeMap[ UniformTypes.FLOAT_MAT4x2INT_SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_3D,
};
typeMap[ UniformTypes.FLOAT_MAT4x2INT_SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_CUBE_MAP,
};
typeMap[ UniformTypes.FLOAT_MAT4x2INT_SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D_ARRAY,
};
typeMap[ UniformTypes.FLOAT_MAT4x2UNSIGNED_INT_SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D,
};
typeMap[ UniformTypes.FLOAT_MAT4x2UNSIGNED_INT_SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_3D,
};
typeMap[ UniformTypes.FLOAT_MAT4x2UNSIGNED_INT_SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_CUBE_MAP,
};
typeMap[ UniformTypes.FLOAT_MAT4x2UNSIGNED_INT_SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TextureType.TEXTURE_2D_ARRAY,
};

function floatAttribSetter( gl, index ) {

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        gl.enableVertexAttribArray( index );
        gl.vertexAttribPointer( index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0 );

        if ( b.divisor !== undefined )
            gl.vertexAttribDivisor( index, b.divisor );

    };

}

function intAttribSetter( gl, index ) {

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        gl.enableVertexAttribArray( index );
        gl.vertexAttribIPointer( index, b.numComponents || b.size, b.type || gl.INT, b.stride || 0, b.offset || 0 );

        if ( b.divisor !== undefined )
            gl.vertexAttribDivisor( index, b.divisor );

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

            if ( b.divisor !== undefined )
                gl.vertexAttribDivisor( index + i, b.divisor );

        }

    };

}

const attrTypeMap = {};
attrTypeMap[ UniformTypes.FLOAT ] = { size: 4, setter: floatAttribSetter };
attrTypeMap[ UniformTypes.FLOAT_VEC2 ] = { size: 8, setter: floatAttribSetter };
attrTypeMap[ UniformTypes.FLOAT_VEC3 ] = { size: 12, setter: floatAttribSetter };
attrTypeMap[ UniformTypes.FLOAT_VEC4 ] = { size: 16, setter: floatAttribSetter };
attrTypeMap[ UniformTypes.INT ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ UniformTypes.INT_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ UniformTypes.INT_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ UniformTypes.INT_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ UniformTypes.UNSIGNED_INT ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ UniformTypes.UNSIGNED_INT_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ UniformTypes.UNSIGNED_INT_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ UniformTypes.UNSIGNED_INT_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ UniformTypes.BOOL ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ UniformTypes.BOOL_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ UniformTypes.BOOL_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ UniformTypes.BOOL_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ UniformTypes.FLOAT_MAT2 ] = { size: 4, setter: matAttribSetter, count: 2 };
attrTypeMap[ UniformTypes.FLOAT_MAT3 ] = { size: 9, setter: matAttribSetter, count: 3 };
attrTypeMap[ UniformTypes.FLOAT_MAT4 ] = { size: 16, setter: matAttribSetter, count: 4 };

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
            continue;
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

        if ( key.indexOf( ShaderParams.UNIFORM_PREFIX ) === 0 )
            keyMap[ key.replace( ShaderParams.UNIFORM_PREFIX, '' ) ] = key;

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

// vs fs String, opts { transformFeedbackVaryings, validateProgram }
function createProgram( gl, vs, fs, opts = {} ) {

    const vShader = createShader( gl, vs, gl.VERTEX_SHADER );
    const fShader = createShader( gl, fs, gl.FRAGMENT_SHADER );

    const prog = gl.createProgram();
    gl.attachShader( prog, vShader );
    gl.attachShader( prog, fShader );

    gl.bindAttribLocation( prog, ShaderParams.ATTRIB_POSITION_LOC, ShaderParams.ATTRIB_POSITION_NAME );
    gl.bindAttribLocation( prog, ShaderParams.ATTRIB_NORMAL_LOC, ShaderParams.ATTRIB_NORMAL_NAME );
    gl.bindAttribLocation( prog, ShaderParams.ATTRIB_UV_LOC, ShaderParams.ATTRIB_UV_NAME );
    gl.bindAttribLocation( prog, ShaderParams.ATTRIB_BARYCENTRIC_LOC, ShaderParams.ATTRIB_BARYCENTRIC_NAME );

    if ( opts.transformFeedbackVaryings ) {

        let varyings = opts.transformFeedbackVaryings;
        if ( ! Array.isArray( varyings ) )
            varyings = Object.keys( varyings );
        gl.transformFeedbackVaryings( prog, varyings, opts.transformFeedbackMode || gl.SEPARATE_ATTRIBS );

    }

    gl.linkProgram( prog );

    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS ) )
        throw new Error( `Error createing shader program.\n\n${gl.getProgramInfoLog( prog )}` );

    if ( opts.validateProgram === undefined || opts.validateProgram ) {

        gl.validateProgram( prog );
        if ( ! gl.getProgramParameter( prog, gl.VALIDATE_STATUS ) )
            throw new Error( `Error validating shader program.\n\n${gl.getProgramInfoLog( prog )}` );

    }

    gl.detachShader( prog, vShader );
    gl.detachShader( prog, fShader );
    gl.deleteShader( vShader );
    gl.deleteShader( fShader );

    return prog;

}

function createProgramInfo( gl, program ) {

    const { vs, fs, opts } = program;

    const prog = createProgram( gl, vs, fs, opts );
    const attribSetters = createAttributesSetters( gl, prog );
    const uniformSetters = createUniformSetters( gl, prog );

    return {
        program: prog,
        attribSetters,
        uniformSetters,
    };

}

function Programs( gl ) {

    this._gl = gl;

}

Object.assign( Programs.prototype, {

    get( program ) {

        return programsMap.get( program );

    },

    // { vs, fs, uniformObj, bufferInfo, needUpdate, updateInfo }
    update( program ) {

        if ( ! programsMap.has( program ) )
            programsMap.set( program, createProgramInfo( this._gl, program ) );

        const {
            uniformObj, bufferInfo, needUpdate, updateInfo,
        } = program;
        const { uniformSetters, attribSetters } = programsMap.get( program );

        if ( needUpdate ) {

            if ( updateInfo.uniform ) {

                setUniforms( uniformSetters, uniformObj );
                updateInfo.uniform = false;

            }
            if ( updateInfo.attrib ) {

                setAttributes( attribSetters, bufferInfo );
                updateInfo.attrib = false;

            }

            program.needUpdate = false; // eslint-disable-line

        }

    },

    remove( program ) {

        if ( programsMap.has( program ) ) {

            const value = programsMap.get( program );
            if ( value ) {

                this._gl.deleteProgram( value.program );
                programsMap.delete( program );

            }

        }

    },

} );
