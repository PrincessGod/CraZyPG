import { ShaderParams, BeginMode } from '../core/constant';
import { Model } from '../model/Model';
import { getTypedArray } from '../core/typedArray';
import { getNumComponents } from '../renderer/attributes';
import { BezierCurve } from '../math/BezierCurve';

function Mesh( name, attribArrays = {}, options ) {

    Object.keys( attribArrays ).forEach( ( prop ) => {

        if ( prop !== 'indices' ) {

            attribArrays[ prop ].data = getTypedArray( attribArrays[ prop ].data ); //eslint-disable-line
            attribArrays[ prop ].numComponents = getNumComponents( attribArrays[ prop ], prop );//eslint-disable-line

        }


    } );

    Object.assign( this, {
        name,
        attribArrays,
        _bufferInfo: null,
        drawMode: BeginMode.TRIANGLES,
        cullFace: true,
        blend: false,
        depth: true,
        sampleBlend: false,
        instanceCount: undefined,
        offset: 0,
    }, options );

}

Object.defineProperties( Mesh.prototype, {

    isMesh: {

        get() {

            return true;

        },

    },

    bufferInfo: {

        get() {

            return this._bufferInfo;

        },

        set( v ) {

            this._bufferInfo = v;
            this._updateVao = true;

        },

    },

} );

Object.assign( Mesh.prototype, {

    updateBufferInfo( obj ) {

        if ( this._bufferInfo ) {

            let updated = false;
            Object.keys( this._bufferInfo ).forEach( ( key ) => {

                if ( obj[ key ] ) {

                    this._bufferInfo[ key ] = obj[ key ];
                    updated = true;

                }

                if ( key === 'attribs' )
                    Object.keys( this._bufferInfo.attribs ).forEach( ( attrib ) => {

                        if ( obj[ attrib ] ) {

                            this._bufferInfo.attribs[ attrib ] = obj[ attrib ];
                            updated = true;

                        }

                    } );


            } );

            if ( updated ) this._updateVao = true;

        }

    },

} );

function deIndexAttribs( modelMesh ) {

    const mesh = modelMesh.mesh || modelMesh;
    const attribArrays = mesh.attribArrays;
    const indices = attribArrays.indices.data;
    const drawMode = mesh.drawMode;
    if ( ! indices ) return;

    if ( drawMode === BeginMode.TRIANGLES ) {

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

    if ( mesh.drawMode === BeginMode.TRIANGLES ) {

        if ( mesh.attribArrays.indices )
            deIndexAttribs( modelMesh );

        const numVert = mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].data.length / mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].numComponents;
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

        mesh.attribArrays[ ShaderParams.ATTRIB_BARYCENTRIC_NAME ] = { data: barycentrics, numComponents: 3 };

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
        attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: vertices };

        return new Mesh( name, attribArrays, { drawMode: BeginMode.LINE_STRIP } );

    },

};

export { Mesh, deIndexAttribs, addBarycentricAttrib, Curve };
