import * as Locations from './constant';

class ShaderUtil {

    static getDomSrc( id ) {

        const ele = document.getElementById( id );
        if ( ! ele || ele.textContent === '' ) {

            console.error( `${id} shader element dose not have text.` );
            return null;

        }
        return ele.textContent;

    }

    static createShader( gl, src, type ) {

        const shader = gl.createShader( type );
        gl.shaderSource( shader, src );
        gl.compileShader( shader );

        if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

            console.error( `Error compiling shader: ${src}`, gl.getShaderInfoLog( shader ) );
            gl.deleteShader( shader );
            return null;

        }

        return shader;

    }

    static createProgram( gl, vs, fs, doValidate = true ) {

        let vShader;
        let fShader;
        if ( ! ( vs instanceof WebGLShader ) && vs.length < 20 ) {

            const src = this.getDomSrc( vs );
            if ( ! src ) return null;

            vShader = this.createShader( gl, src, gl.VERTEX_SHADER );

            if ( ! vShader ) return null;

        } else if ( ! ( vs instanceof WebGLShader ) ) {

            vShader = this.createShader( gl, vs, gl.VERTEX_SHADER );
            if ( ! vShader ) return null;

        }
        if ( ! ( fs instanceof WebGLShader ) && fs.length < 20 ) {

            const src = this.getDomSrc( fs );
            if ( ! src ) return null;

            fShader = this.createShader( gl, src, gl.FRAGMENT_SHADER );
            if ( ! fShader ) return null;

        } else if ( ! ( fs instanceof WebGLShader ) ) {

            fShader = this.createShader( gl, fs, gl.FRAGMENT_SHADER );
            if ( ! fShader ) return null;

        }

        const prog = gl.createProgram();
        gl.attachShader( prog, vShader );
        gl.attachShader( prog, fShader );

        gl.bindAttribLocation( prog, Locations.VTX_ATTR_POSITION_LOC, Locations.VTX_ATTR_POSITION_NAME ); // eslint-disable-line
        gl.bindAttribLocation( prog, Locations.VTX_ATTR_NORMAL_LOC, Locations.VTX_ATTR_NORMAL_NAME ); // eslint-disable-line
        gl.bindAttribLocation( prog, Locations.VTX_ATTR_UV_LOC, Locations.VTX_ATTR_UV_NAME );

        gl.linkProgram( prog );

        if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS ) ) {

            console.error( 'Error createing shader program.', gl.getProgramInfoLog( prog ) );
            gl.deleteProgram( prog );
            return null;

        }

        if ( doValidate ) {

            gl.validateProgram( prog );
            if ( ! gl.getProgramParameter( prog, gl.VALIDATE_STATUS ) ) {

                console.error( 'Error validating shader program.', gl.getProgramInfoLog( prog ) );
                gl.deleteProgram( prog );
                return null;

            }

        }

        gl.detachShader( prog, vShader );
        gl.detachShader( prog, fShader );
        gl.deleteShader( vShader );
        gl.deleteShader( fShader );

        return prog;

    }

    static getDefaultAttribLocation( gl, program ) {

        return {
            position: gl.getAttribLocation( program, Locations.VTX_ATTR_POSITION_NAME ),
            normal: gl.getAttribLocation( program, Locations.VTX_ATTR_NORMAL_NAME ),
            uv: gl.getAttribLocation( program, Locations.VTX_ATTR_UV_NAME ),
        };

    }

    static getDefaultUnifomLocation( gl, program ) {

        return {
            perspective: gl.getUniformLocation( program, 'u_proj' ),
            view: gl.getUniformLocation( program, 'u_view' ),
            world: gl.getUniformLocation( program, 'u_world' ),
            texture: gl.getUniformLocation( program, 'u_texture' ),
        };

    }

}

export { ShaderUtil };
