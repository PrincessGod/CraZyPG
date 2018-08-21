import { Transform } from '../math/Transform';
import { Matrix4 } from '../math/Matrix4';

let nodeCount = 0;

export class Node extends Transform {

    constructor( name = `NODE_${nodeCount ++}` ) {

        super();

        this.name = name;
        this.parent = null;
        this.children = [];
        this.afterUpdateMatrix = [];
        this.needUpdateWorldMatrix = true;

    }

    static addChild( node, n ) {

        node.children.push( n.remove() );
        n.parent = node;

        return node;

    }

    addChild( n ) {

        return Node.addChild( this, n );

    }

    static addToParent( node, p ) {

        node.remove();
        p.children.push( node );
        node.parent = p;

        return node;

    }

    addToParent( p ) {

        return Node.addToParent( this, p );

    }

    static remove( node ) {

        if ( node.parent ) {

            const idx = node.parent.children.indexOf( node );

            if ( idx > - 1 )
                node.parent.children.splice( idx, 1 );

            node.parent = null; // eslint-disable-line

        }

        return node;

    }

    remove() {

        return Node.remove( this );

    }

    static updateWorldMatrix( node ) {

        const parent = node.parent;
        if ( node.needUpdateWorldMatrix )
            if ( parent ) {

                node.updateMatrix();
                Matrix4.mult( node.worldMatrix, parent.worldMatrix, node.matrix );

            } else
                Matrix4.copy( node.worldMatrix, node.matrix );

        return node;

    }

    static updateNormalAndDirection( node ) {

        if ( node.needUpdateWorldMatrix )
            node.updateNormalMatrix().updateDirection();

        return node;

    }

    static updateMatrixMarker( node ) {

        const parent = node.parent;
        if ( node._needUpdateMatrix || ( parent && parent.needUpdateWorldMatrix ) )
            node.needUpdateWorldMatrix = true; // eslint-disable-line

        return node;

    }

    static afterUpdateMatrix( node ) {

        node.needUpdateWorldMatrix = false;

        return node;

    }

    static traverse( node, executeFun ) {

        executeFun( node );
        for ( let i = 0; i < node.children.length; i ++ )
            Node.traverse( node.children[ i ], executeFun );

        return node;

    }

    traverse( executeFun ) {

        return Node.traverse( this, executeFun );

    }

    static traversePostOrder( node, executeFun ) {

        for ( let i = 0; i < node.children.length; i ++ )
            Node.traversePostOrder( node.children[ i ], executeFun );
        executeFun( node );

        return node;

    }

    traversePostOrder( executeFun ) {

        return Node.traversePostOrder( this, executeFun );

    }

    static traverseTwoExeFun( node, execuFunPre, execuFunPost ) {

        execuFunPre( node );
        for ( let i = 0; i < node.children.length; i ++ )
            Node.traverseTwoExeFun( node.children[ i ], execuFunPre, execuFunPost );
        execuFunPost( node );

        return node;

    }

    traverseTwoExeFun( execuFunPre, execuFunPost ) {

        return Node.traverseTwoExeFun( this, execuFunPre, execuFunPost );

    }

    updateWorldMatrix() {

        Node.traverse( this, Node.updateMatrixMarker );
        Node.traverseTwoExeFun( this, Node.updateWorldMatrix, Node.updateNormalAndDirection );
        Node.traverse( this, Node.afterUpdateMatrix );
        return this;

    }

    static findInChildren( node, property, value ) {

        let finded = false;

        function find( node ) {

            if ( ! finded )
                if ( node[ property ] === value )
                    finded = node;

        }

        Node.traverse( node, find );

        return finded;

    }

    findInChildren( property, value ) {

        return Node.findInChildren( this, property, value );

    }

}
