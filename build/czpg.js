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
function getContext( canvasId ) {

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

/* eslint-disable */
class Vector3{
    constructor(x,y,z){	this.x = x || 0.0;	this.y = y || 0.0;	this.z = z || 0.0; }

    magnitude(v){
        //Only get the magnitude of this vector
        if(v === undefined) return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );

        //Get magnitude based on another vector
        var x = v.x - this.x,
            y = v.y - this.y,
            z = v.y - this.z;

        return Math.sqrt( x*x + y*y + z*z );
    }

    normalize(){ var mag = this.magnitude(); this.x /= mag; this.y /= mag; this.z /= mag; return this;}

    set(x,y,z){ this.x = x; this.y = y; this.z = z;	return this; }

    multiScalar(v){ this.x *= v; this.y *= v; this.z *= v; return this; }

    getArray(){ return [this.x,this.y,this.z]; }
    getFloatArray(){ return new Float32Array([this.x,this.y,this.z]);}
    clone(){ return new Vector3(this.x,this.y,this.z); }
}


//###########################################################################################
class Matrix4{
    constructor(){ this.raw = Matrix4.identity(); }

    //....................................................................
    //Transformations Methods
    vtranslate(v){		Matrix4.translate(this.raw,v.x,v.y,v.z); return this; }
    translate(x,y,z){	Matrix4.translate(this.raw,x,y,z); return this;}

    rotateY(rad){		Matrix4.rotateY(this.raw,rad); return this; }
    rotateX(rad){		Matrix4.rotateX(this.raw,rad); return this; }
    rotateZ(rad){		Matrix4.rotateZ(this.raw,rad); return this; }
	
    vscale(vec3){		Matrix4.scale(this.raw,vec3.x,vec3.y,vec3.z); return this; }
    scale(x,y,z){		Matrix4.scale(this.raw,x,y,z); return this; }
	
    invert(){			Matrix4.invert(this.raw); return this; }

    //....................................................................
    //Methods
    //Bring is back to identity without changing the transform values.
    resetRotation(){	
        for(var i=0; i < this.raw.length; i++){
            if(i >= 12 && i <= 14) continue;
            this.raw[i] = (i % 5 == 0)? 1 : 0;  //only positions 0,5,10,15 need to be 1 else 0.
        }

        return this;
    }

    //reset data back to identity.
    reset(){ 
        for(var i=0; i < this.raw.length; i++) this.raw[i] = (i % 5 == 0)? 1 : 0; //only positions 0,5,10,15 need to be 1 else 0.
        return this;
    }

    //....................................................................
    //Static Data Methods
    static identity(){
        var a = new Float32Array(16);
        a[0] = a[5] = a[10] = a[15] = 1;
        return a;
    }

    //from glMatrix
    static perspective(out, fovy, aspect, near, far){
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
    }


    static ortho(out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
    }


    //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js
    //make the rows into the columns
    static transpose(out, a){
        //If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
            out[1] = a[4];
            out[2] = a[8];
            out[3] = a[12];
            out[4] = a01;
            out[6] = a[9];
            out[7] = a[13];
            out[8] = a02;
            out[9] = a12;
            out[11] = a[14];
            out[12] = a03;
            out[13] = a13;
            out[14] = a23;
        }else{
            out[0] = a[0];
            out[1] = a[4];
            out[2] = a[8];
            out[3] = a[12];
            out[4] = a[1];
            out[5] = a[5];
            out[6] = a[9];
            out[7] = a[13];
            out[8] = a[2];
            out[9] = a[6];
            out[10] = a[10];
            out[11] = a[14];
            out[12] = a[3];
            out[13] = a[7];
            out[14] = a[11];
            out[15] = a[15];
        }

