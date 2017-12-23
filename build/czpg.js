(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.CZPG = {})));
}(this, (function (exports) { 'use strict';

const meshs = {};
const textures = {};

const VTX_ATTR_POSITION_NAME = 'a_position';
const VTX_ATTR_POSITION_LOC = 0;
const VTX_ATTR_NORMAL_NAME = 'a_normal';
const VTX_ATTR_NORMAL_LOC = 1;
const VTX_ATTR_UV_NAME = 'a_uv';
const VTX_ATTR_UV_LOC = 2;

/* eslint prefer-destructuring: 0 */
function getContextTemp( canvasId ) {

    const canvas = document.getElementById( canvasId );
    exports.gl = canvas.getContext( 'webgl2', { antialias: true } );
    if ( ! exports.gl ) {

        console.error( 'Please use a decent browser, this browser not support Webgl2Context.' );
        return null;

    }

    exports.gl.cullFace( exports.gl.BACK );
    exports.gl.frontFace( exports.gl.CCW );
    exports.gl.enable( exports.gl.CULL_FACE );
    exports.gl.enable( exports.gl.DEPTH_TEST );
    exports.gl.depthFunc( exports.gl.LEQUAL );
    exports.gl.blendFunc( exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA );

    return this;

}

function clear() {

    exports.gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    exports.gl.clear( exports.gl.COLOR_BUFFER_BIT | exports.gl.DEPTH_BUFFER_BIT );
    return this;

}

function setSize( width, height, mutiplier ) {

    let muti = mutiplier || 1.0;
    muti = Math.max( 0, muti );
    exports.gl.canvas.style.width = width;
    exports.gl.canvas.style.height = height;
    exports.gl.canvas.width = exports.gl.canvas.clientWidth * muti;
    exports.gl.canvas.height = exports.gl.canvas.clientHeight * muti;
    exports.gl.viewport( 0, 0, exports.gl.canvas.width, exports.gl.canvas.height );
    return this;

}

function fitSize() {

    if ( exports.gl.canvas.width !== exports.gl.canvas.clientWidth ||
        exports.gl.canvas.height !== exports.gl.canvas.clientHeight ) {

        exports.gl.canvas.width = exports.gl.canvas.clientWidth;
        exports.gl.canvas.height = exports.gl.canvas.clientHeight;
        exports.gl.viewport( 0, 0, exports.gl.canvas.width, exports.gl.canvas.height );

    }
    return this;

}

function createArrayBuffer( array, isStatic = true ) {

    const buffer = exports.gl.createBuffer();
    exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, buffer );
    exports.gl.bufferData( exports.gl.ARRAY_BUFFER, array, isStatic ? exports.gl.STATIC_DRAW : exports.gl.DYNAMIC_DRAW );
    exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, null );
    return buffer;

}

function createMeshVAO( name, indexArray, vtxArray, normalArray, uvArray, vtxLength ) {

    const mesh = { drawMode: exports.gl.TRIANGLES };

    mesh.vao = exports.gl.createVertexArray();
    exports.gl.bindVertexArray( mesh.vao );

    if ( indexArray !== undefined && indexArray !== null ) {

        mesh.indexBuffer = exports.gl.createBuffer();
        mesh.indexCount = indexArray.length;
        exports.gl.bindBuffer( exports.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer );
        exports.gl.bufferData( exports.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indexArray ), exports.gl.STATIC_DRAW );
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }

    if ( vtxArray !== undefined && vtxArray !== null ) {

        mesh.vtxBuffer = exports.gl.createBuffer();
        mesh.vtxComponents = vtxLength || 3;
        mesh.vtxCount = vtxArray.length / mesh.vtxComponents;

        exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, mesh.vtxBuffer );
        exports.gl.bufferData( exports.gl.ARRAY_BUFFER, new Float32Array( vtxArray ), exports.gl.STATIC_DRAW );
        exports.gl.enableVertexAttribArray( VTX_ATTR_POSITION_LOC );
        exports.gl.vertexAttribPointer(VTX_ATTR_POSITION_LOC, mesh.vtxComponents, exports.gl.FLOAT, false, 0, 0); // eslint-disable-line

    }

    if ( normalArray !== undefined && normalArray !== null ) {

        mesh.normalBuffer = exports.gl.createBuffer();

        exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, mesh.normalBuffer );
        exports.gl.bufferData( exports.gl.ARRAY_BUFFER, new Float32Array( normalArray ), exports.gl.STATIC_DRAW );
        exports.gl.enableVertexAttribArray( VTX_ATTR_NORMAL_LOC );
        exports.gl.vertexAttribPointer( VTX_ATTR_NORMAL_LOC, 3, exports.gl.FLOAT, false, 0, 0 );

    }

    if ( uvArray !== undefined && uvArray !== null ) {

        mesh.uvBuffer = exports.gl.createBuffer();

        exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, mesh.uvBuffer );
        exports.gl.bufferData( exports.gl.ARRAY_BUFFER, new Float32Array( uvArray ), exports.gl.STATIC_DRAW );
        exports.gl.enableVertexAttribArray( VTX_ATTR_UV_LOC );
        exports.gl.vertexAttribPointer( VTX_ATTR_UV_LOC, 2, exports.gl.FLOAT, false, 0, 0 );

    }

    exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, null );
    exports.gl.bindVertexArray( null );

    meshs[ name ] = mesh;
    return mesh;

}

function loadTexture( name, img, flipY = false ) {

    const tex = exports.gl.createTexture();
    if ( flipY ) exports.gl.pixelStorei( exports.gl.UNPACK_FLIP_Y_WEBGL, true );

    exports.gl.bindTexture( exports.gl.TEXTURE_2D, tex );
    exports.gl.texImage2D( exports.gl.TEXTURE_2D, 0, exports.gl.RGBA, exports.gl.RGBA, exports.gl.UNSIGNED_BYTE, img );
    exports.gl.texParameteri( exports.gl.TEXTURE_2D, exports.gl.TEXTURE_MAG_FILTER, exports.gl.LINEAR );
    exports.gl.texParameteri( exports.gl.TEXTURE_2D, exports.gl.TEXTURE_MIN_FILTER, exports.gl.LINEAR_MIPMAP_LINEAR );
    exports.gl.generateMipmap( exports.gl.TEXTURE_2D );
    exports.gl.bindTexture( exports.gl.TEXTURE_2D, null );

    textures[ name ] = tex;
    if ( flipY ) exports.gl.pixelStorei( exports.gl.UNPACK_FLIP_Y_WEBGL, false );

    return tex;

}

function loadCubeMap( name, imgAry ) {

    if ( imgAry.length !== 6 ) return null;

    const tex = exports.gl.createTexture();
    exports.gl.bindTexture( exports.gl.TEXTURE_CUBE_MAP, tex );

    for ( let i = 0; i < 6; i ++ )
        exports.gl.texImage2D( exports.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, exports.gl.RGBA, exports.gl.RGBA, exports.gl.UNSIGNED_BYTE, imgAry[ i ] ); // eslint-disable-line

    exports.gl.texParameteri( exports.gl.TEXTURE_CUBE_MAP, exports.gl.TEXTURE_MAG_FILTER, exports.gl.LINEAR );
    exports.gl.texParameteri( exports.gl.TEXTURE_CUBE_MAP, exports.gl.TEXTURE_MIN_FILTER, exports.gl.LINEAR );
    exports.gl.texParameteri( exports.gl.TEXTURE_CUBE_MAP, exports.gl.TEXTURE_WRAP_S, exports.gl.CLAMP_TO_EDGE );
    exports.gl.texParameteri( exports.gl.TEXTURE_CUBE_MAP, exports.gl.TEXTURE_WRAP_T, exports.gl.CLAMP_TO_EDGE );
    exports.gl.texParameteri( exports.gl.TEXTURE_CUBE_MAP, exports.gl.TEXTURE_WRAP_R, exports.gl.CLAMP_TO_EDGE );

    exports.gl.bindTexture( exports.gl.TEXTURE_CUBE_MAP, null );
    textures[ name ] = tex;
    return tex;

}

class Vector3 {

    constructor( x, y, z ) {

        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;

    }

    magnitude( v ) {

        // Only get the magnitude of this vector
        if ( v === undefined )
            return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ) );

        // Get magnitude based on another vector
        const x = v.x - this.x;
        const y = v.y - this.y;
        const z = v.y - this.z;

        return Math.sqrt( ( x * x ) + ( y * y ) + ( z * z ) );

    }

    normalize() {

        const mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;

    }

    set( x, y, z ) {

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    }

    multiScalar( v ) {

        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;

    }

    getArray() {

        return [ this.x, this.y, this.z ];

    }

    getFloatArray() {

        return new Float32Array( [ this.x, this.y, this.z ] );

    }

    clone() {

        return new Vector3( this.x, this.y, this.z );

    }

}

/* eslint no-param-reassign: 0 no-mixed-operators:0 */
class Matrix4 {

    constructor() {

        this.raw = Matrix4.identity();

    }

    translate( x, y, z ) {

        if ( x.x !== undefined ) {

            Matrix4.translate( this.raw, x.x, x.y, x.z );
            return this;

        }
        Matrix4.translate( this.raw, x, y, z );
        return this;

    }

    rotateX( rad ) {

        Matrix4.rotateX( this.raw, rad );
        return this;

    }

    rotateY( rad ) {

        Matrix4.rotateY( this.raw, rad );
        return this;

    }

    rotateZ( rad ) {

        Matrix4.rotateZ( this.raw, rad );
        return this;

    }

    scale( x, y, z ) {

        if ( x.x !== undefined ) {

            Matrix4.scale( this.raw, x.x, x.y, x.z );
            return this;

        }

        Matrix4.scale( this.raw, x, y, z );
        return this;

    }

    invert() {

        Matrix4.invert( this.raw );
        return this;

    }

    resetRotation() {

        for ( let i = 0; i < this.raw.length; i ++ ) {

            if ( i >= 12 && i <= 14 ) continue; // eslint-disable-line
            this.raw[ i ] = ( i % 5 === 0 ) ? 1 : 0;

        }

        return this;

    }

    reset() {

        for ( let i = 0; i < this.raw.length; i ++ )
            this.raw[ i ] = ( i % 5 === 0 ) ? 1 : 0;
        return this;

    }

    static identity() {

        const a = new Float32Array( 16 );
        a[ 0 ] = 1;
        a[ 5 ] = 1;
        a[ 10 ] = 1;
        a[ 15 ] = 1;
        return a;

    }

    static perspective( out, fov, aspect, near, far ) {

        const f = 1.0 / Math.tan( fov / 2 );
        const nf = 1 / ( near - far );
        out[ 0 ] = f / aspect;
        out[ 1 ] = 0;
        out[ 2 ] = 0;
        out[ 3 ] = 0;
        out[ 4 ] = 0;
        out[ 5 ] = f;
        out[ 6 ] = 0;
        out[ 7 ] = 0;
        out[ 8 ] = 0;
        out[ 9 ] = 0;
        out[ 10 ] = ( far + near ) * nf;
        out[ 11 ] = - 1;
        out[ 12 ] = 0;
        out[ 13 ] = 0;
        out[ 14 ] = 2 * far * near * nf;
        out[ 15 ] = 0;

        return out;

    }

    static ortho( out, left, right, bottom, top, near, far ) {

        const lr = 1 / ( left - right );
        const bt = 1 / ( bottom - top );
        const nf = 1 / ( near - far );
        out[ 0 ] = - 2 * lr;
        out[ 1 ] = 0;
        out[ 3 ] = 0;
        out[ 4 ] = 0;
        out[ 5 ] = - 2 * bt;
        out[ 6 ] = 0;
        out[ 7 ] = 0;
        out[ 8 ] = 0;
        out[ 9 ] = 0;
        out[ 10 ] = 2 * nf;
        out[ 11 ] = 0;
        out[ 12 ] = ( left + right ) * lr;
        out[ 13 ] = ( top + bottom ) * bt;
        out[ 14 ] = ( far + near ) * nf;
        out[ 15 ] = 1;

        return out;

    }

    static transpose( out, a ) {

        if ( out === a ) {

            const a01 = a[ 1 ];
            const a02 = a[ 2 ];
            const a03 = a[ 3 ];
            const a12 = a[ 6 ];
            const a13 = a[ 7 ];
            const a23 = a[ 11 ];
            out[ 1 ] = a[ 4 ];
            out[ 2 ] = a[ 8 ];
            out[ 3 ] = a[ 12 ];
            out[ 4 ] = a01;
            out[ 6 ] = a[ 9 ];
            out[ 7 ] = a[ 13 ];
            out[ 8 ] = a02;
            out[ 9 ] = a12;
            out[ 11 ] = a[ 14 ];
            out[ 12 ] = a03;
            out[ 13 ] = a13;
            out[ 14 ] = a23;

        } else {

            out[ 0 ] = a[ 0 ];
            out[ 1 ] = a[ 4 ];
            out[ 2 ] = a[ 8 ];
            out[ 3 ] = a[ 12 ];
            out[ 4 ] = a[ 1 ];
            out[ 5 ] = a[ 5 ];
            out[ 6 ] = a[ 9 ];
            out[ 7 ] = a[ 13 ];
            out[ 8 ] = a[ 2 ];
            out[ 9 ] = a[ 6 ];
            out[ 10 ] = a[ 10 ];
            out[ 11 ] = a[ 14 ];
            out[ 12 ] = a[ 3 ];
            out[ 13 ] = a[ 7 ];
            out[ 14 ] = a[ 11 ];
            out[ 15 ] = a[ 15 ];

        }

        return out;

    }

