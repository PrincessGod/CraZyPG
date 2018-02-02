import { FileLoader } from './Fileloader';
import { Mesh } from '../model/Primatives';

function LinePaser( ) {

    this.line = '';
    this.cArray = [];

}

Object.assign( LinePaser.prototype, {

    init( line ) {

        this.line = line.trim().split( ' ' );

    },

    getType() {

        return this.line[ 0 ];

    },

    getFloatData( count ) {

        let length = count;
        this.cArray = [];
        while ( length > 0 )
            this.cArray.unshift( parseFloat( this.line[ length -- ] ) );

        return this.cArray;

    },

} );

const ObjLoader = {
    flipYUV: true,
};

Object.assign( ObjLoader, {

    load( filePath ) {

        return FileLoader.load( filePath )
            .then( ObjLoader.parse )
            .catch( err => console.error( 'Load obj error: ', err ) );

    },

    parse( objText, flipYUV ) {

        const flip = flipYUV === undefined ? ObjLoader.flipYUV : flipYUV;
        const lines = objText.split( '\n' );
        lines.push( null );
        let line;
        let index = 0;

        let currentObject = null;
        const objects = [];

        let v = [];
        let vt = [];
        let vn = [];

        const oVert = [];
        const oUV = [];
        const oNorm = [];
        const oIndex = [];

        const fCache = {};
        let vertCount = 0;
        let isQuad = false;
        let i;
        let ary;
        let ind;

        line = lines[ index ++ ];
        const linePaser = new LinePaser();
        let type;
        while ( line !== null ) {

            linePaser.init( line );
            line = lines[ index ++ ];
            type = linePaser.getType();

            switch ( type ) {

            case 'v':
                v = v.concat( linePaser.getFloatData( 3 ) );
                continue;
            case 'vt':
                vt = vt.concat( linePaser.getFloatData( 2 ) );
                continue;
            case 'vn':
                vn = vn.concat( linePaser.getFloatData( 3 ) );
                continue;
            case 'f':
                linePaser.line.shift();

                if ( linePaser.line.length < 3 ) // less than 3 vertex
                    continue;

                isQuad = false;

                for ( i = 0; i < linePaser.line.length; i ++ ) {

                    if ( i > 3 ) {

                        console.error( 'OBJ Loader not support multiple vertices face!' );
                        break;

                    }

                    if ( i === 3 && ! isQuad ) {

                        i = 2;
                        isQuad = true;

                    }

                    if ( linePaser.line[ i ] in fCache )
                        oIndex.push( fCache[ linePaser.line[ i ] ] );
                    else {

                        ary = linePaser.line[ i ].split( '/' );

                        ind = ( parseInt( ary[ 0 ], 10 ) - 1 ) * 3;
                        oVert.push( v[ ind ], v[ ind + 1 ], v[ ind + 2 ] );

                        ind = ( parseInt( ary[ 2 ], 10 ) - 1 ) * 3;
                        oNorm.push( vn[ ind ], vn[ ind + 1 ], vn[ ind + 2 ] );

                        if ( ary[ 1 ] !== '' ) {

                            ind = ( parseInt( ary[ 1 ], 10 ) - 1 ) * 2;
                            oUV.push( vt[ ind ], flip ? ( 1 - vt[ ind + 1 ] ) : vt[ ind + 1 ] );

                        }

                        fCache[ linePaser.line[ i ] ] = vertCount;
                        oIndex.push( vertCount );
                        vertCount ++;

                    }

                    if ( i === 3 && isQuad )
                        oIndex.push( fCache[ linePaser.line[ 0 ] ] );

                }
                continue;
            case 'o':
            case 'g':
                if ( currentObject !== null ) {

                    const attribArrays = {
                        a_position: { data: oVert.slice() },
                        indices: { data: oIndex.slice() },
                    };

                    if ( oUV.length > 0 )
                        attribArrays.a_uv = { data: oUV.slice() };

                    if ( oNorm.length > 0 )
                        attribArrays.a_normal = { data: oNorm.slice() };

                    objects.push( new Mesh( currentObject, attribArrays ) );

                }

                currentObject = linePaser.line[ 1 ];
                oVert.length = 0;
                oIndex.length = 0;
                oUV.length = 0;
                oNorm.length = 0;
                vertCount = 0;
                continue;
            default:
                continue;

            }

        }

        if ( currentObject !== null ) {

            const attribArrays = {
                a_position: { data: oVert },
                indices: { data: oIndex },
            };

            if ( oUV.length > 0 )
                attribArrays.a_uv = { data: oUV };

            if ( oNorm.length > 0 )
                attribArrays.a_normal = { data: oNorm };

            objects.push( new Mesh( currentObject, attribArrays ) );

        }

        return objects;

    },

} );

export { ObjLoader };
