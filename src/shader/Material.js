import { State } from './State';
import { BeginMode } from '../core/constant';

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

}

Material.prototype = Object.assign( Object.create( State.prototype ), {

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

} );

export { Material };

