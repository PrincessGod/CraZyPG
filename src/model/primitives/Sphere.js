import { Primitive } from '../Primitive';
import { ShaderParams, IndicesKey } from '../../core/constant';

// { ...Primitive.opts, radius, subdivAixs, subdivHeight, startLon, endLon, startLat, endLat }
function Sphere( opts ) {

    const {
        radius, subdivAixs, subdivHeight, startLon, endLon, startLat, endLat,
    } = opts;
    Primitive.call( this, this.createAttribArrays( radius, subdivAixs, subdivHeight, startLon, endLon, startLat, endLat ), Object.assign( { name: 'Sphere' }, opts ) );

}

Sphere.prototype = Object.assign( Object.create( Primitive.prototype ), {


    constructor: Sphere,

    createAttribArrays( radius = 0.5, subdivAixs = 16, subdivHeight = 8, startLon = 0, endLon = Math.PI * 2, startLat = 0, endLat = Math.PI ) {

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

        const attribArrays = {};
        attribArrays[ IndicesKey ] = { data: indices };
        attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: positions };
        attribArrays[ ShaderParams.ATTRIB_UV_NAME ] = { data: uvs };
        attribArrays[ ShaderParams.ATTRIB_NORMAL_NAME ] = { data: normals };

        return attribArrays;

    },

} );

export { Sphere };
