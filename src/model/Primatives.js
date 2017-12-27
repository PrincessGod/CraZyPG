import * as properties from '../core/properties';
import { Model } from '../model/Model';

const LINES = 1;
const TRIANGLES = 4;

const Primatives = {};
Primatives.GridAxis = class {

    static createMesh() {

        const vertices = [];
        const color = [];
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
            color.push( 0 );

            vertices.push( p );
            vertices.push( 0 );
            vertices.push( - half );
            color.push( 0 );

            vertices.push( - half );
            vertices.push( 0 );
            vertices.push( p );
            color.push( 0 );

            vertices.push( half );
            vertices.push( 0 );
            vertices.push( p );
            color.push( 0 );

        }

        vertices.push( - half );
        vertices.push( 0 );
        vertices.push( 0 );
        color.push( 1 );

        vertices.push( half );
        vertices.push( 0 );
        vertices.push( 0 );
        color.push( 1 );

        vertices.push( 0 );
        vertices.push( - half );
        vertices.push( 0 );
        color.push( 2 );

        vertices.push( 0 );
        vertices.push( half );
        vertices.push( 0 );
        color.push( 2 );

        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( - half );
        color.push( 3 );

        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( half );
        color.push( 3 );

        const attribArrays = {
            a_position: { data: vertices },
            a_color: { data: color, numComponents: 1 },
        };
        const mesh = {
            name: 'gridAxis',
            drawMode: LINES,
            attribArrays,
        };
        properties.meshs[ mesh.name ] = mesh;

        return mesh;

    }

};

Primatives.Quad = class {

    static createModel() {

        return new Model( Primatives.Quad.createMesh() );

    }

    static createMesh() {

        const vertices = [ - 0.5, 0.5, 0, - 0.5, - 0.5, 0, 0.5, - 0.5, 0, 0.5, 0.5, 0 ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        const indices = [ 0, 1, 2, 2, 3, 0 ];

        const attribArrays = {
            a_position: { data: vertices },
            a_uv: { data: uv },
            indices: { numComponents: 3, data: indices },
        };
        const mesh = {
            name: 'Quad',
            attribArrays,
            cullFace: false,
            blend: true,
            drawMode: TRIANGLES,
        };
        properties.meshs[ mesh.name ] = mesh;

        return mesh;

    }

};

Primatives.Cube = class {

    static createModel( name ) {

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

        const vertices = [
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

        const indices = [];
        for ( let i = 0; i < vertices.length / 4; i += 2 )
            indices.push( i, i + 1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

        const uv = [];
        for ( let i = 0; i < 6; i ++ )
            uv.push( 0, 0, 0, 1, 1, 1, 1, 0 );

        const normal = [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Front
            0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, // Back
            - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, // Left
            0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, // Bottom
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Right
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // Top
        ];

        const attribArrays = {
            a_position: { data: vertices, numComponents: 4 },
            a_uv: { data: uv },
            a_normal: { data: normal },
            indices: { data: indices },
        };
        const mesh = {
            name: name || 'Cube',
            attribArrays,
            cullFace: false,
            drawMode: TRIANGLES,
        };
        properties.meshs[ mesh.name ] = mesh;
        return mesh;

    }

};

export { Primatives };
