import * as GL2 from './GL2';

export class GL2States {

    constructor( BLEND = false, CULL_FACE = true, DEPTH_TEST = true, POLYGON_OFFSET_FILL = false, SAMPLE_ALPHA_TO_COVERAGE = false,
        SAMPLE_COVERAGE = false, SCISSOR_TEST = false, STENCIL_TEST  = false, RASTERIZER_DISCARD = false,
        blendColor = [ 0, 0, 0, 0 ], blendEquationSeparate = [ GL2.FUNC_ADD, GL2.FUNC_ADD ], blendFuncSeparate = [ 1, 0, 1, 0 ],
        colorMask = [ true, true, true, true ], cullFace = [ GL2.BACK ], depthFunc = [ GL2.LESS ], depthMask = [ true ],
        depthRange = [ 0, 1 ], frontFace = [ GL2.CCW ], lineWidth = [ 1 ], polygonOffset = [ 0, 0 ]
    ) {

        // enable disable
        this.BLEND = BLEND;
        this.CULL_FACE = CULL_FACE;
        this.DEPTH_TEST = DEPTH_TEST;
        this.SCISSOR_TEST = SCISSOR_TEST;
        this.STENCIL_TEST = STENCIL_TEST;
        this.SAMPLE_COVERAGE = SAMPLE_COVERAGE;
        this.RASTERIZER_DISCARD = RASTERIZER_DISCARD;
        this.POLYGON_OFFSET_FILL = POLYGON_OFFSET_FILL;
        this.SAMPLE_ALPHA_TO_COVERAGE = SAMPLE_ALPHA_TO_COVERAGE;

        // functions
        this.cullFace = cullFace;
        this.colorMask = colorMask;
        this.frontFace = frontFace;
        this.lineWidth = lineWidth;
        this.depthFunc = depthFunc;
        this.depthMask = depthMask;
        this.depthRange = depthRange;
        this.blendColor = blendColor;
        this.polygonOffset = polygonOffset;
        this.blendFuncSeparate = blendFuncSeparate;
        this.blendEquationSeparate = blendEquationSeparate;

    }

}
