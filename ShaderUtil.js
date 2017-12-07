class ShaderUtil{
    static getDomSrc(id) {
        let ele = document.getElementById(id);
        if(!ele || ele.textContent == '') {
            console.error(id + ' shader element not have text.');
            return null;
        }
        return ele.textContent;
    }

    static createShader(gl, src, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader: ' + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static createProgram(gl, vs, fs, doValidate = true) {
        if(!(vs instanceof WebGLShader) && vs.length < 20) {
            let src = this.getDomSrc(vs);
            if(!src) { return null; }
            vs = this.createShader(gl, src, gl.VERTEX_SHADER);
            if(!vs) { return null; }
        } else if(!(vs instanceof WebGLShader)) {
            vs = this.createShader(gl, vs, gl.VERTEX_SHADER);
            if(!vs) { return null; }
        }
        if(!(fs instanceof WebGLShader) && fs.length < 20) {
            let src = this.getDomSrc(fs);
            if(!src) { return null; }
            fs = this.createShader(gl, src, gl.FRAGMENT_SHADER);
            if(!fs) { return null; }
        } else if(!(fs instanceof WebGLShader)) {
            fs = this.createShader(gl, fs, gl.FRAGMENT_SHADER);
            if(!fs) { return null; }            
        }

        let prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);

        gl.bindAttribLocation(prog, VTX_ATTR_POSITION_LOC, VTX_ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, VTX_ATTR_NORMAL_LOC, VTX_ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, VTX_ATTR_UV_LOC, VTX_ATTR_UV_NAME);
        
        gl.linkProgram(prog);

        if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Error createing shader program.', gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }

        if(doValidate) {
            gl.validateProgram(prog);
            if(!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.error('Error validating shader program.', gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }

        gl.detachShader(prog, vs);
        gl.detachShader(prog, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);

        return prog;
    }

    static getDefaultAttribLocation(gl, program) {
        return {
            position: gl.getAttribLocation(program, VTX_ATTR_POSITION_NAME),
            normal: gl.getAttribLocation(program, VTX_ATTR_NORMAL_NAME),
            uv: gl.getAttribLocation(program, VTX_ATTR_UV_NAME)
        };
    }
}
