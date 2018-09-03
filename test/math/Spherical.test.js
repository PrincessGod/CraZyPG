import test from 'ava';
import { Spherical, Vector3 } from '../../';

const a = new Spherical();
const b = new Spherical();

test( '#constructor default radius is 1', t => {

    const s = new Spherical();
    t.true( s.radius === 1 && s.phi === 0 && s.theta === 0 );

} );

test( '#constructor set values', t => {

    const s = new Spherical( 3, 1, 2 );
    t.true( s.radius === 3 && s.phi === 1 && s.theta === 2 );

} );

test( 'i@radius&phi&theta getter and setter', t => {

    a.radius = 1;
    a.phi = 2;
    a.theta = 3;
    t.true( a.equals( b.set( 1, 2, 3 ) ) );

} );

test( '@cache return Spherical', t => {

    t.true( Spherical.cache instanceof Spherical );

} );

test( 'i#setFromVector3 return self and right value', t => {

    const v = new Vector3( 0, 0, 1 );
    const o = a.setFromVector3( v );
    t.true( o === a && a.equals( b.set( 1, Math.PI / 2, 0 ) ) );

} );

test( 'i#setFromVector3 when v.length() === 0', t => {

    const v = new Vector3( 0, 0, 0 );
    a.setFromVector3( v );
    t.true( a.equals( b.set( 0, 0, 0 ) ) );

} );

test( 'i#clone return new object have same value', t => {

    const o = a.set( 1, 2, 3 ).clone();
    t.true( o !== a && o.equals( a ) && o instanceof Spherical );

} );

test( 'i#makeSafe return self and makesure not have edge value', t => {

    const o = a.set( 1, Math.PI, 0 ).makeSafe();
    b.set( 1, 0, 0 ).makeSafe();
    t.true( o === a && a.phi !== Math.PI && b.phi !== 0 );

} );
