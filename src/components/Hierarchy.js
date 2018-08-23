export class Hierarchy {

    constructor() {

        this._level    = 0;
        this._parent   = null;
        this._children = [];

    }

    get level() {

        return this._level;

    }

    get parent() {

        return this._parent;

    }

    get children() {

        return this._children;

    }

    static remove( so ) {

        const soChild  = so;
        const hChild   = soChild.com.Hierarchy;
        const soParent = hChild.parent;
        const hParent  = soParent.com.Hierarchy;

        const idx = hParent.children.indexOf( soChild );
        if ( idx > - 1 )
            hParent.children.splice( idx, 1 );

        hChild._parent = null;

        return Hierarchy;

    }

    static setLevel( so, level ) {

        const hierarchy = so.com.Hierarchy;
        hierarchy._level = level;

        const childLevel = level + 1;
        hierarchy.children.forEach( ( child ) => Hierarchy.setLevel( child, childLevel ) );

        return Hierarchy;

    }

    static addChildren( parent, child ) {

        const soChild  = child;
        const hParent  = parent.com.Hierarchy;
        const hChild   = child.com.Hierarchy;

        Hierarchy.remove( soChild );
        hParent.children.push( soChild );
        hChild.setLevel( hParent.level );

        return Hierarchy;

    }

    static addToParent( child, parent ) {

        Hierarchy.addChildren( parent, child );
        return Hierarchy;

    }

}
