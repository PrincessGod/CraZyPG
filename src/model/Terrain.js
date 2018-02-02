import { Mesh } from './Primatives';
import * as Constant from '../renderer/constant';
import { Perlin } from '../math/Perlin';
import { PMath } from '../math/Math';
import { Model } from '../model/Model';
import { setTypedArrayToBuffer } from '../renderer/attributes';
import { getTypedArray } from '../renderer/typedArray';

function generateNormals( vertices, rowCount, colCount, yin ) {

    let x;
    let y;
    let p;
    let pos;
    const xMax = colCount - 1;
    const yMax = rowCount - 1;
    let nx;
    let ny;
    let nz;
    let nl;
    let hl;
    let hr;
    let ht;
    let hb;
    const normals = [];

    const vtxCount = rowCount * colCount;
    for ( let i = 0; i < vtxCount; i ++ ) {

        y = Math.floor( i / colCount );
        x = i % colCount;
        pos = y * 3 * colCount + x * 3;

        if ( x > 0 ) {

            p = y * 3 * colCount + ( x - 1 ) * 3;
            hl = vertices[ p + 1 ];

        } else
            hl = vertices[ pos + 1 ];

        if ( x < xMax ) {

            p = y * 3 * colCount + ( x + 1 ) * 3;
            hr = vertices[ p + 1 ];

        } else
            hr = vertices[ pos + 1 ];

        if ( y > 0 ) {

            p = ( y - 1 ) * 3 * colCount + x * 3;
            ht = vertices[ p + 1 ];

        } else
            ht = vertices[ pos + 1 ];

        if ( y < yMax ) {

            p = ( y + 1 ) * 3 * colCount + x * 3;
            hb = vertices[ p + 1 ];

        } else
            hb = vertices[ pos + 1 ];

        nx = hl - hr;
        ny = yin;
        nz = hb - ht;
        nl = Math.sqrt( nx * nx + ny * ny + nz * nz );
        normals.push( nx / nl, ny / nl, nz / nl );

    }

    return normals;

}

const Terrain = {};

Object.assign( Terrain, {

    createModel( name, width, height, rowCount, colCount, options ) {

        const model = new Model( Terrain.createMesh( name, width, height, rowCount, colCount, options ) );
        return Object.assign( model, {

            setTime( gl, time ) {

                Terrain.setTime( gl, this.mesh, time );
                return this;

            },
            addTime( gl, timeSpan ) {

                Terrain.addTime( gl, this.mesh, timeSpan );
                return this;

            },

        } );

    },

    createMesh( name, width = 2, height = 2, rowCount = 6, colCount = 6, options ) {

        const minHeight = ( options && options.minHeight ) || 0;
        const maxHeight = ( options && options.maxHeight ) || 1;
        const baseHeight = ( options && options.baseHeight ) || 0;
        const perlinFreq = ( options && options.perlinFreq ) || 10;
        const time = ( options && options.time ) || Math.random();

        const rowStart = height / - 2;
        const colStart = width / - 2;
        const vtxCount = rowCount * colCount;
        const idxCount = ( rowCount - 1 ) * colCount;
        const rowStrid = height / ( rowCount - 1 );
        const colStrid = width / ( colCount - 1 );
        let currentRow = 0;
        let currentCol = 0;
        const vertices = [];
        const indices = [];
        const uv = [];
        const uvXStrid = 1 / ( colCount - 1 );
        const uvYStrid = 1 / ( rowCount - 1 );
        let h;

        for ( let i = 0; i < vtxCount; i ++ ) {

            currentRow = Math.floor( i / colCount );
            currentCol = i % colCount;
            h = baseHeight + PMath.map( Perlin.perlin3( currentRow / perlinFreq, currentCol / perlinFreq, time / perlinFreq ), 0, 1, minHeight, maxHeight );

            vertices.push( colStart + currentCol * colStrid, h, rowStart + currentRow * rowStrid );

            uv.push( ( currentCol === colCount - 1 ) ? 0.9999 : currentCol * uvXStrid, ( currentRow === rowCount - 1 ) ? 0.9999 : currentRow * uvYStrid );

            if ( i < idxCount ) { // TRIANGLE_STRIP

                indices.push( currentRow * colCount + currentCol, ( currentRow + 1 ) * colCount + currentCol );

                if ( currentCol === colCount - 1 && i < idxCount - 1 )
                    indices.push( ( currentRow + 1 ) * colCount + currentCol, ( currentRow + 1 ) * colCount );

            }

        }

        const normals = generateNormals( vertices, rowCount, colCount, maxHeight - minHeight );

        const attribArrays = {
            indices: { data: indices },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices, drawType: Constant.DYNAMIC_DRAW };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uv };
        attribArrays[ Constant.ATTRIB_NORMAL_NAME ] = { data: normals };
        const mesh = new Mesh( name || 'Terrain', attribArrays, { drawMode: Constant.TRIANGLE_STRIP } );
        return Object.assign( mesh, {
            time,
            minHeight,
            maxHeight,
            baseHeight,
            perlinFreq,
            rowCount,
            colCount,
        } );

    },

    setTime( gl, mesh, newTime ) {

        let vertices = mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data;
        const length = vertices.length / 3;
        const {
            minHeight,
            maxHeight,
            baseHeight,
            perlinFreq,
            rowCount,
            colCount,
        } = mesh;
        let currentRow;
        let currentCol;

        for ( let i = 0; i < length; i ++ ) {

            currentRow = Math.floor( i / colCount );
            currentCol = i % colCount;
            vertices[ i * 3 + 1 ] = baseHeight + PMath.map( Perlin.perlin3( currentRow / perlinFreq, currentCol / perlinFreq, newTime / perlinFreq ), 0, 1, minHeight, maxHeight );

        }

        vertices = getTypedArray( vertices );

        let normals = generateNormals( vertices, rowCount, colCount, maxHeight - minHeight );
        normals = getTypedArray( normals );

        mesh.time = newTime; // eslint-disable-line        
        mesh.attribArrays[ Constant.ATTRIB_NORMAL_NAME ].data = normals; // eslint-disable-line
        mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data = vertices; // eslint-disable-line

        const bufferInfo = mesh.bufferInfo;
        if ( bufferInfo ) {

            const vtxBuffer = bufferInfo.attribs[ Constant.ATTRIB_POSITION_NAME ].buffer;
            setTypedArrayToBuffer( gl, vtxBuffer, vertices );

            const normBuffer = bufferInfo.attribs[ Constant.ATTRIB_NORMAL_NAME ].buffer;
            setTypedArrayToBuffer( gl, normBuffer, normals );

        }

        return mesh;

    },

    addTime( gl, mesh, timeSpan ) {

        return Terrain.setTime( gl, mesh, mesh.time + timeSpan );

    },

} );

export { Terrain };
