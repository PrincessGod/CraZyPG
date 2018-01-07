import { createMesh } from './Primatives';
import * as Constant from '../renderer/constant';

const Terrain = {};

Object.assign( Terrain, {

    createMesh( width, height, rowCount, colCount ) {

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

        for ( let i = 0; i < vtxCount; i ++ ) {

            currentRow = Math.floor( i / colCount );
            currentCol = i % colCount;

            vertices.push( colStart + currentCol * colStrid, 0.2, rowStart + currentRow * rowStrid );

            uv.push( ( currentCol === colCount - 1 ) ? 0.9999 : currentCol * uvXStrid, ( currentRow === rowCount - 1 ) ? 0.9999 : currentRow * uvYStrid );

            if ( i < idxCount ) { // TRIANGLE_STRIP

                indices.push( currentRow * colCount + currentCol, ( currentRow + 1 ) * colCount + currentCol );

                if ( currentCol === colCount - 1 && i < idxCount - 1 )
                    indices.push( ( currentRow + 1 ) * colCount + currentCol, ( currentRow + 1 ) * colCount );

            }

        }

        const attribArrays = {
            indices: { data: indices },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: uv };
        return createMesh( 'Terrain', attribArrays );

    },

} );

export { Terrain };