    static normalMat3( out, a ) {

        const a00 = a[ 0 ];
        const a01 = a[ 1 ];
        const a02 = a[ 2 ];
        const a03 = a[ 3 ];
        const a10 = a[ 4 ];
        const a11 = a[ 5 ];
        const a12 = a[ 6 ];
        const a13 = a[ 7 ];
        const a20 = a[ 8 ];
        const a21 = a[ 9 ];
        const a22 = a[ 10 ];
        const a23 = a[ 11 ];
        const a30 = a[ 12 ];
        const a31 = a[ 13 ];
        const a32 = a[ 14 ];
        const a33 = a[ 15 ];

        const b00 = ( a00 * a11 ) - ( a01 * a10 );
        const b01 = ( a00 * a12 ) - ( a02 * a10 );
        const b02 = ( a00 * a13 ) - ( a03 * a10 );
        const b03 = ( a01 * a12 ) - ( a02 * a11 );
        const b04 = ( a01 * a13 ) - ( a03 * a11 );
        const b05 = ( a02 * a13 ) - ( a03 * a12 );
        const b06 = ( a20 * a31 ) - ( a21 * a30 );
        const b07 = ( a20 * a32 ) - ( a22 * a30 );
        const b08 = ( a20 * a33 ) - ( a23 * a30 );
        const b09 = ( a21 * a32 ) - ( a22 * a31 );
        const b10 = ( a21 * a33 ) - ( a23 * a31 );
        const b11 = ( a22 * a33 ) - ( a23 * a32 );

        let det = ( ( b00 * b11 ) - ( b01 * b10 ) ) + ( b02 * b09 ) + ( ( b03 * b08 ) - ( b04 * b07 ) ) + ( b05 * b06 );

        if ( ! det ) return null;

        det = 1.0 / det;

        out[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * det;
        out[ 1 ] = ( a12 * b08 - a10 * b11 - a13 * b07 ) * det;
        out[ 2 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * det;

        out[ 3 ] = ( a02 * b10 - a01 * b11 - a03 * b09 ) * det;
        out[ 4 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * det;
        out[ 5 ] = ( a01 * b08 - a00 * b10 - a03 * b06 ) * det;

        out[ 6 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * det;
        out[ 7 ] = ( a32 * b02 - a30 * b05 - a33 * b01 ) * det;
        out[ 8 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * det;
        return out;

    }

    static multiplyVector( mat4, v ) {

        const x = v[ 0 ];
        const y = v[ 1 ];
        const z = v[ 2 ];
        const w = v[ 3 ];

        const c1r1 = mat4[ 0 ];
        const c2r1 = mat4[ 1 ];
        const c3r1 = mat4[ 2 ];
        const c4r1 = mat4[ 3 ];
        const c1r2 = mat4[ 4 ];
        const c2r2 = mat4[ 5 ];
        const c3r2 = mat4[ 6 ];
        const c4r2 = mat4[ 7 ];
        const c1r3 = mat4[ 8 ];
        const c2r3 = mat4[ 9 ];
        const c3r3 = mat4[ 10 ];
        const c4r3 = mat4[ 11 ];
        const c1r4 = mat4[ 12 ];
        const c2r4 = mat4[ 13 ];
        const c3r4 = mat4[ 14 ];
        const c4r4 = mat4[ 15 ];

        return [
            x * c1r1 + y * c1r2 + z * c1r3 + w * c1r4,
            x * c2r1 + y * c2r2 + z * c2r3 + w * c2r4,
            x * c3r1 + y * c3r2 + z * c3r3 + w * c3r4,
            x * c4r1 + y * c4r2 + z * c4r3 + w * c4r4,
        ];

    }

    static transformVec4( out, m, v ) {

        out[ 0 ] = m[ 0 ] * v[ 0 ] + m[ 4 ] * v[ 1 ] + m[ 8 ] * v[ 2 ] + m[ 12 ] * v[ 3 ];
        out[ 1 ] = m[ 1 ] * v[ 0 ] + m[ 5 ] * v[ 1 ] + m[ 9 ] * v[ 2 ] + m[ 13 ] * v[ 3 ];
        out[ 2 ] = m[ 2 ] * v[ 0 ] + m[ 6 ] * v[ 1 ] + m[ 10 ] * v[ 2 ] + m[ 14 ] * v[ 3 ];
        out[ 3 ] = m[ 3 ] * v[ 0 ] + m[ 7 ] * v[ 1 ] + m[ 11 ] * v[ 2 ] + m[ 15 ] * v[ 3 ];
        return out;

    }

    static mult( out, a, b ) {

        const a00 = a[ 0 ];
        const a01 = a[ 1 ];
        const a02 = a[ 2 ];
        const a03 = a[ 3 ];
        const a10 = a[ 4 ];
        const a11 = a[ 5 ];
        const a12 = a[ 6 ];
        const a13 = a[ 7 ];
        const a20 = a[ 8 ];
        const a21 = a[ 9 ];
        const a22 = a[ 10 ];
        const a23 = a[ 11 ];
        const a30 = a[ 12 ];
        const a31 = a[ 13 ];
        const a32 = a[ 14 ];
        const a33 = a[ 15 ];

        let b0 = b[ 0 ];
        let b1 = b[ 1 ];
        let b2 = b[ 2 ];
        let b3 = b[ 3 ];

        out[ 0 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 1 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 2 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 3 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[ 4 ]; b1 = b[ 5 ]; b2 = b[ 6 ]; b3 = b[ 7 ];
        out[ 4 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 5 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 6 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 7 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[ 8 ]; b1 = b[ 9 ]; b2 = b[ 10 ]; b3 = b[ 11 ];
        out[ 8 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 9 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 10 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 11 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[ 12 ]; b1 = b[ 13 ]; b2 = b[ 14 ]; b3 = b[ 15 ];
        out[ 12 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[ 13 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[ 14 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[ 15 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return out;

    }

    static scale( out, x, y, z ) {

        out[ 0 ] *= x;
        out[ 1 ] *= x;
        out[ 2 ] *= x;
        out[ 3 ] *= x;
        out[ 4 ] *= y;
        out[ 5 ] *= y;
        out[ 6 ] *= y;
        out[ 7 ] *= y;
        out[ 8 ] *= z;
        out[ 9 ] *= z;
        out[ 10 ] *= z;
        out[ 11 ] *= z;

        return out;

    }

    static rotateY( out, rad ) {

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const a00 = out[ 0 ];
        const a01 = out[ 1 ];
        const a02 = out[ 2 ];
        const a03 = out[ 3 ];
        const a20 = out[ 8 ];
        const a21 = out[ 9 ];
        const a22 = out[ 10 ];
        const a23 = out[ 11 ];

        out[ 0 ] = a00 * c - a20 * s;
        out[ 1 ] = a01 * c - a21 * s;
        out[ 2 ] = a02 * c - a22 * s;
        out[ 3 ] = a03 * c - a23 * s;
        out[ 8 ] = a00 * s + a20 * c;
        out[ 9 ] = a01 * s + a21 * c;
        out[ 10 ] = a02 * s + a22 * c;
        out[ 11 ] = a03 * s + a23 * c;

        return out;

    }

    static rotateX( out, rad ) {

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const a10 = out[ 4 ];
        const a11 = out[ 5 ];
        const a12 = out[ 6 ];
        const a13 = out[ 7 ];
        const a20 = out[ 8 ];
        const a21 = out[ 9 ];
        const a22 = out[ 10 ];
        const a23 = out[ 11 ];

        out[ 4 ] = a10 * c + a20 * s;
        out[ 5 ] = a11 * c + a21 * s;
        out[ 6 ] = a12 * c + a22 * s;
        out[ 7 ] = a13 * c + a23 * s;
        out[ 8 ] = a20 * c - a10 * s;
        out[ 9 ] = a21 * c - a11 * s;
        out[ 10 ] = a22 * c - a12 * s;
        out[ 11 ] = a23 * c - a13 * s;

        return out;

    }

    static rotateZ( out, rad ) {

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const a00 = out[ 0 ];
        const a01 = out[ 1 ];
        const a02 = out[ 2 ];
        const a03 = out[ 3 ];
        const a10 = out[ 4 ];
        const a11 = out[ 5 ];
        const a12 = out[ 6 ];
        const a13 = out[ 7 ];

        out[ 0 ] = a00 * c + a10 * s;
        out[ 1 ] = a01 * c + a11 * s;
        out[ 2 ] = a02 * c + a12 * s;
        out[ 3 ] = a03 * c + a13 * s;
        out[ 4 ] = a10 * c - a00 * s;
        out[ 5 ] = a11 * c - a01 * s;
        out[ 6 ] = a12 * c - a02 * s;
        out[ 7 ] = a13 * c - a03 * s;

        return out;

    }

    static rotate( out, rad, axis ) {

        let x = axis[ 0 ];
        let y = axis[ 1 ];
        let z = axis[ 2 ];
        let len = Math.sqrt( x * x + y * y + z * z );

        if ( Math.abs( len ) < 0.000001 ) return null;

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        const s = Math.sin( rad );
        const c = Math.cos( rad );
        const t = 1 - c;

        const a00 = out[ 0 ]; const a01 = out[ 1 ]; const a02 = out[ 2 ]; const a03 = out[ 3 ];
        const a10 = out[ 4 ]; const a11 = out[ 5 ]; const a12 = out[ 6 ]; const a13 = out[ 7 ];
        const a20 = out[ 8 ]; const a21 = out[ 9 ]; const a22 = out[ 10 ]; const a23 = out[ 11 ];

        const b00 = x * x * t + c; const b01 = y * x * t + z * s; const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s; const b11 = y * y * t + c; const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s; const b21 = y * z * t - x * s; const b22 = z * z * t + c;

        out[ 0 ] = a00 * b00 + a10 * b01 + a20 * b02;
        out[ 1 ] = a01 * b00 + a11 * b01 + a21 * b02;
        out[ 2 ] = a02 * b00 + a12 * b01 + a22 * b02;
        out[ 3 ] = a03 * b00 + a13 * b01 + a23 * b02;
        out[ 4 ] = a00 * b10 + a10 * b11 + a20 * b12;
        out[ 5 ] = a01 * b10 + a11 * b11 + a21 * b12;
        out[ 6 ] = a02 * b10 + a12 * b11 + a22 * b12;
        out[ 7 ] = a03 * b10 + a13 * b11 + a23 * b12;
        out[ 8 ] = a00 * b20 + a10 * b21 + a20 * b22;
        out[ 9 ] = a01 * b20 + a11 * b21 + a21 * b22;
        out[ 10 ] = a02 * b20 + a12 * b21 + a22 * b22;
        out[ 11 ] = a03 * b20 + a13 * b21 + a23 * b22;

        return out;

    }

    static invert( out, mat ) {

        if ( mat === undefined ) mat = out; // If input isn't sent, then output is also input

        const a00 = mat[ 0 ];
        const a01 = mat[ 1 ];
        const a02 = mat[ 2 ];
        const a03 = mat[ 3 ];
        const a10 = mat[ 4 ];
        const a11 = mat[ 5 ];
        const a12 = mat[ 6 ];
        const a13 = mat[ 7 ];
        const a20 = mat[ 8 ];
        const a21 = mat[ 9 ];
        const a22 = mat[ 10 ];
        const a23 = mat[ 11 ];
        const a30 = mat[ 12 ];
        const a31 = mat[ 13 ];
        const a32 = mat[ 14 ];
        const a33 = mat[ 15 ];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if ( ! det ) return false;

        det = 1.0 / det;

        out[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * det;
        out[ 1 ] = ( a02 * b10 - a01 * b11 - a03 * b09 ) * det;
        out[ 2 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * det;
        out[ 3 ] = ( a22 * b04 - a21 * b05 - a23 * b03 ) * det;
        out[ 4 ] = ( a12 * b08 - a10 * b11 - a13 * b07 ) * det;
        out[ 5 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * det;
        out[ 6 ] = ( a32 * b02 - a30 * b05 - a33 * b01 ) * det;
        out[ 7 ] = ( a20 * b05 - a22 * b02 + a23 * b01 ) * det;
        out[ 8 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * det;
        out[ 9 ] = ( a01 * b08 - a00 * b10 - a03 * b06 ) * det;
        out[ 10 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * det;
        out[ 11 ] = ( a21 * b02 - a20 * b04 - a23 * b00 ) * det;
        out[ 12 ] = ( a11 * b07 - a10 * b09 - a12 * b06 ) * det;
        out[ 13 ] = ( a00 * b09 - a01 * b07 + a02 * b06 ) * det;
        out[ 14 ] = ( a31 * b01 - a30 * b03 - a32 * b00 ) * det;
        out[ 15 ] = ( a20 * b03 - a21 * b01 + a22 * b00 ) * det;

        return true;

    }

    static translate( out, x, y, z ) {

        out[ 12 ] = out[ 0 ] * x + out[ 4 ] * y + out[ 8 ] * z + out[ 12 ];
        out[ 13 ] = out[ 1 ] * x + out[ 5 ] * y + out[ 9 ] * z + out[ 13 ];
        out[ 14 ] = out[ 2 ] * x + out[ 6 ] * y + out[ 10 ] * z + out[ 14 ];
        out[ 15 ] = out[ 3 ] * x + out[ 7 ] * y + out[ 11 ] * z + out[ 15 ];

        return out;

    }

}

// import { Vector3, Matrix4 } from './Math';
class Transform {

    constructor() {

        this.position = new Vector3( 0, 0, 0 );
        this.scale = new Vector3( 1, 1, 1 );
        this.rotation = new Vector3( 0, 0, 0 );
        this.matLocal = new Matrix4();
        this.matNormal = new Matrix4();

        this.forward = new Float32Array( 4 );
        this.up = new Float32Array( 4 );
        this.right = new Float32Array( 4 );

    }

    updateMatrix() {

        this.matLocal.reset()
            .translate( this.position )
            .rotateZ( this.rotation.z * Transform.deg2Rad )
            .rotateX( this.rotation.x * Transform.deg2Rad )
            .rotateY( this.rotation.y * Transform.deg2Rad )
            .scale( this.scale );

        Matrix4.normalMat3( this.matNormal, this.matLocal.raw );

        Matrix4.transformVec4( this.forward, this.matLocal.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.matLocal.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.matLocal.raw, [ 1, 0, 0, 0 ] );

        return this.matLocal.raw;

    }

    updateDirection() {

        Matrix4.transformVec4( this.forward, this.matLocal.raw, [ 0, 0, 1, 0 ] );
        Matrix4.transformVec4( this.up, this.matLocal.raw, [ 0, 1, 0, 0 ] );
        Matrix4.transformVec4( this.right, this.matLocal.raw, [ 1, 0, 0, 0 ] );
        return this;

    }

    getMatrix() {

        return this.matLocal.raw;

    }

    getNormalMatrix() {

        return this.matNormal;

    }

    reset() {

        this.position.set( 0, 0, 0 );
        this.scale.set( 1, 1, 1 );
        this.rotation.set( 0, 0, 0 );

    }

}

Transform.deg2Rad = Math.PI / 180;

class Modal {

    constructor( mesh ) {

        this.mesh = mesh;
        this.transform = new Transform();

    }

    setScale( x, y, z ) {

        this.transform.scale.set( x, y, z );
        return this;

    }

    setPosition( x, y, z ) {

        this.transform.position.set( x, y, z );
        return this;

    }

    setRotation( x, y, z ) {

        this.transform.rotation.set( x, y, z );
        return this;

    }

    addScale( x, y, z ) {

        this.transform.scale.x += x;
        this.transform.scale.y += y;
        this.transform.scale.z += z;
        return this;

    }

    addPosition( x, y, z ) {

        this.transform.position.x += x;
        this.transform.position.y += y;
        this.transform.position.z += z;
        return this;

    }

    addRotation( x, y, z ) {

        this.transform.rotation.x += x;
        this.transform.rotation.y += y;
        this.transform.rotation.z += z;
        return this;

    }

    preRender() {

        this.transform.updateMatrix();
        return this;

    }

}

const Primatives = {};
Primatives.GridAxis = class {

    static createMesh() {

        const vertices = [];
        const size = 2;
        const div = 10.0;
        const step = size / div;
        const half = size / 2;

        let p;
        for ( let i = 0; i <= div; i ++ ) {

            p = - half + ( i * step );
            vertices.push( p );
            vertices.push( 0 );
            vertices.push( half );
            vertices.push( 0 );

            vertices.push( p );
            vertices.push( 0 );
            vertices.push( - half );
            vertices.push( 0 );

            vertices.push( - half );
            vertices.push( 0 );
            vertices.push( p );
            vertices.push( 0 );

            vertices.push( half );
            vertices.push( 0 );
            vertices.push( p );
            vertices.push( 0 );

        }

        vertices.push( - half );
        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( 1 );

        vertices.push( half );
        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( 1 );

        vertices.push( 0 );
        vertices.push( - half );
        vertices.push( 0 );
        vertices.push( 2 );

        vertices.push( 0 );
        vertices.push( half );
        vertices.push( 0 );
        vertices.push( 2 );

        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( - half );
        vertices.push( 3 );

        vertices.push( 0 );
        vertices.push( 0 );
        vertices.push( half );
        vertices.push( 3 );

        const attrColorLoc = 4;
        const mesh = {
            drawMode: exports.gl.LINES,
            vao: exports.gl.createVertexArray(),
        };

        mesh.vtxComponents = 4;
        mesh.vtxCount = vertices.length / mesh.vtxComponents;
        const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vtxComponents;

        mesh.vtxBuffer = exports.gl.createBuffer();
        exports.gl.bindVertexArray( mesh.vao );
        exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, mesh.vtxBuffer );
        exports.gl.bufferData( exports.gl.ARRAY_BUFFER, new Float32Array( vertices ), exports.gl.STATIC_DRAW );
        exports.gl.enableVertexAttribArray( VTX_ATTR_POSITION_LOC );
        exports.gl.enableVertexAttribArray( attrColorLoc );

        exports.gl.vertexAttribPointer(
            VTX_ATTR_POSITION_LOC,
            3,
            exports.gl.FLOAT,
            false,
            strideLen,
            0,
        );

        exports.gl.vertexAttribPointer(
            attrColorLoc,
            1,
            exports.gl.FLOAT,
            false,
            strideLen,
            Float32Array.BYTES_PER_ELEMENT * 3,
        );

        exports.gl.bindBuffer( exports.gl.ARRAY_BUFFER, null );
        exports.gl.bindVertexArray( null );
        meshs.gridAxis = mesh;
        return mesh;

    }

};

Primatives.Quad = class {

    static createModal() {

        return new Modal( Primatives.Quad.createMesh() );

    }

    static createMesh() {

        const vtx = [ - 0.5, 0.5, 0, - 0.5, - 0.5, 0, 0.5, - 0.5, 0, 0.5, 0.5, 0 ];
        const uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        const indices = [ 0, 1, 2, 2, 3, 0 ];

        const mesh = createMeshVAO( 'Quad', indices, vtx, null, uv );
        mesh.offCullFace = true;
        mesh.onBlend = true;
        return mesh;

    }

};

Primatives.Cube = class {

    static createModal( name ) {

        return new Modal( Primatives.Cube.createMesh( name, 1, 1, 1, 0, 0, 0 ) );

    }

    static createMesh( name, width, height, depth, x, y, z ) {

        const w = width * 0.5;
        const h = height * 0.5;
        const d = depth * 0.5;

        const x0 = x - w;
        const x1 = x + w;
        const y0 = y - h;
        const y1 = y + h;
        const z0 = z - d;
        const z1 = z + d;

        const vtxArray = [
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

        const indexArray = [];
        for ( let i = 0; i < vtxArray.length / 4; i += 2 )
            indexArray.push( i, i + 1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

        const uvArray = [];
        for ( let i = 0; i < 6; i ++ )
            uvArray.push( 0, 0, 0, 1, 1, 1, 1, 0 );

        const normalArray = [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Front
            0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, // Back
            - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, // Left
            0, - 1, 0, 0, - 1, 0, 0, - 1, 0, 0, - 1, 0, // Bottom
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Right
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // Top
        ];

        const mesh = createMeshVAO( name || 'Cube', indexArray, vtxArray, normalArray, uvArray, 4 );
        mesh.offCullFace = true;
        return mesh;

    }

};

/* eslint no-multi-assign: 0 */
// import { Matrix4 } from './Math';
class OrbitCamera {

    constructor( gl, fov = 45, near = 0.1, far = 1000 ) {

        this.projMatrix = new Float32Array( 16 );
        Matrix4.perspective(
            this.projMatrix,
            fov,
            gl.canvas.width / gl.canvas.height,
            near,
            far,
        );

        this.gl = gl;
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.transform = new Transform();
        this.viewMatrix = new Float32Array( 16 );

        this.mode = OrbitCamera.MODE_ORBIT;

    }

    panX( v ) {

        if ( this.mode === OrbitCamera.MODE_ORBIT ) return;

        this.updateViewMatrix();
        this.transform.position.x += this.transform.right[ 0 ] * v;
        this.transform.position.y += this.transform.right[ 1 ] * v;
        this.transform.position.z += this.transform.right[ 2 ] * v;

    }

    panY( v ) {

        this.updateViewMatrix();
        this.transform.position.y += this.transform.up[ 1 ] * v;
        if ( this.mode === OrbitCamera.MODE_ORBIT )

            return;


        this.transform.position.x += this.transform.up[ 0 ] * v;
        this.transform.position.z += this.transform.up[ 2 ] * v;

    }

    panZ( v ) {

        this.updateViewMatrix();
        if ( this.mode === OrbitCamera.MODE_ORBIT )
            this.transform.position.z += v;
        else {

            this.transform.position.x += this.transform.forward[ 0 ] * v;
            this.transform.position.y += this.transform.forward[ 1 ] * v;
            this.transform.position.z += this.transform.forward[ 2 ] * v;

        }

    }

    updateViewMatrix() {

        if ( this.mode === OrbitCamera.MODE_FREE )
            this.transform.matLocal.reset()
                .translate( this.transform.position )
                .rotateY( this.transform.rotation.y * Transform.deg2Rad )
                .rotateX( this.transform.rotation.x * Transform.deg2Rad );
        else
            this.transform.matLocal.reset()
                .rotateY( this.transform.rotation.y * Transform.deg2Rad )
                .rotateX( this.transform.rotation.x * Transform.deg2Rad )
                .translate( this.transform.position );


        this.transform.updateDirection();
        Matrix4.invert( this.viewMatrix, this.transform.matLocal.raw );
        return this.viewMatrix;

    }

    updateProjMatrix() {

        Matrix4.perspective(
            this.projMatrix,
            this.fov,
            this.gl.canvas.width / this.gl.canvas.height,
            this.near,
            this.far,
        );

    }

    getOrientMatrix() {

        const mat = new Float32Array( this.viewMatrix );
        mat[ 12 ] = mat[ 13 ] = mat[ 14 ] = 0.0;
        return mat;

    }

}

OrbitCamera.MODE_FREE = 0;
OrbitCamera.MODE_ORBIT = 1;


class CameraController {

    constructor( gl, camera ) {

        const self = this;
        const box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;
        this.camera = camera;

        this.rotateRate = - 300;
        this.panRate = 5;
        this.zoomRate = 200;

        this.offsetX = box.left;
        this.offsetY = box.top;

        this.initX = 0;
        this.initY = 0;
        this.prevX = 0;
        this.prevY = 0;

        this.onUpHandler = function ( e ) {

            self.onMouseUp( e );

        };
        this.onMoveHandler = function ( e ) {

            self.onMouseMove( e );

        };

        this.canvas.addEventListener( 'mousedown', ( e ) => {

            self.onMouseDown( e );

        } );
        this.canvas.addEventListener( 'mousewheel', ( e ) => {

            self.onMouseWheel( e );

        } );

    }

    getMouseVec2( e ) {

        return {
            x: e.pageX - this.offsetX,
            y: e.pageY - this.offsetY,
        };

    }

    onMouseDown( e ) {

        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;

        this.canvas.addEventListener( 'mouseup', this.onUpHandler );
        this.canvas.addEventListener( 'mousemove', this.onMoveHandler );

    }

    onMouseUp() {

        this.canvas.removeEventListener( 'mouseup', this.onMouseUp );
        this.canvas.removeEventListener( 'mousemove', this.onMoveHandler );

    }

    onMouseWheel( e ) {

        const delta = Math.max( - 1, Math.min( 1, ( e.wheelDelta || - e.detail ) ) );
        this.camera.panZ( delta * ( this.zoomRate / this.canvas.height ) );

    }

    onMouseMove( e ) {

        const x = e.pageX - this.offsetX;
        const y = e.pageY - this.offsetY;
        const dx = x - this.prevX;
        const dy = y - this.prevY;

        if ( ! e.shiftKey ) {

            this.camera.transform.rotation.y += dx * ( this.rotateRate / this.canvas.width );
            this.camera.transform.rotation.x += dy * ( this.rotateRate / this.canvas.height );

        } else {

            this.camera.panX( - dx * ( this.panRate / this.canvas.width ) );
            this.camera.panY( dy * ( this.panRate / this.canvas.height ) );

        }

        this.prevX = x;
        this.prevY = y;

    }

}

class Render {

    constructor( callback, fps ) {

        const self = this;
        this.lastTime = null;
        this.callback = callback;
        this.isActive = false;
        this.fps = 0;

        if ( typeof ( fps ) === 'number' && fps > 0 ) {

            this.frameTimeLimit = 1 / fps;

            this.run = function () {

                const currentTime = performance.now();
                const timespan = ( currentTime - self.lastTime ) / 1000;

                if ( timespan >= self.frameTimeLimit ) {

                    self.fps = Math.floor( 1 / timespan );
                    self.lastTime = currentTime;
                    self.callback( timespan );

                }

                if ( self.isActive ) window.requestAnimationFrame( self.run );

            };

        } else

            this.run = function () {

                const currentTime = performance.now();
                const timespan = ( currentTime - self.lastTime ) / 1000;

                self.fps = Math.floor( 1 / timespan );
                self.lastTime = currentTime;

                self.callback( timespan );
                if ( self.isActive ) window.requestAnimationFrame( self.run );

            };


    }

    start() {

        this.isActive = true;
        this.lastTime = performance.now();
        window.requestAnimationFrame( this.run );
        return this;

    }

    stop() {

        this.isActive = false;

    }

}

class ShaderUtil {

    static getDomSrc( id ) {

        const ele = document.getElementById( id );
        if ( ! ele || ele.textContent === '' ) {

            console.error( `${id} shader element dose not have text.` );
            return null;

        }
        return ele.textContent;

    }

    static createShader( gl, src, type ) {

        const shader = gl.createShader( type );
        gl.shaderSource( shader, src );
        gl.compileShader( shader );

        if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

            console.error( `Error compiling shader: ${src}`, gl.getShaderInfoLog( shader ) );
            gl.deleteShader( shader );
            return null;

        }

        return shader;

    }

    static createProgram( gl, vs, fs, doValidate = true ) {

        let vShader;
        let fShader;
        if ( ! ( vs instanceof WebGLShader ) && vs.length < 20 ) {

            const src = this.getDomSrc( vs );
            if ( ! src ) return null;

            vShader = this.createShader( gl, src, gl.VERTEX_SHADER );

            if ( ! vShader ) return null;

        } else if ( ! ( vs instanceof WebGLShader ) ) {

            vShader = this.createShader( gl, vs, gl.VERTEX_SHADER );
            if ( ! vShader ) return null;

        }
        if ( ! ( fs instanceof WebGLShader ) && fs.length < 20 ) {

            const src = this.getDomSrc( fs );
            if ( ! src ) return null;

            fShader = this.createShader( gl, src, gl.FRAGMENT_SHADER );
            if ( ! fShader ) return null;

        } else if ( ! ( fs instanceof WebGLShader ) ) {

            fShader = this.createShader( gl, fs, gl.FRAGMENT_SHADER );
            if ( ! fShader ) return null;

        }

        const prog = gl.createProgram();
        gl.attachShader( prog, vShader );
        gl.attachShader( prog, fShader );

        gl.bindAttribLocation( prog, VTX_ATTR_POSITION_LOC, VTX_ATTR_POSITION_NAME ); // eslint-disable-line
        gl.bindAttribLocation( prog, VTX_ATTR_NORMAL_LOC, VTX_ATTR_NORMAL_NAME ); // eslint-disable-line
        gl.bindAttribLocation( prog, VTX_ATTR_UV_LOC, VTX_ATTR_UV_NAME );

        gl.linkProgram( prog );

        if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS ) ) {

            console.error( 'Error createing shader program.', gl.getProgramInfoLog( prog ) );
            gl.deleteProgram( prog );
            return null;

        }

        if ( doValidate ) {

            gl.validateProgram( prog );
            if ( ! gl.getProgramParameter( prog, gl.VALIDATE_STATUS ) ) {

                console.error( 'Error validating shader program.', gl.getProgramInfoLog( prog ) );
                gl.deleteProgram( prog );
                return null;

            }

        }

        gl.detachShader( prog, vShader );
        gl.detachShader( prog, fShader );
        gl.deleteShader( vShader );
        gl.deleteShader( fShader );

        return prog;

    }

    static getDefaultAttribLocation( gl, program ) {

        return {
            position: gl.getAttribLocation( program, VTX_ATTR_POSITION_NAME ),
            normal: gl.getAttribLocation( program, VTX_ATTR_NORMAL_NAME ),
            uv: gl.getAttribLocation( program, VTX_ATTR_UV_NAME ),
        };

    }

    static getDefaultUnifomLocation( gl, program ) {

        return {
            perspective: gl.getUniformLocation( program, 'u_proj' ),
            view: gl.getUniformLocation( program, 'u_view' ),
            world: gl.getUniformLocation( program, 'u_world' ),
            texture: gl.getUniformLocation( program, 'u_texture' ),
        };

    }

}

class Shader {

    constructor( gl, vs, fs ) {

        this.program = ShaderUtil.createProgram( gl, vs, fs );

        if ( this.program !== null ) {

            this.gl = gl;
            gl.useProgram( this.program );
            this.attribLoc = ShaderUtil.getDefaultAttribLocation( gl, this.program );
            this.uniformLoc = ShaderUtil.getDefaultUnifomLocation( gl, this.program );

        }

    }

    activate() {

        this.gl.useProgram( this.program );
        return this;

    }

    deactivate() {

        this.gl.useProgram( null );
        return this;

    }

    setProjMatrix( mat4Array ) {

        this.gl.uniformMatrix4fv( this.uniformLoc.perspective, false, mat4Array );
        return this;

    }

    setViewMatrix( mat4Array ) {

        this.gl.uniformMatrix4fv( this.uniformLoc.view, false, mat4Array );
        return this;

    }

    setWorldMatrix( mat4Array ) {

        this.gl.uniformMatrix4fv( this.uniformLoc.world, false, mat4Array );
        return this;

    }

    dispose() {

        if ( this.gl.getParameter( this.gl.CURRENT_PROGRAM ) === this.program )
            this.gl.useProgram( null );

        this.gl.deleteProgram( this.program );

    }

    preRender() {} // eslint-disable-line

    renderModal( modal ) {

        if ( modal.mesh.offCullFace ) this.gl.disable( this.gl.CULL_FACE );

        if ( modal.mesh.onBlend ) this.gl.enable( this.gl.BLEND );

        this.setWorldMatrix( modal.transform.getMatrix() );
        this.gl.bindVertexArray( modal.mesh.vao );

        if ( modal.mesh.indexCount )
            this.gl.drawElements( modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0 ); // eslint-disable-line
        else
            this.gl.drawArrays( modal.mesh.drawMode, 0, modal.mesh.vtxCount );

        this.gl.bindVertexArray( null );

        if ( modal.mesh.offCullFace ) this.gl.enable( this.gl.CULL_FACE );

        if ( modal.mesh.onBlend ) this.gl.disable( this.gl.BLEND );

        return this;

    }

}

class GridAxisShader extends Shader {

    constructor( gl, projMat ) {

        const vs = '#version 300 es\n' +
            'in vec3 a_Position;\n' +
            'layout(location=4) in float a_Color;\n' +
            '\n' +
            'uniform mat4 u_world;\n' +
            'uniform mat4 u_view;\n' +
            'uniform mat4 u_proj;\n' +
            'uniform vec3 u_colors[4];\n' +
            '\n' +
            'out vec3 v_color;\n' +
            '\n' +
            'void main() {\n' +
            '    v_color = u_colors[int(a_Color)];\n' +
            '    gl_Position = u_proj * u_view * u_world * vec4(a_Position, 1.0);\n' +
            '}';

        const fs = '#version 300 es\n' +
            'precision mediump float;\n' +
            '\n' +
            'in vec3 v_color;\n' +
            'out vec4 finalColor;\n' +
            '\n' +
            'void main() {\n' +
            '    finalColor = vec4(v_color, 1.0);\n' +
            '}';

        super( gl, vs, fs );

        this.setProjMatrix( projMat );

        const uColor = gl.getUniformLocation( this.program, 'u_colors' );
        gl.uniform3fv( uColor, [ 0.5, 0.5, 0.5, 1, 0, 0, 0, 1, 0, 0, 0, 1 ] );

        gl.useProgram( null );

    }

}

const isArrayBuffer = window.SharedArrayBuffer
    ? function isArrayBufferOrSharedArrayBuffer( ary ) {

        return ary && ary.buffer && ( ary.buffer instanceof ArrayBuffer || ary.buffer instanceof window.SharedArrayBuffer );

    } : function isArrayBuffer( ary ) {

        return ary && ary.buffer && ary.buffer instanceof ArrayBuffer;

    };

const BYTE = 0x1400;
const UNSIGNED_BYTE = 0x1401;
const SHORT = 0x1402;
const UNSIGNED_SHORT = 0x1403;
const INT = 0x1404;
const UNSIGNED_INT = 0x1405;
const FLOAT = 0x1406;
const UNSIGNED_SHORT_4_4_4_4 = 0x8033;
const UNSIGNED_SHORT_5_5_5_1 = 0x8034;
const UNSIGNED_SHORT_5_6_5 = 0x8363;
const HALF_FLOAT = 0x140B;
const UNSIGNED_INT_2_10_10_10_REV = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD;
const UNSIGNED_INT_24_8 = 0x84FA;

const glTypeToTypedArray = {};
{

    const tt = glTypeToTypedArray;
    tt[ BYTE ] = Int8Array;
    tt[ UNSIGNED_BYTE ] = Uint8Array;
    tt[ SHORT ] = Int16Array;
    tt[ UNSIGNED_SHORT ] = Uint16Array;
    tt[ INT ] = Int32Array;
    tt[ UNSIGNED_INT ] = Uint32Array;
    tt[ FLOAT ] = Float32Array;
    tt[ UNSIGNED_SHORT_4_4_4_4 ] = Uint16Array;
    tt[ UNSIGNED_SHORT_5_5_5_1 ] = Uint16Array;
    tt[ UNSIGNED_SHORT_5_6_5 ] = Uint16Array;
    tt[ HALF_FLOAT ] = Uint16Array;
    tt[ UNSIGNED_INT_2_10_10_10_REV ] = Uint32Array;
    tt[ UNSIGNED_INT_10F_11F_11F_REV ] = Uint32Array;
    tt[ UNSIGNED_INT_5_9_9_9_REV ] = Uint32Array;
    tt[ FLOAT_32_UNSIGNED_INT_24_8_REV ] = Uint32Array;
    tt[ UNSIGNED_INT_24_8 ] = Uint32Array;

}

function getGLTypeFromTypedArray( typedArray ) {

    if ( typedArray instanceof Int8Array ) return BYTE;
    if ( typedArray instanceof Uint8Array ) return UNSIGNED_BYTE;
    if ( typedArray instanceof Uint8ClampedArray ) return UNSIGNED_BYTE;
    if ( typedArray instanceof Int16Array ) return SHORT;
    if ( typedArray instanceof Uint16Array ) return UNSIGNED_SHORT;
    if ( typedArray instanceof Int32Array ) return INT;
    if ( typedArray instanceof Uint32Array ) return UNSIGNED_INT;
    if ( typedArray instanceof Float32Array ) return FLOAT;
    throw new Error( 'unsupported typed array type' );

}

function getTypedArrayTypeFromGLType( type ) {

    const arrayType = glTypeToTypedArray[ type ];
    if ( ! arrayType ) throw new Error( 'unkonw gl type' );
    return arrayType;

}

function isIndices( name ) {

    return name === 'index' || name === 'indices';

}

function getArray( array ) {

    return array.length ? array : array.data;

}

function getTypedArray( array, name ) {

    if ( isArrayBuffer( array ) ) return array;

    if ( isIndices( name ) ) return new Uint16Array( array );

    return new Float32Array( array );

}

const colorRE = /color|colour/i;
const textureRE = /uv|coord/i;

function guessNumComponentsFromName( name, length ) {

    let numComponents;
    if ( colorRE.test( name ) ) numComponents = 4;
    else if ( textureRE.test( name ) ) numComponents = 2;
    else numComponents = 3;

    if ( length % numComponents > 0 )
        throw new Error( `Can not guess numComponents for attribute ${name}.` );

}

function getNumComponents( array, name ) {

    return array.numComponents || array.size || guessNumComponentsFromName( name, getArray( array ).length );

}

function createBufferFromTypedArray( gl, typedArray, type = gl.ARRAY_BUFFER, drawType = gl.STATIC_DRAW ) {

    if ( typedArray instanceof WebGLBuffer )
        return typedArray;

    const buffer = gl.createBuffer();
    gl.bindBuffer( type, buffer );
    gl.bufferData( type, typedArray, drawType );
    return buffer;

}

const positionNames = [ 'position', 'positions', 'a_position' ];

function getNumElementsFromNonIndicedArrays( arrays ) {

    let key;
    let i;
    for ( i = 0; i < positionNames.length; i ++ )
        if ( positionNames[ i ] in arrays ) {

            key = positionNames[ i ];
            break;

        }

    if ( i === positionNames.length ) [ key ] = Object.keys( arrays );
    const array = arrays[ key ];
    const dataArray = getArray( array );
    return dataArray.length / getNumComponents( array, key );

}

function createBufferFromArray( gl, array, name ) {

    const type = name === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    const typedArray = getTypedArray( getArray( array ), name );
    return createBufferFromTypedArray( gl, typedArray, type, array.drawType );

}

function createBuffersFromArrays( gl, arrays ) {

    const buffers = {};

    Object.keys( arrays ).forEach( ( key ) => {

        buffers[ key ] = createBufferFromArray( gl, arrays[ key ], key );

    } );

    if ( arrays.indices )
        buffers.numElements = arrays.indices.length;
    else
        buffers.numElements = getNumElementsFromNonIndicedArrays( arrays );

    return buffers;

}

function createAttribsFromArrays( gl, arrays ) {

    const attribs = {};

    Object.keys( arrays ).forEach( ( key ) => {

        if ( ! isIndices( key ) ) {

            const array = arrays[ key ];
            const attribName = array.name || array.attrib || array.attribName || key;
            const typedArray = getTypedArray( getArray( array ), key );
            const buffer = createBufferFromTypedArray( gl, typedArray, gl.ARRAY_BUFFER, array.drawType );
            const type = getGLTypeFromTypedArray( typedArray );
            const normalization = array.normalize !== undefined ? array.normalize : false;
            const numComponents = getNumComponents( array, key );

            attribs[ attribName ] = {
                buffer,
                numComponents,
                type,
                normalize: normalization,
                stride: array.stride || 0,
                offset: array.offset || 0,
                drawType: array.drawType || gl.STATIC_DRAW,
            };

        }

    } );

    return attribs;

}

function createBufferInfoFromArrays( gl, arrays ) {

    const bufferInfo = {
        attribs: createAttribsFromArrays( gl, arrays ),
    };

    const { indices } = arrays;
    if ( indices ) {

        const newIndices = getTypedArray( getArray( indices ), 'indices' );
        bufferInfo.indices = createBufferFromTypedArray( gl, newIndices, gl.ELEMENT_ARRAY_BUFFER );
        bufferInfo.numElements = newIndices.length;
        bufferInfo.elementType = getGLTypeFromTypedArray( newIndices );

    } else
        bufferInfo.numElements = getNumElementsFromNonIndicedArrays( arrays );

    return bufferInfo;

}

function isWebGL2( gl ) {

    return !! gl.texStorage2D;

}

const glEnumToString = ( function () {

    const haveEnumsForType = {};
    const enums = {};

    function addEnums( gl ) {

        const type = gl.constructor.name;
        if ( ! haveEnumsForType[ type ] ) {

            /* eslint-disable */
            for ( const key in gl )
                if ( typeof gl[ key ] === 'number' ) { 

                    const existing = enums[ gl[ key ] ];
                    enums[ gl[ key ] ] = existing ? `${existing} | ${key}` : key;

                }
            /* eslint-enable */
            haveEnumsForType[ type ] = true;

        }

    }

    return function ( gl, value ) {

        addEnums( gl );
        return enums[ value ] || ( `0x${value.toString( 16 )}` );

    };

}() );

const defaults = {
    textureColor: new Uint8Array( [ 255, 105, 180, 255 ] ),
    textureOptions: {},
    crossOrigin: undefined,
};

/* PixelFormat */
const ALPHA = 0x1906;
const RGB = 0x1907;
const RGBA = 0x1908;
const LUMINANCE = 0x1909;
const LUMINANCE_ALPHA = 0x190A;
const DEPTH_COMPONENT = 0x1902;
const DEPTH_STENCIL = 0x84F9;

const R8 = 0x8229;
const R8_SNORM = 0x8F94;
const R16F = 0x822D;
const R32F = 0x822E;
const R8UI = 0x8232;
const R8I = 0x8231;
const RG16UI = 0x823A;
const RG16I = 0x8239;
const RG32UI = 0x823C;
const RG32I = 0x823B;
const RG8 = 0x822B;
const RG8_SNORM = 0x8F95;
const RG16F = 0x822F;
const RG32F = 0x8230;
const RG8UI = 0x8238;
const RG8I = 0x8237;
const R16UI = 0x8234;
const R16I = 0x8233;
const R32UI = 0x8236;
const R32I = 0x8235;
const RGB8 = 0x8051;
const SRGB8 = 0x8C41;
const RGB565 = 0x8D62;
const RGB8_SNORM = 0x8F96;
const R11F_G11F_B10F = 0x8C3A;
const RGB9_E5 = 0x8C3D;
const RGB16F = 0x881B;
const RGB32F = 0x8815;
const RGB8UI = 0x8D7D;
const RGB8I = 0x8D8F;
const RGB16UI = 0x8D77;
const RGB16I = 0x8D89;
const RGB32UI = 0x8D71;
const RGB32I = 0x8D83;
const RGBA8 = 0x8058;
const SRGB8_ALPHA8 = 0x8C43;
const RGBA8_SNORM = 0x8F97;
const RGB5_A1 = 0x8057;
const RGBA4 = 0x8056;
const RGB10_A2 = 0x8059;
const RGBA16F = 0x881A;
const RGBA32F = 0x8814;
const RGBA8UI = 0x8D7C;
const RGBA8I = 0x8D8E;
const RGB10_A2UI = 0x906F;
const RGBA16UI = 0x8D76;
const RGBA16I = 0x8D88;
const RGBA32I = 0x8D82;
const RGBA32UI = 0x8D70;

const DEPTH_COMPONENT16 = 0x81A5;
const DEPTH_COMPONENT24 = 0x81A6;
const DEPTH_COMPONENT32F = 0x8CAC;
const DEPTH32F_STENCIL8 = 0x8CAD;
const DEPTH24_STENCIL8 = 0x88F0;

/* DataType */
const BYTE$1 = 0x1400;
const UNSIGNED_BYTE$1 = 0x1401;
const SHORT$1 = 0x1402;
const UNSIGNED_SHORT$1 = 0x1403;
const INT$1 = 0x1404;
const UNSIGNED_INT$1 = 0x1405;
const FLOAT$1 = 0x1406;
const UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
const UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
const UNSIGNED_SHORT_5_6_5$1 = 0x8363;
const HALF_FLOAT$1 = 0x140B;
const HALF_FLOAT_OES = 0x8D61; // Thanks Khronos for making this different >:(
const UNSIGNED_INT_2_10_10_10_REV$1 = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV$1 = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV$1 = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV$1 = 0x8DAD;
const UNSIGNED_INT_24_8$1 = 0x84FA;

const RG = 0x8227;
const RG_INTEGER = 0x8228;
const RED = 0x1903;
const RED_INTEGER = 0x8D94;
const RGB_INTEGER = 0x8D98;
const RGBA_INTEGER = 0x8D99;

const textureInternalFormatInfo = {};
{

    // NOTE: these properties need unique names so we can let Uglify mangle the name.
    const t = textureInternalFormatInfo;
    // unsized formats
    t[ ALPHA ] = {
        textureFormat: ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 1, 2, 2, 4 ], type: [ UNSIGNED_BYTE$1, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$1 ],
    };
    t[ LUMINANCE ] = {
        textureFormat: LUMINANCE, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 1, 2, 2, 4 ], type: [ UNSIGNED_BYTE$1, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$1 ],
    };
    t[ LUMINANCE_ALPHA ] = {
        textureFormat: LUMINANCE_ALPHA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 2, 4, 4, 8 ], type: [ UNSIGNED_BYTE$1, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$1 ],
    };
    t[ RGB ] = {
        textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 3, 6, 6, 12, 2 ], type: [ UNSIGNED_BYTE$1, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$1, UNSIGNED_SHORT_5_6_5$1 ],
    };
    t[ RGBA ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 8, 8, 16, 2, 2 ], type: [ UNSIGNED_BYTE$1, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$1, UNSIGNED_SHORT_4_4_4_4$1, UNSIGNED_SHORT_5_5_5_1$1 ],
    };

    // sized formats
    t[ R8 ] = {
        textureFormat: RED, colorRenderable: true, textureFilterable: true, bytesPerElement: 1, type: UNSIGNED_BYTE$1,
    };
    t[ R8_SNORM ] = {
        textureFormat: RED, colorRenderable: false, textureFilterable: true, bytesPerElement: 1, type: BYTE$1,
    };
    t[ R16F ] = {
        textureFormat: RED, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 4, 2 ], type: [ FLOAT$1, HALF_FLOAT$1 ],
    };
    t[ R32F ] = {
        textureFormat: RED, colorRenderable: false, textureFilterable: false, bytesPerElement: 4, type: FLOAT$1,
    };
    t[ R8UI ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: UNSIGNED_BYTE$1,
    };
    t[ R8I ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 1, type: BYTE$1,
    };
    t[ R16UI ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: UNSIGNED_SHORT$1,
    };
    t[ R16I ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: SHORT$1,
    };
    t[ R32UI ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT$1,
    };
    t[ R32I ] = {
        textureFormat: RED_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: INT$1,
    };
    t[ RG8 ] = {
        textureFormat: RG, colorRenderable: true, textureFilterable: true, bytesPerElement: 2, type: UNSIGNED_BYTE$1,
    };
    t[ RG8_SNORM ] = {
        textureFormat: RG, colorRenderable: false, textureFilterable: true, bytesPerElement: 2, type: BYTE$1,
    };
    t[ RG16F ] = {
        textureFormat: RG, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 8, 4 ], type: [ FLOAT$1, HALF_FLOAT$1 ],
    };
    t[ RG32F ] = {
        textureFormat: RG, colorRenderable: false, textureFilterable: false, bytesPerElement: 8, type: FLOAT$1,
    };
    t[ RG8UI ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: UNSIGNED_BYTE$1,
    };
    t[ RG8I ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 2, type: BYTE$1,
    };
    t[ RG16UI ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_SHORT$1,
    };
    t[ RG16I ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: SHORT$1,
    };
    t[ RG32UI ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: UNSIGNED_INT$1,
    };
    t[ RG32I ] = {
        textureFormat: RG_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: INT$1,
    };
    t[ RGB8 ] = {
        textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: 3, type: UNSIGNED_BYTE$1,
    };
    t[ SRGB8 ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: UNSIGNED_BYTE$1,
    };
    t[ RGB565 ] = {
        textureFormat: RGB, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 3, 2 ], type: [ UNSIGNED_BYTE$1, UNSIGNED_SHORT_5_6_5$1 ],
    };
    t[ RGB8_SNORM ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: 3, type: BYTE$1,
    };
    t[ R11F_G11F_B10F ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6, 4 ], type: [ FLOAT$1, HALF_FLOAT$1, UNSIGNED_INT_10F_11F_11F_REV$1 ],
    };
    t[ RGB9_E5 ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6, 4 ], type: [ FLOAT$1, HALF_FLOAT$1, UNSIGNED_INT_5_9_9_9_REV$1 ],
    };
    t[ RGB16F ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 12, 6 ], type: [ FLOAT$1, HALF_FLOAT$1 ],
    };
    t[ RGB32F ] = {
        textureFormat: RGB, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: FLOAT$1,
    };
    t[ RGB8UI ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: UNSIGNED_BYTE$1,
    };
    t[ RGB8I ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 3, type: BYTE$1,
    };
    t[ RGB16UI ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: UNSIGNED_SHORT$1,
    };
    t[ RGB16I ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 6, type: SHORT$1,
    };
    t[ RGB32UI ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: UNSIGNED_INT$1,
    };
    t[ RGB32I ] = {
        textureFormat: RGB_INTEGER, colorRenderable: false, textureFilterable: false, bytesPerElement: 12, type: INT$1,
    };
    t[ RGBA8 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_BYTE$1,
    };
    t[ SRGB8_ALPHA8 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_BYTE$1,
    };
    t[ RGBA8_SNORM ] = {
        textureFormat: RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: 4, type: BYTE$1,
    };
    t[ RGB5_A1 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 2, 4 ], type: [ UNSIGNED_BYTE$1, UNSIGNED_SHORT_5_5_5_1$1, UNSIGNED_INT_2_10_10_10_REV$1 ],
    };
    t[ RGBA4 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: [ 4, 2 ], type: [ UNSIGNED_BYTE$1, UNSIGNED_SHORT_4_4_4_4$1 ],
    };
    t[ RGB10_A2 ] = {
        textureFormat: RGBA, colorRenderable: true, textureFilterable: true, bytesPerElement: 4, type: UNSIGNED_INT_2_10_10_10_REV$1,
    };
    t[ RGBA16F ] = {
        textureFormat: RGBA, colorRenderable: false, textureFilterable: true, bytesPerElement: [ 16, 8 ], type: [ FLOAT$1, HALF_FLOAT$1 ],
    };
    t[ RGBA32F ] = {
        textureFormat: RGBA, colorRenderable: false, textureFilterable: false, bytesPerElement: 16, type: FLOAT$1,
    };
    t[ RGBA8UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_BYTE$1,
    };
    t[ RGBA8I ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: BYTE$1,
    };
    t[ RGB10_A2UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT_2_10_10_10_REV$1,
    };
    t[ RGBA16UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: UNSIGNED_SHORT$1,
    };
    t[ RGBA16I ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 8, type: SHORT$1,
    };
    t[ RGBA32I ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: INT$1,
    };
    t[ RGBA32UI ] = {
        textureFormat: RGBA_INTEGER, colorRenderable: true, textureFilterable: false, bytesPerElement: 16, type: UNSIGNED_INT$1,
    };
    // Sized Internal
    t[ DEPTH_COMPONENT16 ] = {
        textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: [ 2, 4 ], type: [ UNSIGNED_SHORT$1, UNSIGNED_INT$1 ],
    };
    t[ DEPTH_COMPONENT24 ] = {
        textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT$1,
    };
    t[ DEPTH_COMPONENT32F ] = {
        textureFormat: DEPTH_COMPONENT, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: FLOAT$1,
    };
    t[ DEPTH24_STENCIL8 ] = {
        textureFormat: DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: UNSIGNED_INT_24_8$1,
    };
    t[ DEPTH32F_STENCIL8 ] = {
        textureFormat: DEPTH_STENCIL, colorRenderable: true, textureFilterable: false, bytesPerElement: 4, type: FLOAT_32_UNSIGNED_INT_24_8_REV$1,
    };

    Object.keys( t ).forEach( ( internalFormat ) => {

        const info = t[ internalFormat ];
        info.bytesPerElementMap = {};
        if ( Array.isArray( info.bytesPerElement ) )
            info.bytesPerElement.forEach( ( bytesPerElement, ndx ) => {

                const type = info.type[ ndx ];
                info.bytesPerElementMap[ type ] = bytesPerElement;

            } );
        else {

            const { type } = info;
            info.bytesPerElementMap[ type ] = info.bytesPerElement;

        }

    } );

}

function empty() {
}

function getFormatAndTypeFromInternalFormat( internalFromat ) {

    const info = textureInternalFormatInfo[ internalFromat ];

    if ( ! info )
        throw new Error( 'unknown internal format' );


    return {
        format: info.textureFormat,
        type: Array.isArray( info.type ) ? info.type[ 0 ] : info.type,
    };

}

function make1Pixel( color ) {

    const colorUsed = color || defaults.textureColor;
    if ( isArrayBuffer( colorUsed ) ) return colorUsed;
    return new Uint8Array( [ colorUsed[ 0 ], colorUsed[ 1 ], colorUsed[ 2 ], colorUsed[ 3 ] ] );

}

function setTextureTo1PixelColor( gl, tex, options ) {

    const opts = options || defaults.textureOptions;
    const target = opts.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    if ( opts.color === false ) return;

    const color = make1Pixel( options.color );
    if ( target === gl.TEXTURE_CUBE_MAP )
        for ( let i = 0; i < 6; i ++ )
            gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color );
    else if ( target === gl.TEXTURE_3D || target === gl.TEXTURE_2D_ARRAY )
        gl.texImage3D( target, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color );
    else
        gl.texImage2D( target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color );

}

function loadImage( url, crossOrigin, callback ) {

    const cb = callback || empty;
    let img = new Image();
    const cors = crossOrigin !== undefined ? crossOrigin : defaults.crossOrigin;
    if ( cors !== undefined )
        img.crossOrigin = cors;


    function clearEventHandlers() {

        img.removeEventListener( 'error', onError ); // eslint-disable-line
        img.removeEventListener( 'load', onLoad ); // eslint-disable-line
        img = null;

    }

    function onError() {

        const msg = `couldn't load image: ${url}`;
        cb( msg, img );
        clearEventHandlers();

    }

    function onLoad() {

        cb( null, img );
        clearEventHandlers();

    }

    img.addEventListener( 'error', onError );
    img.addEventListener( 'load', onLoad );
    img.src = url;
    return img;

}

const lastPackState = {};

function savePatcState( gl, options ) {

    if ( options.colorspaceConversion !== undefined ) {

        lastPackState.colorspaceConversion = gl.getParameter( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL );
        gl.pixelStorei( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, options.colorspaceConversion );

    }
    if ( options.premultiplyAlpha !== undefined ) {

        lastPackState.premultiplyAlpha = gl.getParameter( gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL );
        gl.pixelStorei( gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha );

    }
    if ( options.flipY !== undefined ) {

        lastPackState.flipY = gl.getParameter( gl.UNPACK_FLIP_Y_WEBGL );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, options.flipY );

    }

}

function restorePackState( gl, options ) {

    if ( options.colorspaceConversion !== undefined )
        gl.pixelStorei( gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, lastPackState.colorspaceConversion );
    if ( options.premultiplyAlpha !== undefined )
        gl.pixelStorei( gl.UNPACH_PREMULTIPLY_ALPHA_WEBGL, lastPackState.premultiplyAlpha );
    if ( options.flipY !== undefined )
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, lastPackState.flipY );

}

