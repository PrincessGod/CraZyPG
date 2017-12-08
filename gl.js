const CZPG = {};
const VTX_ATTR_POSITION_NAME = 'a_position';
const VTX_ATTR_POSITION_LOC = 0;
const VTX_ATTR_NORMAL_NAME = 'a_normal';
const VTX_ATTR_NORMAL_LOC = 1;
const VTX_ATTR_UV_NAME = 'a_uv';
const VTX_ATTR_UV_LOC = 2;

function getContext(canvasId) {
    let canvas = document.getElementById(canvasId);
    let gl = canvas.getContext('webgl2', {antialias: true});
    let meshs = {};
    if(!gl) {
        console.error("Please use a decent browser, this browser not support Webgl2Context.");
        return null;
    }
    CZPG.gl = gl;
    CZPG.meshs = meshs;
    return CZPG;
}

function clear() {
    let gl = this.gl;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return CZPG;
}

function setSize(width, height, mutiplier) {
    let gl = this.gl;
    mutiplier = mutiplier || 1.0;
    mutiplier = Math.max(0, mutiplier);
    gl.canvas.style.width = width;
    gl.canvas.style.height = height;
    gl.canvas.width = gl.canvas.clientWidth * mutiplier;
    gl.canvas.height = gl.canvas.clientHeight * mutiplier;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return CZPG;
}

function createArrayBuffer(array, isStatic = true) {
    let gl = this.gl;
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

function createMeshVAO(name, indexArray, vtxArray, normalArray, uvArray) {
    let gl = this.gl;
    var mesh = { darwMode: gl.TRIANGLES };

    mesh.vao = gl.createVertexArray();
    gl.bindVertexArray(mesh.vao);

    if(indexArray !== undefined && indexArray !== null) {
        mesh.indexBuffer = gl.createBuffer();
        mesh.indexCount = indexArray.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    if(vtxArray !== undefined && vtxArray !== null) {
        mesh.vtxBuffer = gl.createBuffer();
        mesh.vtxComponents = 3;
        mesh.vtxCount = vtxArray.length / mesh.vtxComponents;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vtxBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(VTX_ATTR_POSITION_LOC);
        gl.vertexAttribPointer(VTX_ATTR_POSITION_LOC, 3, gl.FLOAT, false, 0, 0);
    }

    if(normalArray !== undefined && normalArray !== null) {
        mesh.normalBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(VTX_ATTR_NORMAL_LOC);
        gl.vertexAttribPointer(VTX_ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0);
    }

    if(uvArray !== undefined && uvArray !== null) {
        mesh.uvBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(VTX_ATTR_UV_LOC);
        gl.vertexAttribPointer(VTX_ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    CZPG.meshs[name] = mesh;
    return mesh;
}

Object.assign(CZPG, {getContext, clear, setSize, createArrayBuffer, createMeshVAO});
