function State( opts = {} ) {

    const {
        blend, cullFace, depth, polygonOffset, sampleBlend,
    } = opts;

    this.blend = !! blend;
    this.cullFace = !! cullFace;
    this.depth = !! depth;
    this.polygonOffset = !! polygonOffset;
    this.sampleBlend = !! sampleBlend;

}

export { State };
