import * as Locations from '../renderer/constant';
import * as properties from '../core/properties';
import { createMeshVAO, gl } from '../core/gl';
import { Model } from '../model/Model';

const Primatives = {};
Primatives.GridAxis = class {

    static createMesh() {

        const vertices = [];
        const size = 2;
        const div = 10.0;
        const step = size / div;
        const half = size / 2;

        let p;
        for ( let i = 0; i <= div; i ++ ) {

            p = - half + ( i * step );
            vertices.push( p );
            vertices.push( 0 );
            vertices.push( half );
            vertices.push( 0 );

            vertices.push( p );
            vertices.push( 0 );
            vertices.push( - half );
            vertices.push( 0 );

            vertices.push( - half );
            vertices.push( 0 );
            vertices.push( p );
            vertices.push( 0 );

            vertices.push( half );
            vertices.push( 0 );
            vertices.push( p );
            vertices.push( 0 );

        }

        vertices.push( - half );
        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( 1 );

        vertices.push( half );
        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( 1 );

        vertices.push( 0 );
        vertices.push( - half );
        vertices.push( 0 );
        vertices.push( 2 );

        vertices.push( 0 );
        vertices.push( half );
        vertices.push( 0 );
        vertices.push( 2 );

        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( - half );
        vertices.push( 3 );

        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( half );
        vertices.push( 3 );

        const attrColorLoc = 4;
        const mesh = {
            drawMode: gl.LINES,
            vao: gl.createVertexArray(),
        };

        mesh.vtxComponents = 4;
        mesh.vtxCount = vertices.length / mesh.vtxComponents;
        const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vtxComponents;

        mesh.vtxBuffer = gl.createBuffer();
        gl.bindVertexArray( mesh.vao );
        gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vtxBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
        gl.enableVertexAttribArray( Locations.VTX_ATTR_POSITION_LOC );
        gl.enableVertexAttribArray( attrColorLoc );

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

        gl.bindBuffer( gl.ARRAY_BUFFER, null );
        gl.bindVertexArray( null );
        properties.meshs.gridAxis = mesh;
        return mesh;

    }

};

Primatives.Quad = class {

    static createModal() {

        return new Model( Primatives.Quad.createMesh() );

    }

    static createMesh() {

        const vtx = [ - 0.5, 0.5, 0, - 0.5, - 0.5, 0, 0.5, - 0.5, 0, 0.5, 0.5, 0 ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        const indices = [ 0, 1, 2, 2, 3, 0 ];

        const mesh = createMeshVAO( 'Quad', indices, vtx, null, uv );
        mesh.offCullFace = true;
        mesh.onBlend = true;
        return mesh;

    }

};

Primatives.Cube = class {

    static createModal( name ) {

        return new Model( Primatives.Cube.createMesh( name, 1, 1, 1, 0, 0, 0 ) );

    }

    static createMesh( name, width, height, depth, x, y, z ) {

        const w = width * 0.5;
        const h = height * 0.5;
        const d = depth * 0.5;

        const x0 = x - w;
        const x1 = x + w;
        const y0 = y - h;
        const y1 = y + h;
        const z0 = z - d;
        const z1 = z + d;

        const vtxArray = [
            x0, y1, z1, 0, // 0 Front
            x0, y0, z1, 0, // 1
            x1, y0, z1, 0, // 2
            x1, y1, z1, 0, // 3

            x1, y1, z0, 1, // 4 Back
            x1, y0, z0, 1, // 5
            x0, y0, z0, 1, // 6
            x0, y1, z0, 1, // 7

            x0, y1, z0, 2, // 7 Left
            x0, y0, z0, 2, // 6
            x0, y0, z1, 2, // 1
            x0, y1, z1, 2, // 0

            x0, y0, z1, 3, // 1 Bottom
            x0, y0, z0, 3, // 6
            x1, y0, z0, 3, // 5
            x1, y0, z1, 3, // 2

            x1, y1, z1, 4, // 3 Right
            x1, y0, z1, 4, // 2
            x1, y0, z0, 4, // 5
            x1, y1, z0, 4, // 4

            x0, y1, z0, 5, // 7 Top
            x0, y1, z1, 5, // 0
            x1, y1, z1, 5, // 3
            x1, y1, z0, 5, // 4
        ];

        const indexArray = [];
        for ( let i = 0; i < vtxArray.length / 4; i += 2 )
            indexArray.push( i, i + 1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

        const uvArray = [];
        for ( let i = 0; i < 6; i ++ )
            uvArray.push( 0, 0, 0, 1, 1, 1, 1, 0 );

        const normalArray = [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Front
            0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, // Back
            - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, // Left
            0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, // Bottom
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Right
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // Top
        ];

        const mesh = createMeshVAO( name || 'Cube', indexArray, vtxArray, normalArray, uvArray, 4 );
        mesh.offCullFace = true;
        return mesh;

    }

};

export { Primatives };
