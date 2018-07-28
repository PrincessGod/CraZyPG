import { State } from './State';
import { BeginMode } from '../core/constant';

let materialId = 0;
// opts { uniformObj, drawMode=TRIANGLES, instanceCount,
// blendColor, blendEquationSeparate, blendFuncSeparate,
// colorMask, cullFace, depthFunc, depthMask, depthRange,
// frontFace, lineWidth, polygonOffset,
// ...State.opts }
function Material( ShaderType, opts ) {

    State.call( this, opts );

    const {
        uniformObj, drawMode, instanceCount,
        blendColor, blendEquationSeparate, blendFuncSeparate,
        colorMask, cullFace, depthFunc, depthMask, depthRange,
        frontFace, lineWidth, polygonOffset,
    } = opts;
    this._ShaderType = ShaderType;
    this._uniformObj = uniformObj || {};
    this.drawMode = drawMode === undefined ? BeginMode.TRIANGLES : drawMode;
    this.instanceCount = instanceCount;

    this.blendColor = blendColor || [ 0, 0, 0, 0 ];
    this.blendEquationSeparate = blendEquationSeparate || [ 32774, 32774 ]; // FUNC_ADD
    this.blendFuncSeparate = blendFuncSeparate || [ 1, 0, 1, 0 ];
    this.colorMask = colorMask || [ true, true, true, true ];
    this.cullFace = cullFace || [ 1029 ]; // BACK
    this.depthFunc = depthFunc || [ 513 ]; // LESS
    this.depthMask = depthMask || [ true ];
    this.depthRange = depthRange || [ 0, 1 ];
    this.frontFace = frontFace || [ 2305 ]; // CCW
    this.lineWidth = lineWidth || [ 1 ];
    this.polygonOffset = polygonOffset || [ 0, 0 ];

    const {
        name, version, vertexPrecision, fragmentPrecision,
    } = opts;

    this.name = name || `NO_NAME_MATERIAL${materialId}`;
    Object.defineProperty( this, 'id', { value: materialId ++, writable: false } );
    this.version = version || '300 es';
    this.vertexPrecision = vertexPrecision || 'highp';
    this.fragmentPrecision = fragmentPrecision || 'mediump';
    this.customDefine = {};

    const {
        baseColor, diffuse, alpha, fog, dither, flat,
    } = opts;
    if ( baseColor )
        this.baseColor = baseColor || [ 1, 1, 1, 1 ];
    else {

        this.diffuse = diffuse || [ 1, 1, 1 ];
        this.alpha = alpha || 1;

    }

    this.fog = fog === undefined ? true : !! fog;
    this.dither = !! dither;
    this.flat = !! flat;

}

Material.prototype = Object.assign( Object.create( State.prototype ), {

    constructor: Material,

    setUniformObj( obj ) {

        this._uniformObj = Object.assign( this._uniformObj, obj );

    },

} );

Object.defineProperties( Material.prototype, {

    ShaderType: {

        get() {

            return this._ShaderType;

        },

    },

    uniformObj: {

        get() {

            return this._uniformObj;

        },

    },

    baseColor: {

        get() {

            return this._diffuse.concat( this._alpha );

        },

        set( v ) {

            this.diffuse = v.slice( 0, 3 );
            this.alpha = v[ 3 ];

        },

    },

    diffuse: {

        get() {

            return this._diffuse;

        },

        set( v ) {

            this._diffuse = v;
            this.setUniformObj( { u_diffuse: v } );

        },

    },

    alpha: {

        get() {

            return this._alpha;

        },

        set( v ) {

            this._alpha = v;
            this.setUniformObj( { u_alpha: v } );

        },

    },

} );

export { Material };

