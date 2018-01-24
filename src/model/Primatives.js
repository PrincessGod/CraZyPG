import * as properties from '../core/properties';
import * as Constant from '../renderer/constant';
import { Model } from '../model/Model';
import { getTypedArray } from '../renderer/typedArray';
import { getNumComponents } from '../renderer/attributes';
import { BezierCurve } from '../math/BezierCurve';

function createMesh( name, attribArrays, options ) {

    Object.keys( attribArrays ).forEach( ( prop ) => {

        if ( prop !== 'indices' ) {

            attribArrays[ prop ].data = getTypedArray( attribArrays[ prop ].data ); //eslint-disable-line
            attribArrays[ prop ].numComponents = getNumComponents( attribArrays[ prop ], prop );//eslint-disable-line

        }


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

    createModel( name, size, xOffset, yOffset ) {

        return new Model( Quad.createMesh( name, size, xOffset, yOffset ) );

    },

    createMesh( name = 'Quad', size = 1, xOffset = 0, yOffset = 0 ) {

        const helfSize = size / 2;
        const vertices = [
            xOffset + - 1 * helfSize, yOffset + 1 * helfSize,
            xOffset + - 1 * helfSize, yOffset + - 1 * helfSize,
            xOffset + 1 * helfSize, yOffset + - 1 * helfSize,
            xOffset + 1 * helfSize, yOffset + 1 * helfSize,
        ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        const normal = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        const indices = [ 0, 1, 3, 1, 2, 3 ];

        const attribArrays = {
            indices: { data: indices },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices, numComponents: 2 };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uv };
        attribArrays[ Constant.ATTRIB_NORMAL_NAME ] = { data: normal };

        return createMesh( name, attribArrays, {
            cullFace: false,
        } );

    },
} );

const Cube = {};

Object.assign( Cube, {

    createModel( name, width, height, depth, x, y, z ) {

        return new Model( Cube.createMesh( name, width, height, depth, x, y, z ) );

    },

    createMesh( name = 'Cube', width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0 ) {

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
        for ( let i = 0; i < vertices.length / 4; i += 4 )
            indices.push( i, i + 1, i + 3, i + 1, i + 2, i + 3 );

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

        return createMesh( name, attribArrays, { cullFace: false } );

    },

} );

const Sphere = {};

Object.assign( Sphere, {

    createModel( name, radius, subdivAixs, subdivHeight, startLon, endLon, startLat, endLat ) {

        return new Model( Sphere.createMesh( name, radius, subdivAixs, subdivHeight, startLon, endLon, startLat, endLat ) );

    },

    createMesh( name = 'sphere', radius = 0.5, subdivAixs = 16, subdivHeight = 8, startLon = 0, endLon = Math.PI * 2, startLat = 0, endLat = Math.PI ) {

        const latRange = endLat - startLat;
        const lonRange = endLon - startLon;

        const positions = [];
        const normals = [];
        const uvs = [];

        for ( let y = 0; y <= subdivHeight; y ++ )
            for ( let x = 0; x <= subdivAixs; x ++ ) {

                const u = x / subdivAixs;
                const v = y / subdivHeight;
                const phi = lonRange * u + startLon;
                const theta = latRange * v + startLat;
                const sinTheta = Math.sin( theta );
                const cosTheta = Math.cos( theta );
                const sinPhi = Math.sin( phi );
                const cosPhi = Math.cos( phi );
                const ux = - cosPhi * sinTheta;
                const uy = cosTheta;
                const uz = sinPhi * sinTheta;
                positions.push( radius * ux, radius * uy, radius * uz );
                normals.push( ux, uy, uz );
                uvs.push( u, 1 - v );

            }

        const numVertAround = subdivAixs + 1;
        const indices = [];
        for ( let x = 0; x < subdivAixs; x ++ )
            for ( let y = 0; y < subdivHeight; y ++ ) {

                const a = ( y + 0 ) * numVertAround + x + 1;
                const b = ( y + 0 ) * numVertAround + x;
                const c = ( y + 1 ) * numVertAround + x;
                const d = ( y + 1 ) * numVertAround + x + 1;

                if ( y !== 0 || startLat > 0 ) indices.push( a, b, d );
                if ( y !== subdivHeight - 1 || endLat < Math.PI ) indices.push( b, c, d );

            }

        const attribArrays = {
            indices: { data: indices },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: positions };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uvs };
        attribArrays[ Constant.ATTRIB_NORMAL_NAME ] = { data: normals };

        return createMesh( name, attribArrays );

    },
} );

