import * as properties from '../core/properties';
import * as Constant from '../renderer/constant';
import { Model } from '../model/Model';
import { getTypedArray } from '../renderer/typedArray';

function createMesh( name, attribArrays, options ) {

    Object.keys( attribArrays ).forEach( ( prop ) => {

        if ( prop !== 'indices' )
            attribArrays[ prop ].data = getTypedArray( attribArrays[ prop ].data ); //eslint-disable-line

    } );

    const mesh = Object.assign( {
        isMesh: true,
        name,
        attribArrays,
        drawMode: Constant.TRIANGLES,
    }, options );

    properties.meshs[ mesh.name ] = mesh;
    return mesh;

}

const GridAxis = {};

Object.assign( GridAxis, {

    createMesh( size = 10, div = 20 ) {

        const vertices = [];
        const color = [];
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
            a_color: { data: color, numComponents: 1 },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices };

        return createMesh( 'gridAxis', attribArrays, { drawMode: Constant.LINES } );

    },

} );

const Quad = {};

Object.assign( Quad, {

    createModel() {

        return new Model( Quad.createMesh() );

    },

    createMesh( name ) {

        const vertices = [ - 0.5, 0.5, 0, - 0.5, - 0.5, 0, 0.5, - 0.5, 0, 0.5, 0.5, 0 ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        const indices = [ 0, 1, 2, 2, 3, 0 ];

        const attribArrays = {
            indices: { numComponents: 3, data: indices },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uv };

        return createMesh( name || 'Quad', attribArrays, {
            cullFace: false,
            blend: true,
        } );

    },
} );

const Quad2Unit = {};

Object.assign( Quad2Unit, {

    createModel() {

        return new Model( Quad2Unit.createMesh() );

    },

    createMesh( name ) {

        const vertices = [ - 1, 1, 0, - 1, - 1, 0, 1, - 1, 0, 1, - 1, 0, 1, 1, 0, - 1, 1, 0 ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0 ];

        const attribArrays = {};
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uv };

        return createMesh( name || 'Quad2Unit', attribArrays );

    },
} );

const Cube = {};

Object.assign( Cube, {

    createModel( name ) {

        return new Model( Cube.createMesh( name ) );

    },

    createMesh( name, width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0 ) {

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
            indices: { data: indices },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices, numComponents: 4 };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uv };
        attribArrays[ Constant.ATTRIB_NORMAL_NAME ] = { data: normal };

        return createMesh( name || 'Cube', attribArrays, { cullFace: false } );

    },

} );

export { GridAxis, Quad, Quad2Unit, Cube, createMesh };
