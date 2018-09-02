import test from 'ava';
import { Hierarchy, SceneObject } from '../../';

const so1 = new SceneObject();
const so2 = new SceneObject();
const p = so1.addComponent( Hierarchy );
const c = so2.addComponent( Hierarchy );

test( 'i@level&parent&children default vaule', t =>{

    t.true( p.level === 0 && p.parent === null && Array.isArray( p.children ) && p.children.length === 0 );

} );

test( '#remove remove children from parent', t => {

    const o = Hierarchy.addChildren( so1, so2 ).remove( so2 );
    t.true( o === Hierarchy && p.children.length === 0 && p.level === 0 && p.parent === null &&
        c.children.length === 0 && c.level === 0 && c.parent === null );

} );

test( '#setLevel returen Hierarchy and set levle to all children', t => {

    const o = Hierarchy.addChildren( so1, so2 ).setLevel( so1, 1 );
    t.true( o === Hierarchy &&  p.level === 1 && c.level === 2 );

} );

test( '#addChildren return Hierarchy and set children', t => {

    const o = Hierarchy.addChildren( so1, so2 ).addChildren( so1, so2 );
    t.true( o === Hierarchy && p.parent === null && p.children.length === 1 && p.children[ 0 ] === so2 &&
        c.parent === so1 && c.level === p.level + 1 && c.children.length === 0 );

} );
