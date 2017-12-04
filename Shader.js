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
        if(vs.length < 20) {
            vs = this.createShader(gl, this.getDomSrc(vs), gl.VERTEX_SHADER);
        }
        if(fs.length < 20) {
            fs = this.createShader(gl, this.getDomSrc(fs), gl.FRAGMENT_SHADER);
        }

        let prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
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
}