function getCubeFacesOrder( gl, options ) {

    const opts = options || {};
    return opts.cubeFaceOrder || [
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];

}

function getCubeFacesWithIdx( gl, options ) {

    const faces = getCubeFacesOrder( gl, options );

    const facesWithIdx = faces.map( ( face, idx ) => ( { face, idx } ) );

    facesWithIdx.sort( ( a, b ) => ( a.face - b.face ) );

    return facesWithIdx;

}

function shouldAutoSetTextureFiltering( options ) {

    return options.auto === true || ( options.auto === undefined && options.level === undefined );

}

function isPowerOf2( value ) {

    return ( value & ( value - 1 ) ) === 0;

}

function canGenerateMipmap( gl, width, height, internalFormat ) {

    if ( ! isWebGL2( gl ) )
        return isPowerOf2( width ) && isPowerOf2( height );

    const info = textureInternalFormatInfo[ internalFormat ];
    if ( ! info )
        throw new Error( 'unknown internal format' );
    return info.colorRenderable && info.textureFilterable;

}

function canFilter( internalFormat ) {

    const info = textureInternalFormatInfo[ internalFormat ];
    if ( ! info )
        throw new Error( 'unknow internal format' );

    return info.textureFilterable;

}

function setTextureFiltering( gl, tex, options, widthP, heightP, internalFormatP, typeP ) {

    const opts = options || defaults.textureOptions;
    const internalFormat = internalFormatP || gl.RGBA;
    const type = typeP || gl.UNSIGNED_SHORT;
    const target = opts.target || gl.TEXTURE_2D;
    const width = widthP || opts.width;
    const height = heightP || opts.height;
    gl.bindTexture( target, tex );
    if ( canGenerateMipmap( gl, width, height, internalFormat, type ) )
        gl.generateMipmap( target );
    else {

        const filtering = canFilter( internalFormat ) ? gl.LINEAR : gl.NEAREST;
        gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, filtering );
        gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, filtering );
        gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

}

