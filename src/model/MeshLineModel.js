import { Model } from './Model';
import { Mesh } from './Primatives';
import { ShaderParams } from '../renderer/constant';
import { createBufferFromArray } from '../renderer/attributes';

function MeshLineModel( meshModel, widthCallback, name ) {

    const mesh = meshModel.mesh || meshModel;
    let array;
    if ( mesh && mesh.attribArrays && mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] ) {

        if ( mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].numComponents !== 3 ) {

            console.error( `MeshLine need 3 dimensions points array, but received ${mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].numComponents} dimensions array.` );
            return null;

        }
        array = mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].data;

    } else if ( Array.isArray( mesh ) ) {

        if ( mesh.length % 3 !== 0 ) {

            console.error( 'MeshLine need 3 dimensions points array, but received array\'s length divided by 3 not 0.' );
            return null;

        }
        array = mesh;

    } else {

        console.error( `MeshLine need 3 dimensions points array, but received Object ${meshModel}` );
        return null;

    }

    this.widthCallback = widthCallback;
    const meshc = this.process( array, name || ( mesh.name && `${mesh.name}_Meshline` ) || 'MeshLine' );

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

    process( array, name ) {

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

        this.positionArray = [];
        this.positionArray.push( this.previous[ 0 ], this.previous[ 1 ], this.previous[ 2 ], 0, this.previous[ 0 ], this.previous[ 1 ], this.previous[ 2 ], 0 );
        for ( let i = 0; i < this.positions.length / 3; i ++ )
            this.positionArray.push( this.positions[ i * 3 ], this.positions[ i * 3 + 1 ], this.positions[ i * 3 + 2 ], this.side[ i ] );

        this.positionArray.push( this.next[ this.next.length - 3 ], this.next[ this.next.length - 2 ], this.next[ this.next.length - 1 ], 0, this.next[ this.next.length - 3 ], this.next[ this.next.length - 2 ], this.next[ this.next.length - 1 ], 0 );

        const attribArrays = {
            indices: { data: this.indices },
            a_previous: { data: this.previous, numComponents: 3, stride: 4 * Float32Array.BYTES_PER_ELEMENT },
            a_next: {
                data: this.next, numComponents: 3, offset: 16 * Float32Array.BYTES_PER_ELEMENT, stride: 4 * Float32Array.BYTES_PER_ELEMENT,
            },
            a_side: {
                data: this.side, numComponents: 1, offset: 11 * Float32Array.BYTES_PER_ELEMENT, stride: 4 * Float32Array.BYTES_PER_ELEMENT,
            },
            a_width: { data: this.width, numComponents: 1 },
            a_counters: { data: this.conters, numComponents: 1 },
        };
        attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: this.positions, offset: 8 * Float32Array.BYTES_PER_ELEMENT, stride: 4 * Float32Array.BYTES_PER_ELEMENT };
        attribArrays[ ShaderParams.ATTRIB_UV_NAME ] = { data: this.uv };

        return new Mesh( name, attribArrays );

    },

    createBufferInfo( gl ) {

        if ( ! this.mesh.bufferInfo ) {

            const positionBuffer = createBufferFromArray( gl, this.positionArray, 'position' );
            this.mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].buffer = positionBuffer;
            this.mesh.attribArrays.a_previous.buffer = positionBuffer;
            this.mesh.attribArrays.a_next.buffer = positionBuffer;
            this.mesh.attribArrays.a_side.buffer = positionBuffer;

        }

        Model.prototype.createBufferInfo.call( this, gl );
        return this;

    },

} );

export { MeshLineModel };
