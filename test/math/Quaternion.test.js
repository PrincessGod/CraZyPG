import test from 'ava';
import { Quaternion, Euler, Matrix4 } from '../../';

const a = new Quaternion();
const b = new Quaternion();

test( '#constructor default w is 1', t => {

    t.true( a.w === 1 );

} );

test( 'i#setFromEuler return default quaternion', t => {

    a.setFromEuler( new Euler() );
    t.true( a.equals( b.set( 0, 0, 0, 1 ) ) );

} );

test( 'i#setFromEuler circle test', t => {

    const e = new Euler( Math.random(), Math.random(), Math.random() );
    a.setFromEuler( e );
    const o = new Euler().setFromQuaternion( a );
    b.setFromEuler( o );
    t.true( e.equals( o ) && a.equals( b ) );

} );

test( 'i#setFromMatrix4 return default quaternion', t => {

    a.setFromMatrix4( new Matrix4() );
    t.true( a.equals( b.set( 0, 0, 0, 1 ) ) );

} );

test( 'i#setFromMatrix4 circle test', t => {

    const e = new Euler( Math.random(), Math.random(), Math.random() );
    b.setFromEuler( e );
    const m = new Matrix4().setFromQuat( b );
    a.setFromMatrix4( m );
    t.true( a.equals( b ) );

} );

test( 'i#clone return instance type of Quaternion', t => {

    const o = a.clone( a.set( 1, 2, 3, 4 ) );
    t.true( o instanceof Quaternion && o !== a && o.equals( a ) );

} );

test.todo( 'i#slerp do not how to test' );