const WebGLSamplerCtor = window.WebGLSampler || function NoWebGLSampler() {};

function setTextureSamplerParameters( gl, target, parameteriFn, options ) {

    if ( options.minMag ) {

        parameteriFn.call( gl, target, gl.TEXTURE_MIN_FILTER, options.minMag );
        parameteriFn.call( gl, target, gl.TEXTURE_MAG_FILTER, options.minMag );

    }

    if ( options.min )
        parameteriFn.call( gl, target, gl.TEXTURE_MIN_FILTER, options.min );

    if ( options.mag )
        parameteriFn.call( gl, target, gl.TEXTURE_MAG_FILTER, options.mag );

    if ( options.wrap ) {

        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_S, options.wrap );
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_T, options.wrap );
        if ( target === gl.TEXTURE_3D || target instanceof WebGLSamplerCtor )
            parameteriFn.call( gl, target, gl.TEXTURE_WRAP_R, options.wrap );

    }

    if ( options.wrapR )
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_R, options.wrapR );

    if ( options.wrapS )
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_S, options.wrapS );

    if ( options.wrapT )
        parameteriFn.call( gl, target, gl.TEXTURE_WRAP_T, options.wrapT );

    if ( options.minLod )
        parameteriFn.call( gl, target, gl.TEXTURE_MIN_LOD, options.minLod );

    if ( options.maxLod )
        parameteriFn.call( gl, target, gl.TEXTURE_MAX_LOD, options.maxLod );

    if ( options.baseLevel )
        parameteriFn.call( gl, target, gl.TEXTURE_BASE_LEVEL, options.baseLevel );

    if ( options.maxLevel )
        parameteriFn.call( gl, target, gl.TEXTURE_MAX_LEVEL, options.maxLevel );

}