        return out;
    }

    //Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
    static normalMat3(out,a){
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return null;

        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        return out;
    }

    //....................................................................
    //Static Operation

    //https://github.com/gregtatum/mdn-model-view-projection/blob/master/shared/matrices.js
    static multiplyVector(mat4, v) {
        var x = v[0], y = v[1], z = v[2], w = v[3];
        var c1r1 = mat4[ 0], c2r1 = mat4[ 1], c3r1 = mat4[ 2], c4r1 = mat4[ 3],
            c1r2 = mat4[ 4], c2r2 = mat4[ 5], c3r2 = mat4[ 6], c4r2 = mat4[ 7],
            c1r3 = mat4[ 8], c2r3 = mat4[ 9], c3r3 = mat4[10], c4r3 = mat4[11],
            c1r4 = mat4[12], c2r4 = mat4[13], c3r4 = mat4[14], c4r4 = mat4[15];

        return [
            x*c1r1 + y*c1r2 + z*c1r3 + w*c1r4,
            x*c2r1 + y*c2r2 + z*c2r3 + w*c2r4,
            x*c3r1 + y*c3r2 + z*c3r3 + w*c3r4,
            x*c4r1 + y*c4r2 + z*c4r3 + w*c4r4
        ];
    }

    //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/vec4.js, vec4.transformMat4
    static transformVec4(out, v, m){
        out[0] = m[0] * v[0] + m[4] * v[1] + m[8]	* v[2] + m[12] * v[3];
        out[1] = m[1] * v[0] + m[5] * v[1] + m[9]	* v[2] + m[13] * v[3];
        out[2] = m[2] * v[0] + m[6] * v[1] + m[10]	* v[2] + m[14] * v[3];
        out[3] = m[3] * v[0] + m[7] * v[1] + m[11]	* v[2] + m[15] * v[3];
        return out;
    }

    //From glMatrix
    //Multiple two mat4 together
    static mult(out, a, b){ 
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        // Cache only the current line of the second matrix
        var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        return out;	
    }


    //....................................................................
    //Static Transformation
    static scale(out,x,y,z){
        out[0] *= x;
        out[1] *= x;
        out[2] *= x;
        out[3] *= x;
        out[4] *= y;
        out[5] *= y;
        out[6] *= y;
        out[7] *= y;
        out[8] *= z;
        out[9] *= z;
        out[10] *= z;
        out[11] *= z;
        return out;
    }

    static rotateY(out,rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = out[0],
            a01 = out[1],
            a02 = out[2],
            a03 = out[3],
            a20 = out[8],
            a21 = out[9],
            a22 = out[10],
            a23 = out[11];

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
    }

    static rotateX(out,rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = out[4],
            a11 = out[5],
            a12 = out[6],
            a13 = out[7],
            a20 = out[8],
            a21 = out[9],
            a22 = out[10],
            a23 = out[11];

        // Perform axis-specific matrix multiplication
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
    }

    static rotateZ(out,rad){
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = out[0],
            a01 = out[1],
            a02 = out[2],
            a03 = out[3],
            a10 = out[4],
            a11 = out[5],
            a12 = out[6],
            a13 = out[7];

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
    }

    static rotate(out, rad, axis){
        var x = axis[0], y = axis[1], z = axis[2],
            len = Math.sqrt(x * x + y * y + z * z),
            s, c, t,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;

        if (Math.abs(len) < 0.000001) { return null; }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = out[0]; a01 = out[1]; a02 = out[2]; a03 = out[3];
        a10 = out[4]; a11 = out[5]; a12 = out[6]; a13 = out[7];
        a20 = out[8]; a21 = out[9]; a22 = out[10]; a23 = out[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    }

    static invert(out,mat) {
        if(mat === undefined) mat = out; //If input isn't sent, then output is also input

        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
            a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
            a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return false;
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return true;
    }

    //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js  mat4.scalar.translate = function (out, a, v) {
    static translate(out,x,y,z){
        out[12] = out[0] * x + out[4] * y + out[8]	* z + out[12];
        out[13] = out[1] * x + out[5] * y + out[9]	* z + out[13];
        out[14] = out[2] * x + out[6] * y + out[10]	* z + out[14];
        out[15] = out[3] * x + out[7] * y + out[11]	* z + out[15];
    }
}

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
            .vtranslate( this.position )
            .rotateZ( this.rotation.z * Transform.deg2Rad )
            .rotateX( this.rotation.x * Transform.deg2Rad )
            .rotateY( this.rotation.y * Transform.deg2Rad )
            .vscale( this.scale );

        Matrix4.normalMat3( this.matNormal, this.matLocal.raw );

        Matrix4.transformVec4( this.forward, [ 0, 0, 1, 0 ], this.matLocal.raw );
        Matrix4.transformVec4( this.up, [ 0, 1, 0, 0 ], this.matLocal.raw );
        Matrix4.transformVec4( this.right, [ 1, 0, 0, 0 ], this.matLocal.raw );

        return this.matLocal.raw;

    }

    updateDirection() {

        Matrix4.transformVec4( this.forward, [ 0, 0, 1, 0 ], this.matLocal.raw );
        Matrix4.transformVec4( this.up, [ 0, 1, 0, 0 ], this.matLocal.raw );
        Matrix4.transformVec4( this.right, [ 1, 0, 0, 0 ], this.matLocal.raw );
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
                .vtranslate( this.transform.position )
                .rotateY( this.transform.rotation.y * Transform.deg2Rad )
                .rotateX( this.transform.rotation.x * Transform.deg2Rad );
        else
            this.transform.matLocal.reset()
                .rotateY( this.transform.rotation.y * Transform.deg2Rad )
                .rotateX( this.transform.rotation.x * Transform.deg2Rad )
                .vtranslate( this.transform.position );


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

exports.Transform = Transform;
exports.Modal = Modal;
exports.Primatives = Primatives;
exports.OrbitCamera = OrbitCamera;
exports.CameraController = CameraController;
exports.Render = Render;
exports.ShaderUtil = ShaderUtil;
exports.Shader = Shader;
exports.GridAxisShader = GridAxisShader;
exports.meshs = meshs;
exports.textures = textures;
exports.VTX_ATTR_POSITION_NAME = VTX_ATTR_POSITION_NAME;
exports.VTX_ATTR_POSITION_LOC = VTX_ATTR_POSITION_LOC;
exports.VTX_ATTR_NORMAL_NAME = VTX_ATTR_NORMAL_NAME;
exports.VTX_ATTR_NORMAL_LOC = VTX_ATTR_NORMAL_LOC;
exports.VTX_ATTR_UV_NAME = VTX_ATTR_UV_NAME;
exports.VTX_ATTR_UV_LOC = VTX_ATTR_UV_LOC;
exports.getContext = getContext;
exports.clear = clear;
exports.setSize = setSize;
exports.fitSize = fitSize;
exports.createArrayBuffer = createArrayBuffer;
exports.createMeshVAO = createMeshVAO;
exports.loadTexture = loadTexture;
exports.loadCubeMap = loadCubeMap;
exports.Vector3 = Vector3;
exports.Matrix4 = Matrix4;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=czpg.js.map
