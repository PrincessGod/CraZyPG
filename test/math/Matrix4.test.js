import test from 'ava';
import { Matrix4, Quaternion, Vector3, Matrix3 } from '../../';

const a = new Matrix4();
const b = new Matrix4();
const n = new Matrix4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);

test( '#constructor return identity mat4', t => {

    const m = new Matrix4();
    t.true( m.equals( n ) );

} );

test( 'i#identity return self and identity mat4', t => {

    const o = a.identity();
    t.true( o === a && a.equals( n ) );

} );

test( 'i#set return self and set value', t => {

    const o = a.set(
        1, 0, 1, 0,
        0, 1, 0, 1,
        0, 0, 1, 0,
        0, 1, 0, 1
    );
    const r = new Matrix4(
        1, 0, 1, 0,
        0, 1, 0, 1,
        0, 0, 1, 0,
        0, 1, 0, 1
    );
    t.true( o === a && o.equals( r ) );

} );

test( 'i#setFromQuat return self and normal mat4', t => {

    const o = a.setFromQuat( new Quaternion() );
    t.true( o === a && a.equals( b.identity() ) );

} );

test( 'i#setFromTRS return self and right value', t => {

    const o = a.setFromTRS( new Vector3(), new Quaternion(), new Vector3( 1, 1, 1 ) );
    t.true( o === a && a.equals( b.identity() ) );

} );

test( 'i#invert return self and set value', t => {

    const o = a.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 2, 3, 1
    ).invert();
    b.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        - 1, - 2, - 3, 1
    );
    t.true( o === a && a.equals( b ) );

} );

test( 'i#mult return self and set value', t => {

    a.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 2, 3, 1
    );
    b.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        4, 5, 6, 1
    );
    const o = a.mult( b );
    const r = new Matrix4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        5, 7, 9, 1
    );
    t.true( o === a && a.equals( r ) );

} );

test( 'i#perspective return self and set value', t => {

    const o = a.perspective( Math.PI / 2, 1, 0, 1 );
    b.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, - 1, - 1,
        0, 0, 0, 0
    );
    t.true( o === a && a.equals( b ) );

} );

test( 'i#perspective with near and far', t => {

    a.perspective( 45 * Math.PI / 180.0, 640 / 480, 0.1, 200 );
    b.set(
        1.81066, 0, 0, 0,
        0, 2.414213, 0, 0,
        0, 0, - 1.001, - 1,
        0, 0, - 0.2001, 0
    );
    t.true( a.equals( b ) );

} );

test( 'i#perspective with no far', t => {

    a.perspective( 45 * Math.PI / 180.0, 640 / 480, 0.1 );
    b.set(
        1.81066, 0, 0, 0,
        0, 2.414213, 0, 0,
        0, 0, - 1, - 1,
        0, 0, - 0.2, 0
    );
    t.true( a.equals( b ) );

} );

test( 'i#perspective with Infinity far', t => {

    a.perspective( 45 * Math.PI / 180.0, 640 / 480, 0.1, Infinity );
    b.set(
        1.81066, 0, 0, 0,
        0, 2.414213, 0, 0,
        0, 0, - 1, - 1,
        0, 0, - 0.2, 0
    );
    t.true( a.equals( b ) );

} );

test( 'i#orthographic return self and set value', t => {

    const o = a.orthographic( - 1, 1, - 1, 1, - 1, 1 );
    b.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, - 1, 0,
        0, 0, 0, 1
    );
    t.true( o === a && a.equals( b ) );

} );

test( 'i#getNormalMatrix3 return invert mat3', t => {

    const m = new Matrix3();
    const o = a.identity().getNormalMatrix3( m );
    const r = new Matrix3();
    t.true( m === o && m.equals( r ) );

} );

test( 'i#lookAt return self and transfrom right', t => {

    const o = a.lookAt( new Vector3( 0, 2, 0 ),
        new Vector3( 0, 0.6, 0 ),
        new Vector3( 0, 0, - 1 ) );
    const r = new Vector3( 0, 2, - 1 ).transfromMatrix4( a );
    t.true( o === a && r.equals( new Vector3( 0, 1, 0 ) ) );

} );

test( 'i#equals return true when have float value', t => {

    a.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, - 1, 0,
        0, 0, 0, 1
    );
    b.set(
        0.1 + 0.9, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, - 1, 0,
        0, 0, 0, 1
    );
    t.true( a.equals( b ) );

} );

test( 'i#clone return new mat and have same value', t => {

    const o = a.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, - 1, 0,
        0, 0, 0, 1
    ).clone();
    t.true( o instanceof Matrix4 && o !== a && a.equals( o ) );

} );

test( 'i#determinant return right value', t => {

    t.true( a.identity().determinant() === 1 );

} );

test( 'i#compose return self and set value', t => {

    const p = new Vector3();
    const r = new Quaternion();
    const s = new Vector3( 1, 1, 1 );
    const o = a.compose( p, r, s );
    t.true( o === a && a.equals( b.identity() ) );

} );

test( 'i#decompose return self and set value', t => {

    const p = new Vector3();
    const r = new Quaternion();
    const s = new Vector3();
    const o = a.identity().decompose( p, r, s );
    t.true( o === a && p.equals( new Vector3() ) && r.equals( new Quaternion() ) && s.equals( new Vector3( 1, 1, 1 ) ) );

} );
