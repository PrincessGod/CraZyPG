import { Primitive } from '../Primitive';
import { ShaderParams, IndicesKey } from '../../core/constant';

// { ...Primitive.opts, width, height, depth }
function Cube( opts ) {

    const {
        width, height, depth,
    } = opts;
    Primitive.call( this, this.createAttribArrays( width, height, depth ), Object.assign( { name: 'Cube' }, opts ) );

}

Cube.prototype = Object.assign( Object.create( Primitive.prototype ), {

    constructor: Cube,

    createAttribArrays( width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0 ) {

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

        const attribArrays = {};
        attribArrays[ IndicesKey ] = { data: indices };
        attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: vertices, numComponents: 4 };
        attribArrays[ ShaderParams.ATTRIB_UV_NAME ] = { data: uv };
        attribArrays[ ShaderParams.ATTRIB_NORMAL_NAME ] = { data: normal };

        return attribArrays;

    },

} );

export { Cube };
