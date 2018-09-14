export class Material {

    constructor( vertexShader, fragmentShader, opts = {} ) {

        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;

        const {
            useLight, validateProgram, vertexShaderPrecision, fragmentShaderPrecision,
            uniformObj, instanceCount, blend, cull, depth, polygon, sampleBlend, blendColor,
            colorMask, blendEquationSeparate, blendFuncSeparate, depthFunc, depthMask,
            depthRange, cullFace, frontFace, lineWidth, polygonOffset,
        } = opts;

        this.useLight = useLight;
        this.validateProgram = validateProgram;
        this.vertexShaderPrecision = vertexShaderPrecision;
        this.fragmentShaderPrecision = fragmentShaderPrecision;

        this.uniformObj = uniformObj;

        this.instanceCount = instanceCount;

        this.cull = cull;
        this.blend = blend;
        this.depth = depth;
        this.polygon = polygon;
        this.sampleBlend = sampleBlend;

        this.cullFace = cullFace;
        this.colorMask = colorMask;
        this.depthFunc = depthFunc;
        this.depthMask = depthMask;
        this.frontFace = frontFace;
        this.lineWidth = lineWidth;
        this.depthRange = depthRange;
        this.blendColor = blendColor;
        this.polygonOffset = polygonOffset;
        this.blendFuncSeparate = blendFuncSeparate;
        this.blendEquationSeparate = blendEquationSeparate;

    }

}