function deIndexAttribs( modelMesh ) {

    const mesh = modelMesh.mesh || modelMesh;
    const attribArrays = mesh.attribArrays;
    const indices = attribArrays.indices.data;
    const drawMode = mesh.drawMode;
    if ( ! indices ) return;

    if ( drawMode === Constant.TRIANGLES ) {

        Object.keys( attribArrays ).forEach( ( name ) => {

            if ( name === 'indices' ) return;

            const data = attribArrays[ name ].data;
            const numComponents = attribArrays[ name ].numComponents;
            const tempAry = [];
            for ( let i = 0; i < indices.length; i ++ )
                for ( let j = 0; j < numComponents; j ++ )
                    tempAry.push( data[ indices[ i ] * numComponents + j ] );

            attribArrays[ name ].data = tempAry;

        } );

        delete attribArrays.indices;
        delete mesh.bufferInfo;
        delete mesh.vao;

    }

}

function addBarycentricAttrib( modelMesh, removeEdge = false ) {

    const mesh = modelMesh.mesh || modelMesh;
    const indices = mesh.attribArrays.indices.data;
    const Q = removeEdge ? 1 : 0;

    if ( mesh.drawMode === Constant.TRIANGLES ) {

        if ( mesh.attribArrays.indices )
            deIndexAttribs( modelMesh );

        const numVert = mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data.length / mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].numComponents;
        const barycentrics = [];
        let lastVerts = [];
        let curVerts = [];
        let map = [];
        for ( let i = 0; i < numVert / 3; i ++ ) {

            curVerts = [ indices[ i * 3 + 0 ], indices[ i * 3 + 1 ], indices[ i * 3 + 2 ] ];
            map = curVerts.map( vert => lastVerts.indexOf( vert ) ); // eslint-disable-line
            if ( map[ 0 ] === 1 && map[ 2 ] === 2 ) { // abd bcd

                barycentrics.push(
                    0, 1, 0,
                    0, 0, 1,
                    1, 0, Q,
                );
                lastVerts = [];

            } else {

                barycentrics.push(
                    0, 0, 1,
                    0, 1, 0,
                    1, 0, Q,
                );
                lastVerts = curVerts;

            }


        }

        mesh.attribArrays[ Constant.ATTRIB_BARYCENTRIC_NAME ] = { data: barycentrics, numComponents: 3 };

        delete mesh.bufferInfo;
        delete mesh.vao;

    }

}

const Curve = {

    createModel( name, points, tolerence, numPoints, highlyMinify ) {

        return new Model( Curve.createMesh( name, points, tolerence, numPoints, highlyMinify ) );

    },

    createMesh( name = 'curve', points, tolerence, numPoints, highlyMinify ) {

        let bpoints = [];
        for ( let i = 0; i < Math.floor( ( points.length - 1 ) / 3 ); i ++ ) {

            bpoints.pop();
            bpoints = bpoints.concat( BezierCurve.getPoints( points[ i * 3 + 0 ], points[ i * 3 + 1 ], points[ i * 3 + 2 ], points[ i * 3 + 3 ], tolerence, numPoints, highlyMinify ) );

        }
        bpoints = bpoints.map( vec3 => vec3.getArray() );
        const vertices = bpoints.reduce( ( a, b ) => a.concat( b ) );

        const attribArrays = {};
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices };

        return createMesh( name, attribArrays, { drawMode: Constant.LINE_STRIP } );

    },

};

export { GridAxis, Quad, Cube, Sphere, createMesh, deIndexAttribs, addBarycentricAttrib, Curve };
