import { ColorLineShader } from '../shader/ColorLineShader';
import { Mesh } from '../model/Primatives';
import { Model } from '../model/Model';
import { ShaderParams } from '../core/constant';
import { setTypedArrayToBuffer } from '../renderer/attributes';
import { getTypedArray } from '../core/typedArray';

function LineHelper( gl, points, colors, normalLength = 0.1 ) {

    this.shader = new ColorLineShader( gl, colors );
    this.normalLength = normalLength;

    const vertices = points && this._getdata( points );
    const attribArrays = {};
    attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ] = { data: vertices, drawType: gl.DYNAMIC_DRAW };
    this.mesh = new Mesh( 'LineHelper', attribArrays, { drawMode: gl.LINES } );
    this.model = new Model( this.mesh );
    if ( points.isModel )
        this.setTransform( points.transform );
    this.gl = gl;
    this.copyToWorldMatrix = true;

}

Object.assign( LineHelper.prototype, {

    _getdata( points ) {

        let normalPos = points;
        if ( points.isModel ) {

            normalPos = [ points.positionInfo.data, points.normalInfo.data ];
            this.setTransform( points.transform );
            this.copyToWorldMatrix = false;

        }
        if ( points.isMesh ) {

            normalPos = [ points.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].data, points.attribArrays[ ShaderParams.ATTRIB_NORMAL_NAME ].data ];
            this.copyToWorldMatrix = false;

        }

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

        this.model.transform.updateMatrix();
        if ( this.copyToWorldMatrix )
            this.model.transform.copyToWorldMatrix();

        this.shader.renderModel( this.model );
        return this;

    },

    setCamera( camera ) {

        this.shader.setCamera( camera );
        return this;

    },

    setTransform( transform ) {

        if ( this.model )
            this.model.setTransform( transform );

        return this;

    },

    // model, mesh, arrays
    setData( points ) {

        this.copyToWorldMatrix = true;

        const array = this._getdata( points );
        const typedArray = getTypedArray( array );

        const bufferInfo = this.mesh.bufferInfo;

        this.mesh.attribArrays[ ShaderParams.ATTRIB_POSITION_NAME ].data = typedArray;

        if ( bufferInfo ) {

            const buffer = bufferInfo.attribs[ ShaderParams.ATTRIB_POSITION_NAME ].buffer;
            setTypedArrayToBuffer( this.gl, buffer, typedArray );

            bufferInfo.numElements = array.length / 3;

        }

        return this;

    },

} );

export { LineHelper };