function setTextureParameters( gl, tex, options ) {

    const target = options.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    setTextureSamplerParameters( gl, target, gl.texParameteri, options );

}

const ctx = document.createElement( 'canvas' ).getContext( '2d' );

function setTextureFromElement( gl, tex, element, options ) {

    const opts = options || defaults.textureOptions;
    const target = opts.target || gl.TEXTURE_2D;
    const level = opts.level || 0;
    let { width, height } = element;
    const internalFormat = opts.internalFormat || opts.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFormat );
    const format = opts.format || formatType.format;
    const type = opts.type || formatType.type;

    savePatcState( gl, opts );
    gl.bindTexture( target, tex );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        const imgWidth = element.width;
        const imgHeight = element.height;
        let size;
        let slices;
        if ( imgWidth / 6 === imgHeight ) {

            size = imgHeight;
            slices = [ 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0 ];

        } else if ( imgHeight / 6 === imgWidth ) {

            size = imgWidth;
            slices = [ 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5 ];

        } else if ( imgWidth / 3 === imgHeight / 2 ) {

            size = imgWidth / 3;
            slices = [ 0, 0, 1, 0, 2, 0, 0, 1, 1, 1, 2, 1 ];

        } else if ( imgWidth / 2 === imgHeight / 3 ) {

            size = imgWidth / 2;
            slices = [ 0, 0, 1, 0, 0, 1, 1, 1, 0, 2, 1, 2 ];

        } else
            throw new Error( `can't guess cube map from element: ${element.src ? element.src : element.nodeName}` );

        ctx.canvas.width = size;
        ctx.canvas.height = size;
        width = size;
        height = size;

        getCubeFacesWithIdx( gl, options ).forEach( ( f ) => {

            const xOffset = slices[ ( f.idx * 2 ) + 0 ] * size;
            const yOffset = slices[ ( f.idx * 2 ) + 1 ] * size;
            ctx.drawImage( element, xOffset, yOffset, size, size, 0, 0, size, size );
            gl.texImage2D( f.face, level, internalFormat, format, type, ctx.canvas );

        } );

        ctx.canvas.width = 1;
        ctx.canvas.height = 1;

    } else if ( target === gl.TEXTURE_3D ) {

        const smallest = Math.min( element.width, element, height );
        const largest = Math.max( element.width, element.height );
        const depth = largest / smallest;
        if ( depth % 1 !== 0 )
            throw new Error( 'can not compute TEXTURE_3D dimensions of element' );

        const xMult = element.width === largest ? 1 : 0;
        const yMult = element.height === largest ? 1 : 0;
        gl.texImage3D( target, level, internalFormat, smallest, smallest, smallest, 0, format, type, null );
        ctx.canvas.width = smallest;
        ctx.canvas.height = smallest;
        for ( let d = 0; d < depth; d ++ ) {

            const srcX = d * smallest * xMult;
            const srcY = d * smallest * yMult;
            const srcW = smallest;
            const srcH = smallest;
            const dstX = 0;
            const dstY = 0;
            const dstW = smallest;
            const dstH = smallest;
            ctx.drawImage( element, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH );
            gl.texSubImage3D( target, level, 0, 0, d, smallest, smallest, 1, format, type, ctx.canvas );

        }

        ctx.canvas.width = 1;
        ctx.canvas.height = 1;

    } else
        gl.texImage2D( target, level, internalFormat, format, type, element );

    restorePackState( gl, options );

    if ( shouldAutoSetTextureFiltering( opts ) )
        setTextureFiltering( gl, tex, options, width, height, internalFormat, type );

    setTextureParameters( gl, tex, options );
    return tex;

}

