function State( opts = {} ) {

    const {
        blend, cull, depth, polygon, sampleBlend,
    } = opts;

    this.blend = !! blend;
    this.cull = !! cull;
    this.depth = !! depth;
    this.polygon = !! polygon;
    this.sampleBlend = !! sampleBlend;

}

export { State };
