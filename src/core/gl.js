/* eslint prefer-destructuring: 0 */
import * as Locations from './constant';
import { meshs } from './properties';

let gl; // eslint-disable-line
export function getContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    gl = canvas.getContext('webgl2', { antialias: true });
    if (!gl) {
        console.error('Please use a decent browser, this browser not support Webgl2Context.');
        return null;
    }

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return this;
}

export function clear() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
}

export function setSize(width, height, mutiplier) {
    let muti = mutiplier || 1.0;
    muti = Math.max(0, muti);
    gl.canvas.style.width = width;
    gl.canvas.style.height = height;
    gl.canvas.width = gl.canvas.clientWidth * muti;
    gl.canvas.height = gl.canvas.clientHeight * muti;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return this;
}

export function fitSize() {
    if (gl.canvas.width !== gl.canvas.clientWidth || gl.canvas.height !== gl.canvas.clientHeight) {
        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    return this;
}

export function createArrayBuffer(array, isStatic = true) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

export function createMeshVAO(name, indexArray, vtxArray, normalArray, uvArray) {
    const mesh = { drawMode: gl.TRIANGLES };

    mesh.vao = gl.createVertexArray();
    gl.bindVertexArray(mesh.vao);

    if (indexArray !== undefined && indexArray !== null) {
        mesh.indexBuffer = gl.createBuffer();
        mesh.indexCount = indexArray.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    if (vtxArray !== undefined && vtxArray !== null) {
        mesh.vtxBuffer = gl.createBuffer();
        mesh.vtxComponents = 3;
        mesh.vtxCount = vtxArray.length / mesh.vtxComponents;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vtxBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(Locations.VTX_ATTR_POSITION_LOC);
        gl.vertexAttribPointer(Locations.VTX_ATTR_POSITION_LOC, 3, gl.FLOAT, false, 0, 0);
    }

    if (normalArray !== undefined && normalArray !== null) {
        mesh.normalBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(Locations.VTX_ATTR_NORMAL_LOC);
        gl.vertexAttribPointer(Locations.VTX_ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0);
    }

    if (uvArray !== undefined && uvArray !== null) {
        mesh.uvBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(Locations.VTX_ATTR_UV_LOC);
        gl.vertexAttribPointer(Locations.VTX_ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    meshs[name] = mesh;
    return mesh;
}

export { gl };
