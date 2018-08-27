import test from 'ava';
import { Euler, Matrix4, Quaternion } from '../../';

const e = new Euler();

test( 'i#clone return instance type of Euler', t => {

    const o = e.clone( e.set( 1, 2, 3 ) );
    t.true( o instanceof Euler && o !== e && o.equals( e ) );

} );

test( 'i#setFromMatrix4 return self and set the rotate info', t => {

    const out = e.setFromMatrix4( Matrix4.cache.identity() );
    t.true( out === e && e.equals( Euler.cache.set( 0, 0, 0 ) ) );

} );

test( 'i#setFromMatrix4 circle test', t => {

    const v = new Euler( Math.random(), Math.random(), Math.random() );
    const m = new Matrix4().setFromEuler( v );
    e.setFromMatrix4( m );

    t.true( e.equals( v ) );

} );

test( 'i#setFromQuaternion return self and get rotate info', t => {

    const out = e.setFromQuaternion( new Quaternion() );
    t.true( out === e && e.equals( Euler.cache.set( 0, 0, 0 ) ) );

} );

test( 'i#setFromQuaternion circle test', t => {

    const v = new Euler( Math.random(), Math.random(), Math.random() );
    const q = new Quaternion().setFromEuler( v );
    e.setFromQuaternion( q );

    t.true( e.equals( v ) );

} );
