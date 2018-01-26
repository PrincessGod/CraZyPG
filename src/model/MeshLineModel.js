import { Model } from './Model';
import { createMesh } from './Primatives';
import * as Constant from '../renderer/constant';

function MeshLineModel( mesh, widthCallback, name ) {

    const array = ( mesh && mesh.attribArrays && mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ] && mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data ) || mesh;

    if ( ! ( array instanceof Float32Array || Array.isArray( array ) ) ) {

        console.warn( 'MeshLine need an array of positions' );
        return;

    }

    this.name = name || ( mesh.name && `${mesh.name}_Meshline` ) || 'MeshLine';
    this.widthCallback = widthCallback;
    const meshc = this.process( array );

    Model.call( this, meshc );

}

MeshLineModel.prototype = Object.assign( Object.create( Model.prototype ), {

    constructor: MeshLineModel,

    comparePos( idx1, idx2 ) {

        const ai = idx1 * 6;
        const bi = idx2 * 6;
        return ( this.positions[ ai ] === this.positions[ bi ] && this.positions[ ai + 1 ] === this.positions[ bi + 1 ] && this.positions[ ai + 2 ] === this.positions[ bi + 2 ] );

    },

    copyPos( idx ) {

        const ai = idx * 6;
        return [ this.positions[ ai ], this.positions[ ai + 1 ], this.positions[ ai + 2 ] ];

    },

    process( array ) {

        this.positions = [];
        this.conters = [];

        for ( let i = 0; i < array.length; i += 3 ) {

            const c = i / ( array.length - 3 );
            this.positions.push( array[ i ], array[ i + 1 ], array[ i + 2 ] );
            this.positions.push( array[ i ], array[ i + 1 ], array[ i + 2 ] );
            this.conters.push( c );
            this.conters.push( c );

        }

        const l = this.positions.length / 6;

        this.previous = [];
        this.next = [];
        this.side = [];
        this.width = [];
        this.indices = [];
        this.uv = [];

        for ( let i = 0; i < l; i ++ ) {

            this.side.push( 1 );
            this.side.push( - 1 );

        }

        let w;
        for ( let i = 0; i < l; i ++ ) {

            if ( this.widthCallback ) w = this.widthCallback( i / l - 1 );
            else w = 1;
            this.width.push( w );
            this.width.push( w );

        }

        for ( let i = 0; i < l; i ++ ) {

            this.uv.push( i / ( l - 1 ), 0 );
            this.uv.push( i / ( l - 1 ), 1 );

        }

        let v;
        if ( this.comparePos( 0, l - 1 ) )
            v = this.copyPos( l - 2 );
        else
            v = this.copyPos( 0 );

        this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
        this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );

        for ( let i = 0; i < l - 1; i ++ ) {

            v = this.copyPos( i );
            this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
            this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );

        }

        for ( let i = 1; i < l; i ++ ) {

            v = this.copyPos( i );
            this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
            this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );

        }

        if ( this.comparePos( l - 1, 0 ) )
            v = this.copyPos( 1 );
        else
            v = this.copyPos( l - 1 );

        this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
        this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );

        for ( let i = 0; i < l - 1; i ++ ) {

            const n = i * 2;
            this.indices.push( n, n + 1, n + 2 );
            this.indices.push( n + 1, n + 3, n + 2 );

        }

        const attribArrays = {
            indices: { data: this.indices },
            a_previous: { data: this.previous, numComponents: 3 },
            a_next: { data: this.next, numComponents: 3 },
            a_side: { data: this.side, numComponents: 1 },
            a_width: { data: this.width, numComponents: 1 },
            a_counters: { data: this.conters, numComponents: 1 },
        };
        attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: this.positions };
        attribArrays[ Constant.ATTRIB_UV_NAME ] = { data: this.uv };

        return createMesh( this.name, attribArrays );

    },

} );

export { MeshLineModel };
