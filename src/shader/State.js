function State( opts = {} ) {

    const {
        blend, cull, depth, polygon, sampleBlend,
    } = opts;

    this.blend = !! blend;
    this.cull = cull === undefined ? true : !! cull;
    this.depth = depth === undefined ? true : !! depth;
    this.polygon = !! polygon;
    this.sampleBlend = !! sampleBlend;

}

export { State };