function loadTextureFromUrl( gl, tex, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    setTextureTo1PixelColor( gl, tex, opts );
    const asyncOpts = Object.assign( {}, opts );
    const img = loadImage( opts.src, asyncOpts.crossOrigin, ( err, imgBK ) => {

        if ( err )
            cb( err, tex, img );
        else {

            setTextureFromElement( gl, tex, imgBK, asyncOpts );
            cb( null, tex, imgBK );

        }

    } );
    return img;

}

function getTextureTypeFromArrayType( gl, src, defaultType ) {

    if ( isArrayBuffer( src ) )
        return getGLTypeFromTypedArray( src );


    return defaultType || gl.UNSIGNED_BYTE;

}

function getBytesPerElementForInternalFromat( internalFromat, type ) {

    const info = textureInternalFormatInfo[ internalFromat ];
    if ( ! info )
        throw new Error( 'unknown internal format' );
    const bytesPerElement = info.bytesPerElementMap[ type ];
    if ( bytesPerElement === undefined )
        throw new Error( 'unknown internal format' );
    return bytesPerElement;

}

function guessDimensions( gl, target, width, height, numElements ) {

    if ( numElements % 1 !== 0 )
        throw new Error( 'can\'t guess dimensions' );

    let cWith;
    let cHeight;
    if ( ! width && ! height ) {

        const size = Math.sqrt( numElements / ( target === gl.TEXTURE_CUBE_MAP ? 6 : 1 ) );
        if ( size % 1 === 0 ) {

            cWith = size;
            cHeight = size;

        } else {

            cWith = numElements;
            cHeight = 1;

        }

    } else if ( ! height ) {

        cHeight = numElements / width;
        if ( cHeight % 1 )
            throw new Error( 'can\'t guess dimensions' );

    } else if ( ! width ) {

        cWith = numElements / height;
        if ( cWith % 1 )
            throw new Error( 'can\'t guess dimensions' );

    }

    return {
        width: cWith,
        height: cHeight,
    };

}

function setTextureFromArray( gl, tex, src, options ) {

    const opts = options || defaults.textureOptions;
    const target = opts.target || gl.TEXTURE_2D;
    gl.bindTexture( target, tex );
    let { width, height, depth } = opts;
    const level = opts.level || 0;
    const internalFromat = opts.internalFormat || opts.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    const format = opts.format || formatType.format;
    const type = opts.format || getTextureTypeFromArrayType( gl, src, formatType.type );
    let typedSrc = src;
    if ( ! isArrayBuffer( typedSrc ) ) {

        const Type = getTypedArrayTypeFromGLType( type );
        typedSrc = new Type( src );

    } else if ( typedSrc instanceof Uint8ClampedArray )
        typedSrc = new Uint8Array( typedSrc.buffer );

    const bytesPerElement = getBytesPerElementForInternalFromat( internalFromat, type );
    const numElements = typedSrc.byteLength / bytesPerElement;
    if ( numElements % 1 )
        throw new Error( `length wrong for format: ${glEnumToString( gl, format )}` );

    let dimensions;
    if ( target === gl.TEXTURE_3D )
        if ( ! width && ! height && ! depth ) {

            const size = Math.cbrt( numElements );
            if ( size % 1 !== 0 )
                throw new Error( `can't guess size of array of numElements: ${numElements}` );
            width = size;
            height = size;
            depth = size;

        } else if ( width && ( ! height || ! depth ) ) {

            dimensions = guessDimensions( gl, target, height, depth, numElements / width );
            height = dimensions.width;
            depth = dimensions.height;

        } else if ( height && ( ! width || ! depth ) ) {

            dimensions = guessDimensions( gl, target, width, depth, numElements / height );
            width = dimensions.width;
            depth = dimensions.height;

        } else {

            dimensions = guessDimensions( gl, target, width, height, numElements / depth );
            width = dimensions.width;
            height = dimensions.height;

        }
    else {

        dimensions = guessDimensions( gl, target, width, height, numElements );
        width = dimensions.width;
        height = dimensions.height;

    }


    gl.pixelStorei( gl.UNPACK_ALIGNMENT, opts.unpackAlignment || 1 );
    savePatcState( gl, options );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        const elementsPerElement = bytesPerElement / typedSrc.BYTES_PER_ELEMENT;
        const faceSize = ( numElements / 6 ) * elementsPerElement;

        getCubeFacesWithIdx( gl, options ).forEach( ( f ) => {

            const offset = faceSize * f.idx;
            const data = typedSrc.subarray( offset, offset + faceSize );
            gl.texImage2D( f.face, level, internalFromat, width, height, 0, format, type, data );

        } );

    } else if ( target === gl.TEXTURE_3D )
        gl.texImage3D( target, level, internalFromat, width, height, depth, 0, format, type, typedSrc );
    else
        gl.texImage2D( target, level, internalFromat, width, height, 0, format, type, typedSrc );


    restorePackState( gl, options );
    return {
        width,
        height,
        depth,
        type,
    };

}

