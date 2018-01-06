import { ColorLineShader } from '../shader/ColorLineShader';
import { Primatives } from '../model/Primatives';
import { Model } from '../model/Model';
import * as Constant from '../renderer/constant';

function LineHelper( gl, camera, points, colors, normalLength = 0.1 ) {

    this.shader = new ColorLineShader( gl, camera, colors );
    this.normalLength = normalLength;

    const vertices = this._getdata( points );
    const attribArrays = {};
    attribArrays[ Constant.ATTRIB_POSITION_NAME ] = { data: vertices, drawType: gl.DYNAMIC_DRAW };
    this.mesh = Primatives.createMesh( 'LineHelper', attribArrays, { drawMode: gl.LINES } );
    this.model = new Model( this.mesh );
    if ( points.isModel )
        this.setTransform( points.transform );
    this.gl = gl;

}

Object.assign( LineHelper.prototype, {

    _getdata( points ) {

        let normalPos = points;
        if ( points.isModel ) {

            normalPos = [ points.positionInfo.data, points.normalInfo.data ];
            this.setTransform( points.transform );

        }
        if ( points.isMesh )
            normalPos = [ points.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data, points.attribArrays[ Constant.ATTRIB_NORMAL_NAME ].data ];

        if ( normalPos.length && normalPos.length === 2 ) {

            const vertices = [];
            const start = normalPos[ 0 ];
            const normal = normalPos[ 1 ].map( n => n * this.normalLength );
            const length = start.length;
            let strip = 3;
            if ( start.length === normal.length ) {

                if ( length % 3 === 0 )
                    strip = 3;
                else if ( length % 4 === 0 )
                    strip = 4;
                else {

                    console.error( 'can not guess the vertex data for LineHelper !' );
                    return null;

                }

                for ( let i = 0; i < length / strip; i ++ ) {

                    vertices.push( start[ i * strip ], start[ i * strip + 1 ], start[ i * strip + 2 ] );
                    vertices.push( start[ i * strip ] + normal[ i * strip ], start[ i * strip + 1 ] + normal[ i * strip + 1 ], start[ i * strip + 2 ] + normal[ i * strip + 2 ] );

                }

                return vertices;

            } else if ( Math.max( start.length, normal.length ) % 4 === 0 && Math.min( start.length, normal.length ) % 3 === 0 &&
                Math.max( start.length, normal.length ) / 4 === Math.min( start.length, normal.length ) / 3 ) {

                const count = Math.max( start.length, normal.length ) / 4;
                const sStrip = start.length > normal.length ? 4 : 3;
                const nStrip = sStrip === 4 ? 3 : 4;
                for ( let i = 0; i < count; i ++ ) {

                    vertices.push( start[ i * sStrip ], start[ i * sStrip + 1 ], start[ i * sStrip + 2 ] );
                    vertices.push( start[ i * sStrip ] + normal[ i * nStrip ], start[ i * sStrip + 1 ] + normal[ i * nStrip + 1 ], start[ i * sStrip + 2 ] + normal[ i * nStrip + 2 ] );

                }

                return vertices;

            }

        }

        return points;

    },

    render() {

        this.shader.renderModel( this.model.preRender() );
        return this;

    },

    setTransform( transform ) {

        if ( this.model )
            this.model.transform = transform;

        return this;

    },

    setData( points ) {

        const array = this._getdata( points );
        const typedArray = new Float32Array( array );

        const bufferInfo = this.mesh.bufferInfo;
        if ( bufferInfo ) {

            const buffer = bufferInfo.attribs[ Constant.ATTRIB_POSITION_NAME ].buffer;
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, buffer );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, typedArray, this.gl.DYNAMIC_DRAW );

            bufferInfo.numElements = array.length / 3;

            return this;

        }

        this.mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ].data = typedArray;
        return this;

    },

} );

export { LineHelper };
