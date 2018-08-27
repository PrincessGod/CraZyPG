import test from 'ava';
import { Vector4 } from '../../';

const a = new Vector4();
const b = new Vector4();

test( '#constructor work with right parameters', t => {

    const v = new Vector4( 1, 2, 3, 4 );
    t.true( a.x === 0 && a.y === 0 && a.z === 0 && a.w === 0 &&
            v.x === 1 && v.y === 2 && v.z === 3 && v.w === 4 );

} );

test( 'i@raw return typed array', t => {

    const out = a.raw;
    t.true( out instanceof Float32Array && out.length === 4 );

} );

test( '1@x&y&z&w getter and setter work', t => {

    a.x = 1;
    a.y = 2;
    a.z = 3;
    a.w = 4;
    t.true( a.x === 1 && a.y === 2 && a.z === 3 && a.w === 4 );

} );

test( 'i@set return self and set right value', t => {

    const out = a.set( 1, 2, 3, 4 );
    t.true( out === a && a.x === 1 && a.y === 2 && a.z === 3 && a.w === 4 );

} );

test( 'i@clone return new vec and have same value', t => {

    const out = a.set( 1, 2, 3, 4 ).clone();
    t.true( out !== a && out.x === 1 && out.y === 2 && out.z === 3 && out.w === 4 );

} );

test( 'i@copy return self and have same value', t => {

    const out = a.copy( b.set( 1, 2, 3, 4 ) );
    t.true( out === a && out.x === 1 && out.y === 2 && out.z === 3 && out.w === 4 );

} );

test( 'i@equals return true when have float values', t => {

    const out = a.set( 1, 2, 3, 4 ).equals( b.set( 0.1 + 0.9, 2, 3, 4 ) );
    t.true( out );

} );

test( 'i@lerp return right values', t => {

    const r = Math.random();
    a.set( 1, 2, 3, 4 );
    b.set( 4, 3, 2, 1 );
    a.lerp( a, b, r );
    b.set( 1 + 3 * r, 2 + r, 3 - r, 4 - 3 * r );

    t.true( a.equals( b ) );

} );
