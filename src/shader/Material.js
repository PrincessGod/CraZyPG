import { State } from './State';
import { BeginMode } from '../core/constant';

// opts { uniformObj, drawMode=TRIANGLES, instanceCount, ...State.opts }
function Material( ShaderType, opts ) {

    State.call( this, opts );

    const { uniformObj, drawMode, instanceCount } = opts;
    this._ShaderType = ShaderType;
    this._uniformObj = uniformObj || {};
    this.drawMode = drawMode === undefined ? BeginMode.TRIANGLES : drawMode;
    this.instanceCount = instanceCount;

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

