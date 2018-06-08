import { ShaderParams } from '../../core/constant';
import { Primitive } from '../Primitive';

// { ...Primitive.opts, size, div }
function GridAxis( opts ) {

    const { size, div } = opts;
    Primitive.call( this, this.createAttribArrays( size, div ), Object.assign( { name: 'GridAxis' }, opts ) );

}

GridAxis.prototype = Object.assign( Object.create( Primitive.prototype ), {

    constructor: GridAxis,

    createAttribArrays( size = 10, div = 20 ) {

        const colors = [
            [ 0.5, 0.5, 0.5 ],
            [ 1, 0, 0 ],
            [ 0, 1, 0 ],
            [ 0, 0, 1 ],
        ];
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
            color.push( ...colors[ 0 ] );

            vertices.push( p );
            vertices.push( 0 );
            vertices.push( - half );
            color.push( ...colors[ 0 ] );

            vertices.push( - half );
            vertices.push( 0 );
            vertices.push( p );
            color.push( ...colors[ 0 ] );

            vertices.push( half );
            vertices.push( 0 );
            vertices.push( p );
            color.push( ...colors[ 0 ] );

        }

        vertices.push( 0 );
        vertices.push( 0.001 );
        vertices.push( 0 );
        color.push( ...colors[ 1 ] );

        vertices.push( half );
        vertices.push( 0.001 );
        vertices.push( 0 );
        color.push( ...colors[ 1 ] );

        vertices.push( 0 );
        vertices.push( 0.001 );
        vertices.push( 0 );
        color.push( ...colors[ 2 ] );

        vertices.push( 0 );
        vertices.push( half );
        vertices.push( 0 );
        color.push( ...colors[ 2 ] );

        vertices.push( 0 );
        vertices.push( 0.001 );
        vertices.push( 0 );
        color.push( ...colors[ 3 ] );

        vertices.push( 0 );
        vertices.push( 0.001 );
        vertices.push( half );
        color.push( ...colors[ 3 ] );

        const attribArrays = {};
        attribArrays[ ShaderParams.ATTRIB_VERTEX_COLOR_NAME ] = { data: color, numComponents: 3 };
        attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: vertices, numComponents: 3 };
        return attribArrays;

    },

} );

export { GridAxis };
