import { ShaderUtil } from './ShaderUtil.js';

class Shader{
    constructor(gl, vs, fs) {
        this.program = ShaderUtil.createProgram(gl, vs, fs);

        if(this.program !== null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getDefaultAttribLocation(gl, this.program);
            this.uniformLoc = ShaderUtil.getDefaultUnifomLocation(gl, this.program);
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

    setPerspective(mat4Array) {
        this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, mat4Array);
        return this;
    }

    setViewMatrix(mat4Array) {
        this.gl.uniformMatrix4fv(this.uniformLoc.view, false, mat4Array);
        return this;
    }

    setWorldMatrix(mat4Array) {
        this.gl.uniformMatrix4fv(this.uniformLoc.world, false, mat4Array);
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
        this.setWorldMatrix(modal.transform.getMatrix());
        this.gl.bindVertexArray(modal.mesh.vao);
        if(modal.mesh.indexCount) {
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vtxCount);
        }
        this.gl.bindVertexArray(null);

        return this;
    }
}

export { Shader };
