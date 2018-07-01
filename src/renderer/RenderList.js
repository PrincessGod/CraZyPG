function sortByIdAscending( a, b ) {

    if ( a.programInfo.id !== b.programInfo.id )
        return a.programInfo.id - b.programInfo.id;
    else if ( a.material.id !== b.material.id )
        return a.material.id - b.material.id;
    else if ( a.primitive.id !== b.primitive.id )
        return a.primitive.id - b.primitive.id;
    return a.id - b.id;

}

function RenderList() {

    this.opqueList = [];
    this.transparentList = [];

}

Object.assign( RenderList.prototype, {

    clear() {

        this.opqueList = [];
        this.transparentList = [];

        return this;

    },

    add( target ) {

        if ( target.transparent )
            this.transparentList.push( target );
        else
            this.opqueList.push( target );

        return this;

    },

    sort() {

        this.opqueList.sort( sortByIdAscending );

    },

} );

export { RenderList };