function loadCubeMapFromUrls( gl, tex, options, callback ) {

    const cb = callback || empty;
    const urls = options.src;
    if ( urls.length !== 6 )
        throw new Error( 'there must be 6 urls for a cubemap' );
    const level = options.level || 0;
    const internalFromat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    const format = options.format || formatType.format;
    const type = options.type || gl.UNSIGNED_BYTE;
    const target = options.target || gl.TEXTURE_2D;
    if ( target !== gl.TEXTURE_CUBE_MAP )
        throw new Error( 'target must be TEXTURE_CUBE_MAP' );

    setTextureTo1PixelColor( gl, tex, options );

    const opts = Object.assign( {}, options );
    let numToLoad = 6;
    const errors = [];
    const faces = getCubeFacesOrder( gl, opts );
    let imgs;

    function uploadImg( faceTarget ) {

        return function ( err, img ) {

            numToLoad -= 1;
            if ( err )
                errors.push( err );
            else {

                savePatcState( gl, opts );
                gl.bindTexture( target, tex );
                if ( numToLoad === 5 )
                    getCubeFacesOrder( gl ).forEach( ( otherTarget ) => {

                        gl.texImage2D( otherTarget, level, internalFromat, format, type, img );

                    } );
                else
                    gl.texImage2D( faceTarget, level, internalFromat, format, type, img );

                restorePackState( gl, opts );
                if ( shouldAutoSetTextureFiltering( opts ) )
                    gl.generateMipmap( target );

            }

            if ( numToLoad === 0 )
                cb( errors.length ? errors : undefined, imgs, tex );

        };

    }

    imgs = urls.map( ( url, idx ) => loadImage( url, opts.crossOrigin, uploadImg( faces[ idx ] ) ) );

}

function loadSlicesFromUrls( gl, tex, options, callback ) {

    const cb = callback || empty;
    const urls = options.src;
    const internalFromat = options.internalFormat || options.format || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    const format = options.format || formatType.format;
    const type = options.type || gl.UNSIGNED_BYTE;
    const target = options.target || gl.TEXTURE_2D_ARRAY;
    if ( target !== gl.TEXTURE_3D && target !== gl.TEXTURE_2D_ARRAY )
        throw new Error( 'target must be TEXTURE_3D or TEXTURE_2D_ARRAY' );

    setTextureTo1PixelColor( gl, tex, options );

    const opts = Object.assign( {}, options );
    let numToLoad = urls.length;
    const errors = [];
    let imgs;
    const level = opts.level || 0;
    let width = opts.width;
    let height = opts.height;
    const depth = urls.length;
    let firstImage = true;

    function uploadImg( slice ) {

        return function ( err, img ) {

            numToLoad -= 1;
            if ( err )
                errors.push( err );
            else {

                savePatcState( gl, opts );
                gl.bindTexture( target, tex );

                if ( firstImage ) {

                    firstImage = false;
                    width = opts.width || img.width;
                    height = opts.width || img.width;
                    gl.texImage3D( target, level, internalFromat, width, height, depth, 0, format, type, null );

                    for ( let s = 0; s < depth; s ++ )
                        gl.texSubImage3D( target, level, 0, 0, s, width, height, 1, format, type, img );

                } else {

                    let src = img;
                    if ( img.width !== width || img.height !== height ) {

                        src = ctx.canvas;
                        ctx.canvas.width = width;
                        ctx.canvas.height = height;
                        ctx.drawImage( img, 0, 0, width, height );

                    }

                    gl.texSubImage3D( target, level, 0, 0, slice, width, height, 1, format, type, src );

                    if ( src === ctx.canvas ) {

                        ctx.canvas.width = 0;
                        ctx.canvas.height = 0;

                    }

                }

                restorePackState( gl, opts );
                if ( shouldAutoSetTextureFiltering( opts ) )
                    gl.generateMipmap( target );


            }

            if ( numToLoad === 0 )
                cb( errors.length ? errors : undefined, imgs, tex );

        };

    }

    imgs = urls.map( ( url, idx ) => loadImage( url, opts.crossOrigin, uploadImg( idx ) ) );

}

function createTexture( gl, options, callback ) {

    const cb = callback || empty;
    const opts = options || defaults.textureOptions;
    const tex = gl.createTexture();
    const target = opts.target || gl.TEXTURE_2D;
    let width = opts.width || 1;
    let height = opts.height || 1;
    const internalFromat = opts.internalFromat || gl.RGBA;
    const formatType = getFormatAndTypeFromInternalFormat( internalFromat );
    let type = opts.type || formatType.type;
    gl.bindTexture( target, tex );
    if ( target === gl.TEXTURE_CUBE_MAP ) {

        gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

    const { src } = opts;
    if ( src )
        if ( typeof ( src ) === 'string' ) {

            loadTextureFromUrl( gl, tex, opts, cb );

        } else if ( isArrayBuffer( src ) ||
            ( Array.isArray( src ) && (
                typeof src[ 0 ] === 'number' ||
                Array.isArray( src[ 0 ] ) ||
                isArrayBuffer( src[ 0 ] )
            ) ) ) {

            const dimensions = setTextureFromArray( gl, tex, src, opts );
            width = dimensions.width;
            height = dimensions.height;
            type = dimensions.type;

        } else if ( Array.isArray( src ) && typeof ( src[ 0 ] ) === 'string' ) {

            if ( target === gl.TEXTURE_CUBE_MAP )
                loadCubeMapFromUrls( gl, tex, options, cb );
            else
                loadSlicesFromUrls( gl, tex, opts, cb );

        } else if ( src instanceof HTMLElement ) {

            setTextureFromElement( gl, tex, src, opts );
            width = src.width;
            height = src.height;

        } else {

            throw new Error( 'unsupported src type' );

        }
    if ( shouldAutoSetTextureFiltering( options ) )
        setTextureFiltering( gl, tex, opts, width, height, internalFromat, type );

    setTextureParameters( gl, tex, opts );

    return tex;

}

function isAsyncSrc( src ) {

    return typeof src === 'string' ||
           ( Array.isArray( src ) && typeof src[ 0 ] === 'string' );

}

function createTextures( gl, textureOptions, callback ) {

    const cb = callback || empty;
    let numLoading = 0;
    const errors = [];
    const textures = [];
    const images = {};

    function callCallbackWhenReady() {

        if ( numLoading === 0 )
            setTimeout( () => {

                cb( errors.length ? errors : undefined, textures, images );

            }, 0 );

    }

    Object.keys( textureOptions ).forEach( ( name ) => {

        const options = textureOptions[ name ];

        let onLoadFn;
        if ( isAsyncSrc( options.src ) ) {

            onLoadFn = function ( err, tex, img ) {

                images[ name ] = img;
                numLoading -= 1;
                if ( err )
                    errors.push( err );

                callCallbackWhenReady();

            };

            numLoading += 1;

        }

        textures[ name ] = createTexture( gl, options, onLoadFn );

    } );

    callCallbackWhenReady();

    return textures;

}

const VTX_ATTR_POSITION_NAME$1 = 'a_position';
const VTX_ATTR_POSITION_LOC$1 = 0;
const VTX_ATTR_NORMAL_NAME$1 = 'a_normal';
const VTX_ATTR_NORMAL_LOC$1 = 1;
const VTX_ATTR_UV_NAME$1 = 'a_uv';
const VTX_ATTR_UV_LOC$1 = 2;

function getHTMLElementSrc( id ) {

    const ele = document.getElementById( id );

    if ( ! ele || ele.textContent === '' )
        throw new Error( `${id} shader element does not exist or have text.` );


    return ele.textContent;

}

function createShader( gl, src, type ) {

    const shader = gl.createShader( type );
    gl.shaderSource( shader, src );
    gl.compileShader( shader );

    if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

        gl.deleteShader( shader );
        throw new Error( `Error compiling shader: ${src}`, gl.getShaderInfoLog( shader ) );

    }

    return shader;

}

function createProgram( gl, vs, fs ) {

    let vShader;
    let fShader;

    if ( typeof vs === 'string' && vs.length < 20 ) {

        const src = getHTMLElementSrc( vs );
        vShader = createShader( gl, src, gl.VERTEX_SHADER );

    } else if ( typeof vs === 'string' )
        vShader = createShader( gl, vs, gl.VERTEX_SHADER );

    if ( typeof fs === 'string' && fs.length < 20 ) {

        const src = getHTMLElementSrc( fs );
        fShader = createShader( gl, src, gl.FRAGMENT_SHADER );

    } else if ( typeof fs === 'string' )
        fShader = createShader( gl, fs, gl.FRAGMENT_SHADER );

    const prog = gl.createProgram();
    gl.attachShader( prog, vShader );
    gl.attachShader( prog, fShader );

    gl.bindAttribLocation( prog, VTX_ATTR_POSITION_LOC$1, VTX_ATTR_POSITION_NAME$1 ); // eslint-disable-line
    gl.bindAttribLocation( prog, VTX_ATTR_NORMAL_LOC$1, VTX_ATTR_NORMAL_NAME$1 ); // eslint-disable-line
    gl.bindAttribLocation( prog, VTX_ATTR_UV_LOC$1, VTX_ATTR_UV_NAME$1 );

    gl.linkProgram( prog );

    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS ) ) {

        gl.deleteProgram( prog );
        throw new Error( 'Error createing shader program.', gl.getProgramInfoLog( prog ) );

    }

    gl.validateProgram( prog );
    if ( ! gl.getProgramParameter( prog, gl.VALIDATE_STATUS ) ) {

        gl.deleteProgram( prog );
        throw new Error( 'Error validating shader program.', gl.getProgramInfoLog( prog ) );

    }

    gl.detachShader( prog, vShader );
    gl.detachShader( prog, fShader );
    gl.deleteShader( vShader );
    gl.deleteShader( fShader );

    return prog;

}

function getDefaultAttribLocation( gl, program ) {

    return {
        position: gl.getAttribLocation( program, VTX_ATTR_POSITION_NAME$1 ),
        normal: gl.getAttribLocation( program, VTX_ATTR_NORMAL_NAME$1 ),
        uv: gl.getAttribLocation( program, VTX_ATTR_UV_NAME$1 ),
    };

}


const FLOAT$2 = 0x1406;
const FLOAT_VEC2 = 0x8B50;
const FLOAT_VEC3 = 0x8B51;
const FLOAT_VEC4 = 0x8B52;
const INT$2 = 0x1404;
const INT_VEC2 = 0x8B53;
const INT_VEC3 = 0x8B54;
const INT_VEC4 = 0x8B55;
const BOOL = 0x8B56;
const BOOL_VEC2 = 0x8B57;
const BOOL_VEC3 = 0x8B58;
const BOOL_VEC4 = 0x8B59;
const FLOAT_MAT2 = 0x8B5A;
const FLOAT_MAT3 = 0x8B5B;
const FLOAT_MAT4 = 0x8B5C;
const SAMPLER_2D = 0x8B5E;
const SAMPLER_CUBE = 0x8B60;
const SAMPLER_3D = 0x8B5F;
const SAMPLER_2D_SHADOW = 0x8B62;
const FLOAT_MAT2x3 = 0x8B65; // eslint-disable-line
const FLOAT_MAT2x4 = 0x8B66; // eslint-disable-line
const FLOAT_MAT3x2 = 0x8B67; // eslint-disable-line
const FLOAT_MAT3x4 = 0x8B68; // eslint-disable-line
const FLOAT_MAT4x2 = 0x8B69; // eslint-disable-line
const FLOAT_MAT4x3 = 0x8B6A; // eslint-disable-line
const SAMPLER_2D_ARRAY = 0x8DC1;
const SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
const SAMPLER_CUBE_SHADOW = 0x8DC5;
const UNSIGNED_INT$2 = 0x1405;
const UNSIGNED_INT_VEC2 = 0x8DC6;
const UNSIGNED_INT_VEC3 = 0x8DC7;
const UNSIGNED_INT_VEC4 = 0x8DC8;
const INT_SAMPLER_2D = 0x8DCA;
const INT_SAMPLER_3D = 0x8DCB;
const INT_SAMPLER_CUBE = 0x8DCC;
const INT_SAMPLER_2D_ARRAY = 0x8DCF;
const UNSIGNED_INT_SAMPLER_2D = 0x8DD2;
const UNSIGNED_INT_SAMPLER_3D = 0x8DD3;
const UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4;
const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

const TEXTURE_2D = 0x0DE1;
const TEXTURE_CUBE_MAP = 0x8513;
const TEXTURE_3D = 0x806F;
const TEXTURE_2D_ARRAY = 0x8C1A;


const typeMap = {};

function getBindPointForSamplerType( gl, type ) {

    return typeMap[ type ].bindPoint;

}

function floatSetter( gl, location ) {

    return function ( v ) {

        gl.uniform1f( location, v );

    };

}

function floatArraySetter( gl, location ) {

    return function ( v ) {

        gl.uniform1fv( location, v );

    };

}

function floatVec2Setter( gl, location ) {

    return function ( v ) {

        gl.uniform2fv( location, v );

    };

}

function floatVec3Setter( gl, location ) {

    return function ( v ) {

        gl.uniform3fv( location, v );

    };

}

function floatVec4Setter( gl, location ) {

    return function ( v ) {

        gl.uniform4fv( location, v );

    };

}

function intSetter( gl, location ) {

    return function ( v ) {

        gl.uniform1i( location, v );

    };

}

function intArraySetter( gl, location ) {

    return function ( v ) {

        gl.uniform1iv( location, v );

    };

}

function intVec2Setter( gl, location ) {

    return function ( v ) {

        gl.uniform2iv( location, v );

    };

}

function intVec3Setter( gl, location ) {

    return function ( v ) {

        gl.uniform3iv( location, v );

    };

}

function intVec4Setter( gl, location ) {

    return function ( v ) {

        gl.uniform4iv( location, v );

    };

}

function uintSetter( gl, location ) {

    return function ( v ) {

        gl.uniform1ui( location, v );

    };

}

function uintArraySetter( gl, location ) {

    return function ( v ) {

        gl.uniform1uiv( location, v );

    };

}

function uintVec2Setter( gl, location ) {

    return function ( v ) {

        gl.uniform2uiv( location, v );

    };

}

function uintVec3Setter( gl, location ) {

    return function ( v ) {

        gl.uniform3uiv( location, v );

    };

}

