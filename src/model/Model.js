import { Node } from '../object/Node';
import { ShaderParams } from '../core/constant';

let modelId = 0;

// opts { name }
export class Model extends Node {

    constructor( primitive, material, opts = {} ) {

        super( primitive.name || opts.name || `NO_NAME_MODEL${modelId}` );
        this.material = material;
        this.primitive = primitive;
        this._innerUniformObj = {};
        this._innerUniformObj[ ShaderParams.UNIFORM_Model_MAT_NAME ] = this.worldMatrix.raw;
        this._innerUniformObj[ ShaderParams.UNIFORM_NORMAL_MAT_NAME ] = this.normMat;

    }

    get uniformObj() {

        return this._innerUniformObj;

    }

}
