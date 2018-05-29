
const vaosMap = new WeakMap();

function createVao( gl, programs, programInfo ) {

    const vao = gl.createVertexArray();
    gl.bindVertexArray( vao );
    programInfo.updateInfo.attrib = true; // eslint-disable-line
    programs.update( programInfo );
    gl.bindBuffer( this._gl.ARRAY_BUFFER, null );
    gl.bindVertexArray( null );

    return vao;

}

function VertexArrays( gl, programs ) {

    this._gl = gl;
    this._programs = programs;

}

Object.assign( VertexArrays.prototype, {

    get( programInfo ) {

        return vaosMap.get( programInfo );

    },

    remove( programInfo ) {

        if ( vaosMap.has( programInfo ) ) {

            const vao = vaosMap.get( programInfo );
            this._gl.deleteVertexArray( vao );
            vaosMap.delete( programInfo );

        }

    },

    update( programInfo ) {

        const vao = vaosMap.get( programInfo );

        if ( vao )
            this.remove( programInfo );

        vaosMap.set( programInfo, createVao( this._gl, this._programs, programInfo ) );

    },

} );

export { VertexArrays };
