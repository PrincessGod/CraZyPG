import { Transform } from '../model/Transform';

let nodeCount = 0;

function Node( nameModel ) {

    if ( typeof nameModel === 'string' )
        this.name = nameModel;
    else if ( !! nameModel && nameModel.isModel ) {

        this.model = nameModel;
        this.name = this.model.name;
        nameModel.node = this; // eslint-disable-line

    } else
        this.name = `NODE_${nodeCount ++}`;

    this.children = [];
    this.parent = null;
    this.transform = this.moedel ? this.model.transform : new Transform();

}

Object.defineProperties( Node.prototype, {

    position: {

        get() {

            return this.transform.position;

        },

        set( v ) {

            this.setPosition( v );

        },

    },

    quaternion: {

        get() {

            return this.transform.position;

        },

        set( v ) {

            this.setQuaternion( v );

        },

    },

    scale: {

        get() {

            return this.transform.scale;

        },

        set( v ) {

            return this.setScale( v );

        },

    },

    matrix: {

        get() {

            return this.transform.matrix.raw;

        },

    },

} );

Object.assign( Node, {

    remove( node ) {

        if ( node.parent ) {

            const idx = node.parent.children.indexOf( node );

            if ( idx > - 1 )
                node.parent.children.splice( idx, 1 );

            node.parent = null; // eslint-disable-line

        } else
            node = undefined; // eslint-disable-line

    },

} );

Object.assign( Node.prototype, {

    traverse( executeFun ) {

        executeFun( this, this.parent );
        for ( let i = 0; i < this.children.length; i ++ )
            this.children[ i ].traverse( executeFun );

    },

    traversePostOrder( executeFun ) {

        for ( let i = 0; i < this.children.length; i ++ )
            this.children[ i ].traversePostOrder( executeFun );
        executeFun( this, this.parent );

    },

    traverseTwoExeFun( execuFunPre, execuFunPost ) {

        execuFunPre( this, this.parent );
        for ( let i = 0; i < this.children.length; i ++ )
            this.traverseTwoExeFun( execuFunPre, execuFunPost );
        execuFunPost( this, this.parent );

    },

    remove( node = this ) {

        Node.remove( node );
        return this;

    },

    addToParent( parent ) {

        if ( this.parent )
            Node.remove( this );

        parent.children.push( this );
        node.parent = this; // eslint-disable-line

        return this;

    },

    addChild( nodelike ) {

        let node = nodelike;
        if ( typeof nodelike === 'string' || nodelike.isModel )
            node = new Node( nodelike );

        if ( node.parent )
            Node.remove( node );

        this.children.push( node );
        node.parent = this; // eslint-disable-line

        return this;

    },

    setPosition( ...args ) {

        if ( args[ 0 ] instanceof Node )
            return this.setPosition( ...args[ 0 ].position );

        this.transform.setPosition( ...args );
        return this;

    },

    setQuaternion( ...args ) {

        if ( args[ 0 ] instanceof Node )
            return this.setQuaternion( ...args[ 0 ].quaternion );

        this.transform.setQuaternion( ...args );
        return this;

    },

    setScale( ...args ) {

        if ( args[ 0 ] instanceof Node )
            return this.setScale( ...args[ 0 ].scale );

        this.transform.setScale( ...args );
        return this;

    },

} );

export { Node };
