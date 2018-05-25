import { ShaderParams } from '../core/constant';

const programsMap = new WeakMap();

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

function Programs( gl ) {

    this._gl = gl;

}

Object.assign( Programs.prototype, {

    get( program ) {

        return programsMap.get( program );

    },

    update( program ) {

        if ( ! programsMap.has( program ) ) {

            const { vs, fs, opts } = program;
            programsMap.set( program, createProgram( this._gl, vs, fs, opts ) );

        }

    },

} );
