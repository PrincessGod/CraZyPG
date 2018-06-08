import { Primitive } from '../Primitive';
import { ShaderParams, IndicesKey } from '../../core/constant';

// { ...Primitive.opts, size }
function Quad( opts ) {

    const { size } = opts;
    Primitive.call( this, this.createAttribArrays( size ), Object.assign( { name: 'Quad' }, opts ) );

}

Quad.prototype = Object.assign( Object.create( Primitive.prototype ), {


    constructor: Quad,

    createAttribArrays( size = 1, x = 0, y = 0 ) {

        const helfSize = size / 2;
        const vertices = [
            x + - 1 * helfSize, y + 1 * helfSize,
            x + - 1 * helfSize, y + - 1 * helfSize,
            x + 1 * helfSize, y + - 1 * helfSize,
            x + 1 * helfSize, y + 1 * helfSize,
        ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        const normal = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        const indices = [ 0, 1, 3, 1, 2, 3 ];

        const attribArrays = {};
        attribArrays[ IndicesKey ] = { data: indices };
        attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: vertices, numComponents: 2 };
        attribArrays[ ShaderParams.ATTRIB_UV_NAME ] = { data: uv };
        attribArrays[ ShaderParams.ATTRIB_NORMAL_NAME ] = { data: normal };

        return attribArrays;

    },

} );

export { Quad };
