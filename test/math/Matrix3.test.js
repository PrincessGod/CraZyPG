import test from 'ava';
import { Matrix3, Matrix4 } from '../../';

const a = new Matrix3();
const b = new Matrix3();

test( '#constructor return identity matrix', t => {

    const m = new Matrix3();
    t.true( m.equals( a.identity() ) );

} );

test( '@cache return Matrix3', t => {

    t.true( Matrix3.cache instanceof Matrix3 );

} );

test( 'i#set return self and set values', t => {

    const o = a.set( 0, 1, 2, 3, 4, 5, 6, 7, 8 );
    t.true( o === a );
    a.raw.forEach( ( n, i ) => t.true( n === i ) );

} );

test( 'i#setFromMatrix4 return self and set values', t => {

    const m = new Matrix4(
        1, 2, 0, 0,
        0, 1, 3, 0,
        0, 4, 1, 0,
        0, 0, 0, 1
    );
    const o = a.setFromMatrix4( m );
    b.set(
        1, 2, 0,
        0, 1, 3,
        0, 4, 1,
    );
    t.true( o === a && a.equals( b ) );

} );

test( 'i#identity return self and identity matrix', t => {

    const o = a.identity();
    t.true( o === a && a.equals( new Matrix3( 1, 0, 0, 0, 1, 0, 0, 0, 1 ) ) );

} );

test( 'i#equals return true when have float value', t => {

    t.true( ( a.set( 0, 1, 2, 3, 4, 5, 6, 7, 8 )
        .equals( b.set( 0, 0.1 + 0.9, 2, 3, 4, 5, 6, 7, 8 ) ) ) );

} );

test( 'i#clone return new mat and have same value', t => {

    const o = a.set( 0, 1, 2, 3, 4, 5, 6, 7, 8 ).clone();
    t.true( o instanceof Matrix3 && o !== a && o.equals( a ) );

} );

test( 'i#copy return self and set value', t => {

    const o = a.copy( b.set( 0, 1, 2, 3, 4, 5, 6, 7, 8 ) );
    t.true( o === a && o.equals( b ) );

} );
