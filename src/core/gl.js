/* eslint prefer-destructuring: 0 */
import * as Locations from './constant';
import { meshs, textures } from './properties';

let gl; // eslint-disable-line
export function getContext( canvasId ) {

    const canvas = document.getElementById( canvasId );
    gl = canvas.getContext( 'webgl2', { antialias: true } );
    if ( ! gl ) {

        console.error( 'Please use a decent browser, this browser not support Webgl2Context.' );
        return null;

    }

    gl.cullFace( gl.BACK );
    gl.frontFace( gl.CCW );
    gl.enable( gl.CULL_FACE );
    gl.enable( gl.DEPTH_TEST );
    gl.depthFunc( gl.LEQUAL );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    return this;

}

export function clear() {

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    return this;

}

export function setSize( width, height, mutiplier ) {

    let muti = mutiplier || 1.0;
    muti = Math.max( 0, muti );
    gl.canvas.style.width = width;
    gl.canvas.style.height = height;
    gl.canvas.width = gl.canvas.clientWidth * muti;
    gl.canvas.height = gl.canvas.clientHeight * muti;
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
    return this;

}

export function fitSize() {

    if ( gl.canvas.width !== gl.canvas.clientWidth ||
        gl.canvas.height !== gl.canvas.clientHeight ) {

        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;
        gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );

    }
    return this;

}

export function createArrayBuffer( array, isStatic = true ) {

    const buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, array, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    return buffer;

}

export function createMeshVAO( name, indexArray, vtxArray, normalArray, uvArray, vtxLength ) {

    const mesh = { drawMode: gl.TRIANGLES };

    mesh.vao = gl.createVertexArray();
    gl.bindVertexArray( mesh.vao );

    if ( indexArray !== undefined && indexArray !== null ) {

        mesh.indexBuffer = gl.createBuffer();
        mesh.indexCount = indexArray.length;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indexArray ), gl.STATIC_DRAW );
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }

    if ( vtxArray !== undefined && vtxArray !== null ) {

        mesh.vtxBuffer = gl.createBuffer();
        mesh.vtxComponents = vtxLength || 3;
        mesh.vtxCount = vtxArray.length / mesh.vtxComponents;

        gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vtxBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vtxArray ), gl.STATIC_DRAW );
        gl.enableVertexAttribArray( Locations.VTX_ATTR_POSITION_LOC );
        gl.vertexAttribPointer(Locations.VTX_ATTR_POSITION_LOC, mesh.vtxComponents, gl.FLOAT, false, 0, 0); // eslint-disable-line

    }

    if ( normalArray !== undefined && normalArray !== null ) {

        mesh.normalBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, mesh.normalBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( normalArray ), gl.STATIC_DRAW );
        gl.enableVertexAttribArray( Locations.VTX_ATTR_NORMAL_LOC );
        gl.vertexAttribPointer( Locations.VTX_ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0 );

    }

    if ( uvArray !== undefined && uvArray !== null ) {

        mesh.uvBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, mesh.uvBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( uvArray ), gl.STATIC_DRAW );
        gl.enableVertexAttribArray( Locations.VTX_ATTR_UV_LOC );
        gl.vertexAttribPointer( Locations.VTX_ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0 );

    }

    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    gl.bindVertexArray( null );

    meshs[ name ] = mesh;
    return mesh;

}

export function loadTexture( name, img, flipY = false ) {

    const tex = gl.createTexture();
    if ( flipY ) gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );

    gl.bindTexture( gl.TEXTURE_2D, tex );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.bindTexture( gl.TEXTURE_2D, null );

    textures[ name ] = tex;
    if ( flipY ) gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false );

    return tex;

}

export function loadCubeMap( name, imgAry ) {

    if ( imgAry.length !== 6 ) return null;

    const tex = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_CUBE_MAP, tex );

    for ( let i = 0; i < 6; i ++ )
        gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgAry[ i ] ); // eslint-disable-line

    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE );

    gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );
    textures[ name ] = tex;
    return tex;

}

export { gl };
