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

    static createProgram(gl, vs, fs, doValidate) {
        let prog = gl.createProgram();
        gl.attchShader(prog, vs);
        gl.attchShader(prog, fs);
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
    }
}