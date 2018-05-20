import { isTypedArray } from '../core/typedArray';

const texturesMap = new WeakMap();
const WebGLSamplerCtor = window.WebGLSampler || function NoWebGLSampler() {};
// const ctx = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ).getContext( '2d' );

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

// ArrayTexture {[ unpackAlignment=1, colorspaceConversion, premultiplyAlpha, flipY ]}
// Texture2D { src, traget, width, height, level, internalFormat, format, type }
// TextureCubeMap { ...Texture2D, faceSize }
// Texture3D { ...Texture2D, depth }
function setTextureFromArray( gl, states, gltex, texture ) {

    const {
        src, target, width, height, depth, level, internalFormat, format, type,
        faceSize,
    } = texture;

    states.savePixelStoreStates( texture );

    if ( target === gl.TEXTURE_CUBE_MAP )
        getCubeFacesWithIdx( gl, texture ).forEach( ( f ) => {

            const offset = faceSize * f.idx;
            const data = src.subarray( offset, offset + faceSize );
            gl.texImage2D( f.face, level, internalFormat, width, height, 0, format, type, data );

        } );
    else if ( target === gl.TEXTURE_3D )
        gl.texImage3D( target, level, internalFormat, width, height, depth, 0, format, type, src );
    else
        gl.texImage2D( target, level, internalFormat, width, height, 0, format, type, src );

    states.restorePixelStoreState();

}

function setTextureFiltering( gl, texture ) {

    const { target, canGenerateMipmap, canFilter } = texture;

    if ( canGenerateMipmap )
        gl.generateMipmap( target );
    else {

        const filtering = canFilter ? gl.LINEAR : gl.NEAREST;
        gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, filtering );
        gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, filtering );
        gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    }

}

function setTextureSamplers( gl, options ) {

    const { target } = options;

    if ( options.minMag ) {

        gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, options.minMag );
        gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, options.minMag );

    }

    if ( options.min )
        gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, options.min );

    if ( options.mag )
        gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, options.mag );

    if ( options.wrap ) {

        gl.texParameteri( target, gl.TEXTURE_WRAP_S, options.wrap );
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, options.wrap );
        if ( target === gl.TEXTURE_3D || target instanceof WebGLSamplerCtor )
            gl.texParameteri( target, gl.TEXTURE_WRAP_R, options.wrap );

    }

    if ( options.wrapR )
        gl.texParameteri( target, gl.TEXTURE_WRAP_R, options.wrapR );

    if ( options.wrapS )
        gl.texParameteri( target, gl.TEXTURE_WRAP_S, options.wrapS );

    if ( options.wrapT )
        gl.texParameteri( target, gl.TEXTURE_WRAP_T, options.wrapT );

    if ( options.minLod )
        gl.texParameteri( target, gl.TEXTURE_MIN_LOD, options.minLod );

    if ( options.maxLod )
        gl.texParameteri( target, gl.TEXTURE_MAX_LOD, options.maxLod );

    if ( options.baseLevel )
        gl.texParameteri( target, gl.TEXTURE_BASE_LEVEL, options.baseLevel );

    if ( options.maxLevel )
        gl.texParameteri( target, gl.TEXTURE_MAX_LEVEL, options.maxLevel );

}

// Texture { autoFiltering, canGenerateMipmap, canFilter,
// [ minMag, min=gl.NEAREST_MIPMAP_LINEAR, mag=gl.LINEAR, wrap, wrapR, wrapS, wrapT, minLod, maxLod, baseLevel, maxLevel ]
// }
function createTexture( gl, states, texture ) {

    const gltex = gl.createTexture();
    const { src, target, autoFiltering } = texture;

    gl.bindTexture( target, gltex );
    if ( isTypedArray( src ) )
        setTextureFromArray( gl, states, gltex, texture );

    if ( autoFiltering )
        setTextureFiltering( gl, texture );
    setTextureSamplers( gl, texture );

    return {
        texture: gltex,
    };

}

function Textures( gl, states ) {

    this._gl = gl;
    this._states = states;

}

Object.assign( Textures.prototype, {

    get( texture ) {

        return texturesMap.get( texture );

    },

    remove( texture ) {

        if ( texturesMap.has( texture ) ) {

            const value = texturesMap.get( texture );

            this._gl.deleteTexture( value.texture );
            texturesMap.delete( texture );

        }

    },

    update( texture ) {

        const value = texturesMap.get( texture );

        if ( value === undefined )
            texturesMap.set( texture, createTexture( this._gl, this._states, texture ) );

    },

} );

export { Textures };