function uintVec4Setter( gl, location ) {

    return function ( v ) {

        gl.uniform4uiv( location, v );

    };

}

function floatMat2Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix2fv( location, false, v );

    };

}

function floatMat3Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix3fv( location, false, v );

    };

}

function floatMat4Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix4fv( location, false, v );

    };

}

function floatMat23Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix2x3fv( location, false, v );

    };

}

function floatMat32Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix3x2fv( location, false, v );

    };

}

function floatMat24Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix2x4fv( location, false, v );

    };

}

function floatMat42Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix4x2fv( location, false, v );

    };

}

function floatMat34Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix3x4fv( location, false, v );

    };

}

function floatMat43Setter( gl, location ) {

    return function ( v ) {

        gl.uniformMatrix4x3fv( location, false, v );

    };

}

function samplerSetter( gl, type, unit, location ) {

    const bindPoint = getBindPointForSamplerType( gl, type );
    return isWebGL2( gl ) ? function ( textureOrPair ) {

        let texture;
        let sampler;
        if ( textureOrPair instanceof WebGLTexture ) {

            texture = textureOrPair;
            sampler = null;

        } else {

            texture = textureOrPair.texture;
            sampler = textureOrPair.sampler;

        }
        gl.uniform1i( location, unit );
        gl.activeTexture( gl.TEXTURE0 + unit );
        gl.bindTexture( bindPoint, texture );
        gl.bindSampler( unit, sampler );

    } : function ( texture ) {

        gl.uniform1i( location, unit );
        gl.activeTexture( gl.TEXTURE0 + unit );
        gl.bindTexture( bindPoint, texture );

    };

}

function samplerArraySetter( gl, type, unit, location, size ) {

    const bindPoint = getBindPointForSamplerType( gl, type );
    const units = new Int32Array( size );
    for ( let ii = 0; ii < size; ++ ii )
        units[ ii ] = unit + ii;


    return isWebGL2( gl ) ? function ( textures ) {

        gl.uniform1iv( location, units );
        textures.forEach( ( textureOrPair, index ) => {

            gl.activeTexture( gl.TEXTURE0 + units[ index ] );
            let texture;
            let sampler;
            if ( textureOrPair instanceof WebGLTexture ) {

                texture = textureOrPair;
                sampler = null;

            } else {

                texture = textureOrPair.texture;
                sampler = textureOrPair.sampler;

            }
            gl.bindSampler( unit, sampler );
            gl.bindTexture( bindPoint, texture );

        } );

    } : function ( textures ) {

        gl.uniform1iv( location, units );
        textures.forEach( ( texture, index ) => {

            gl.activeTexture( gl.TEXTURE0 + units[ index ] );
            gl.bindTexture( bindPoint, texture );

        } );

    };

}

typeMap[ FLOAT$2 ] = {
    Type: Float32Array, size: 4, setter: floatSetter, arraySetter: floatArraySetter,
};
typeMap[ FLOAT_VEC2 ] = { Type: Float32Array, size: 8, setter: floatVec2Setter };
typeMap[ FLOAT_VEC3 ] = { Type: Float32Array, size: 12, setter: floatVec3Setter };
typeMap[ FLOAT_VEC4 ] = { Type: Float32Array, size: 16, setter: floatVec4Setter };
typeMap[ INT$2 ] = {
    Type: Int32Array, size: 4, setter: intSetter, arraySetter: intArraySetter,
};
typeMap[ INT_VEC2 ] = { Type: Int32Array, size: 8, setter: intVec2Setter };
typeMap[ INT_VEC3 ] = { Type: Int32Array, size: 12, setter: intVec3Setter };
typeMap[ INT_VEC4 ] = { Type: Int32Array, size: 16, setter: intVec4Setter };
typeMap[ UNSIGNED_INT$2 ] = {
    Type: Uint32Array, size: 4, setter: uintSetter, arraySetter: uintArraySetter,
};
typeMap[ UNSIGNED_INT_VEC2 ] = { Type: Uint32Array, size: 8, setter: uintVec2Setter };
typeMap[ UNSIGNED_INT_VEC3 ] = { Type: Uint32Array, size: 12, setter: uintVec3Setter };
typeMap[ UNSIGNED_INT_VEC4 ] = { Type: Uint32Array, size: 16, setter: uintVec4Setter };
typeMap[ BOOL ] = {
    Type: Uint32Array, size: 4, setter: intSetter, arraySetter: intArraySetter,
};
typeMap[ BOOL_VEC2 ] = { Type: Uint32Array, size: 8, setter: intVec2Setter };
typeMap[ BOOL_VEC3 ] = { Type: Uint32Array, size: 12, setter: intVec3Setter };
typeMap[ BOOL_VEC4 ] = { Type: Uint32Array, size: 16, setter: intVec4Setter };
typeMap[ FLOAT_MAT2 ] = { Type: Float32Array, size: 16, setter: floatMat2Setter };
typeMap[ FLOAT_MAT3 ] = { Type: Float32Array, size: 36, setter: floatMat3Setter };
typeMap[ FLOAT_MAT4 ] = { Type: Float32Array, size: 64, setter: floatMat4Setter };
typeMap[ FLOAT_MAT2x3 ] = { Type: Float32Array, size: 24, setter: floatMat23Setter };
typeMap[ FLOAT_MAT2x4 ] = { Type: Float32Array, size: 32, setter: floatMat24Setter };
typeMap[ FLOAT_MAT3x2 ] = { Type: Float32Array, size: 24, setter: floatMat32Setter };
typeMap[ FLOAT_MAT3x4 ] = { Type: Float32Array, size: 48, setter: floatMat34Setter };
typeMap[ FLOAT_MAT4x2 ] = { Type: Float32Array, size: 32, setter: floatMat42Setter };
typeMap[ FLOAT_MAT4x3 ] = { Type: Float32Array, size: 48, setter: floatMat43Setter };
typeMap[ SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,
};
typeMap[ SAMPLER_2D_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};
typeMap[ SAMPLER_2D_ARRAY_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};
typeMap[ SAMPLER_CUBE_SHADOW ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ INT_SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ INT_SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,
};
typeMap[ INT_SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ INT_SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};
typeMap[ UNSIGNED_INT_SAMPLER_2D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D,
};
typeMap[ UNSIGNED_INT_SAMPLER_3D ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,
};
typeMap[ UNSIGNED_INT_SAMPLER_CUBE ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP,
};
typeMap[ UNSIGNED_INT_SAMPLER_2D_ARRAY ] = {
    Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY,
};

function floatAttribSetter( gl, index ) {

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        gl.enableVertexAttribArray( index );
        gl.vertexAttribPointer( index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0 );

    };

}

function intAttribSetter( gl, index ) {

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        gl.enableVertexAttribArray( index );
        gl.vertexAttribIPointer( index, b.numComponents || b.size, b.type || gl.INT, b.stride || 0, b.offset || 0 );

    };

}

function matAttribSetter( gl, index, typeInfo ) {

    const defaultSize = typeInfo.size;
    const count = typeInfo.count;

    return function ( b ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, b.buffer );
        const numComponents = b.size || b.numComponents || defaultSize;
        const size = numComponents / count;
        const type = b.type || gl.FLOAT;
        const typeInfoNew = typeMap[ type ];
        const stride = typeInfoNew.size * numComponents;
        const normalize = b.normalize || false;
        const offset = b.offset || 0;
        const rowOffset = stride / count;
        for ( let i = 0; i < count; ++ i ) {

            gl.enableVertexAttribArray( index + i );
            gl.vertexAttribPointer( index + i, size, type, normalize, stride, offset + ( rowOffset * i ) );

        }

    };

}

const attrTypeMap = {};
attrTypeMap[ FLOAT$2 ] = { size: 4, setter: floatAttribSetter };
attrTypeMap[ FLOAT_VEC2 ] = { size: 8, setter: floatAttribSetter };
attrTypeMap[ FLOAT_VEC3 ] = { size: 12, setter: floatAttribSetter };
attrTypeMap[ FLOAT_VEC4 ] = { size: 16, setter: floatAttribSetter };
attrTypeMap[ INT$2 ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ INT_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ INT_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ INT_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT$2 ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ UNSIGNED_INT_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ BOOL ] = { size: 4, setter: intAttribSetter };
attrTypeMap[ BOOL_VEC2 ] = { size: 8, setter: intAttribSetter };
attrTypeMap[ BOOL_VEC3 ] = { size: 12, setter: intAttribSetter };
attrTypeMap[ BOOL_VEC4 ] = { size: 16, setter: intAttribSetter };
attrTypeMap[ FLOAT_MAT2 ] = { size: 4, setter: matAttribSetter, count: 2 };
attrTypeMap[ FLOAT_MAT3 ] = { size: 9, setter: matAttribSetter, count: 3 };
attrTypeMap[ FLOAT_MAT4 ] = { size: 16, setter: matAttribSetter, count: 4 };

function isBuiltIn( info ) {

    const name = info.name;
    return name.startsWith( 'gl_' ) || name.startsWith( 'webgl_' );

}

function createAttributesSetters( gl, program ) {

    const attribSetters = {};

    const numAttribs = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );
    for ( let i = 0; i < numAttribs; i ++ ) {

        const attribInfo = gl.getActiveAttrib( program, i );
        if ( isBuiltIn( attribInfo ) )
            continue; // eslint-disable-line
        const index = gl.getAttribLocation( program, attribInfo.name );
        const typeInfo = attrTypeMap[ attribInfo.type ];
        const setter = typeInfo.setter( gl, index, typeInfo );
        setter.location = index;
        attribSetters[ attribInfo.name ] = setter;

    }

    return attribSetters;

}

function setAttributes( setters, buffers ) {

    Object.keys( buffers ).forEach( ( attrib ) => {

        const setter = setters[ attrib ];
        if ( setter )
            setter( buffers[ attrib ] );

    } );

}

function createUniformSetters( gl, program ) {

    let textureUnit = 0;

    function createUnifromSetter( uniformInfo ) {

        const location = gl.getUniformLocation( program, uniformInfo.name );
        const isArray = ( uniformInfo.size > 1 && uniformInfo.name.substr( 3 ) === '[0]' );
        const type = uniformInfo.type;
        const typeInfo = typeMap[ type ];
        if ( ! typeInfo )
            throw new Error( `unknown type: 0x${type.toString( 16 )}` );
        let setter;
        if ( typeInfo.bindPoint ) {

            const uint = textureUnit;
            textureUnit += uniformInfo.size;
            if ( isArray )
                setter = typeInfo.arraySetter( gl, type, uint, location, uniformInfo.size );
            else
                setter = typeInfo.setter( gl, type, uint, location, uniformInfo.size );

        } else if ( typeInfo.arraySetter && isArray )
            setter = typeInfo.arraySetter( gl, location );
        else
            setter = typeInfo.setter( gl, location );

        setter.location = location;
        return setter;

    }

    const uniformSetters = {};
    const numUnifroms = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

    for ( let i = 0; i < numUnifroms; i ++ ) {

        const uniformInfo = gl.getActiveUniform( program, i );
        if ( isBuiltIn( uniformInfo ) )
            continue; // eslint-disable-line
        let name = uniformInfo.name;
        if ( name.substr( - 3 ) === '[0]' )
            name = name.substr( 0, name.length - 3 );

        const setter = createUnifromSetter( uniformInfo );
        uniformSetters[ name ] = setter;

    }

    return uniformSetters;

}

function setUniforms( setters, ...unifroms ) {

    const numArgs = unifroms.length;
    for ( let i = 1; i < numArgs; i ++ ) {

        const vals = unifroms[ i ];
        if ( Array.isArray( vals ) ) {

            const numVals = vals.length;
            for ( let j = 0; j < numVals; j ++ )
                setUniforms( setters, vals[ j ] );

        } else
            Object.keys( vals ).forEach( ( name ) => {

                const setter = setters[ name ];
                if ( setter )
                    setter( vals[ name ] );

            } );

    }

}

// export * from './renderer/webgl.js';

exports.Transform = Transform;
exports.Modal = Modal;
exports.Primatives = Primatives;
exports.OrbitCamera = OrbitCamera;
exports.CameraController = CameraController;
exports.Render = Render;
exports.ShaderUtil = ShaderUtil;
exports.Shader = Shader;
exports.GridAxisShader = GridAxisShader;
exports.createBuffersFromArrays = createBuffersFromArrays;
exports.createBufferInfoFromArrays = createBufferInfoFromArrays;
exports.createTexture = createTexture;
exports.createTextures = createTextures;
exports.createProgram = createProgram;
exports.getDefaultAttribLocation = getDefaultAttribLocation;
exports.createAttributesSetters = createAttributesSetters;
exports.setAttributes = setAttributes;
exports.createUniformSetters = createUniformSetters;
exports.setUniforms = setUniforms;
exports.meshs = meshs;
exports.textures = textures;
exports.VTX_ATTR_POSITION_NAME = VTX_ATTR_POSITION_NAME;
exports.VTX_ATTR_POSITION_LOC = VTX_ATTR_POSITION_LOC;
exports.VTX_ATTR_NORMAL_NAME = VTX_ATTR_NORMAL_NAME;
exports.VTX_ATTR_NORMAL_LOC = VTX_ATTR_NORMAL_LOC;
exports.VTX_ATTR_UV_NAME = VTX_ATTR_UV_NAME;
exports.VTX_ATTR_UV_LOC = VTX_ATTR_UV_LOC;
exports.getContextTemp = getContextTemp;
exports.clear = clear;
exports.setSize = setSize;
exports.fitSize = fitSize;
exports.createArrayBuffer = createArrayBuffer;
exports.createMeshVAO = createMeshVAO;
exports.loadTexture = loadTexture;
exports.loadCubeMap = loadCubeMap;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=czpg.js.map
