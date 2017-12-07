class Shader{
    constructor(gl, vs, fs) {
        this.program = ShaderUtil.createProgram(gl, vs, fs);

        if(this.program !== null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getDefaultAttribLocation(gl, this.program);
            this.uniformLoc = {};
        }
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }

    deactivate() {
        this.gl.useProgram(null);
        return this;
    }

    dispose() {
        if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
            this.gl.useProgram(null);
        }
        this.gl.deleteProgram(this.program);
    }

    preRender(){}

    renderModal(modal) {
        this.gl.bindVertexArray(modal.mesh.vao);
        if(modal.mesh.indexCount) {
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vtxCount);
        }
        this.gl.bindVertexArray(null);

        return this;
    }
}
