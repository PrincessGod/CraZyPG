import * as Locations from './constant';
import * as properties from './properties';

const Primatives = {};
Primatives.GridAxis = class {
    static createMesh(gl) {
        const vertices = [];
        const size = 2;
        const div = 10.0;
        const step = size / div;
        const half = size / 2;

        let p;
        for (let i = 0; i <= div; i++) {
            p = -half + (i * step);
            vertices.push(p);
            vertices.push(0);
            vertices.push(half);
            vertices.push(0);

            vertices.push(p);
            vertices.push(0);
            vertices.push(-half);
            vertices.push(0);

            vertices.push(-half);
            vertices.push(0);
            vertices.push(p);
            vertices.push(0);

            vertices.push(half);
            vertices.push(0);
            vertices.push(p);
            vertices.push(0);
        }

        vertices.push(-half);
        vertices.push(0);
        vertices.push(0);
        vertices.push(1);

        vertices.push(half);
        vertices.push(0);
        vertices.push(0);
        vertices.push(1);

        vertices.push(0);
        vertices.push(-half);
        vertices.push(0);
        vertices.push(2);

        vertices.push(0);
        vertices.push(half);
        vertices.push(0);
        vertices.push(2);

        vertices.push(0);
        vertices.push(0);
        vertices.push(-half);
        vertices.push(3);

        vertices.push(0);
        vertices.push(0);
        vertices.push(half);
        vertices.push(3);

        const attrColorLoc = 4;
        const mesh = {
            drawMode: gl.LINES,
            vao: gl.createVertexArray(),
        };

        mesh.vtxComponents = 4;
        mesh.vtxCount = vertices.length / mesh.vtxComponents;
        const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vtxComponents;

        mesh.vtxBuffer = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vtxBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(Locations.VTX_ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColorLoc);

        gl.vertexAttribPointer(
            Locations.VTX_ATTR_POSITION_LOC,
            3,
            gl.FLOAT,
            false,
            strideLen,
            0,
        );

        gl.vertexAttribPointer(
            attrColorLoc,
            1,
            gl.FLOAT,
            false,
            strideLen,
            Float32Array.BYTES_PER_ELEMENT * 3,
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        properties.meshs.gridAxis = mesh;
        return mesh;
    }
};

export { Primatives };
