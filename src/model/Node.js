import { Transform } from './Transform';
import { Matrix4 } from '../math/Matrix4';

let nodeCount = 0;

function Node( name = `NODE_${nodeCount ++}` ) {

    this.children = [];
    this.parent = null;
    this.transform = new Transform();
    this._updatedThisFrame = false;
    this.afterUpdateMatrix = [];
    this.needUpdateWorldMatrix = true;
    this.name = name;

    if ( !! name && name.isCamera )
        this.setCamera( name );

}

Object.defineProperties( Node.prototype, {

    matrix: {

        get() {

            return this.transform.matrix;

        },

    },

    worldMatrix: {

        get() {

            return this.transform.worldMatrix;

        },

    },

    needUpdateWorldMatrix: {

        get() {

            return this.transform.needUpdateWorldMatrix;

        },

        set( v ) {

            this.transform.needUpdateWorldMatrix = !! v;

        },

    },

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

            return this.transform.quaternion;

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

    updatedThisFrame: {

        get() {

            return this._updatedThisFrame;

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

    updateWorldMatrix( node, parent ) {

        if ( node.needUpdateWorldMatrix )

            if ( parent ) {

                node.transform.updateMatrix();
                Matrix4.mult( node.worldMatrix.raw, parent.worldMatrix.raw, node.transform.matrix.raw );

            } else
                Matrix4.copy( node.worldMatrix.raw, node.transform.matrix.raw );

    },

    updateNormalAndDirection( node ) {

        if ( node.needUpdateWorldMatrix ) {

            node.transform.updateNormalMatrix().updateDirection();
            node.needUpdateWorldMatrix = false; // eslint-disable-line
            node._updatedThisFrame = true; // eslint-disable-line

        } else
            node._updatedThisFrame = false; // eslint-disable-line

    },

    updateMatrixMarker( node, parent ) {

        if ( node.transform._needUpdateMatrix || ( parent && parent.needUpdateWorldMatrix ) )
            node.needUpdateWorldMatrix = true; // eslint-disable-line

    },

    afterUpdateMatrix( node ) {

        for ( let i = 0; i < node.afterUpdateMatrix.length; i ++ ) {

            const { handler, trigerNodes } = node.afterUpdateMatrix[ i ];
            if ( typeof handler === 'function' && trigerNodes.filter( n => n.updatedThisFrame ).length > 0 )
                handler( node, trigerNodes );

        }

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
            this.children[ i ].traverseTwoExeFun( execuFunPre, execuFunPost );
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

    addChild( node ) {

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

    updateMatrix() {

        this.traverse( Node.updateMatrixMarker );
        this.traverseTwoExeFun( Node.updateWorldMatrix, Node.updateNormalAndDirection );
        this.traverse( Node.afterUpdateMatrix );
        return this;

    },

    findInChildren( property, value ) {

        let finded = false;

        function find( node ) {

            if ( ! finded )
                if ( node[ property ] === value )
                    finded = node;

        }

        this.traverse( find );

        return finded;

    },

} );

export { Node };
