import test from 'ava';
import { Vector2 } from '../../';

const a = new Vector2();
const b = new Vector2();

test( '#constructor set the right value', t => {

    const v = new Vector2( 0, 2 );
    t.true( v.x === 0 && v.y === 2 );

} );

test( 'i@raw is typed array', t => {

    t.true( a.raw instanceof Float32Array );

} );

test( 'i@raw length is 2', t => {

    t.true( a.raw.length === 2 );

} );

test( 'i@x is raw[0]', t => {

    t.true( a.x === a.raw[ 0 ] );

} );

test( 'i@y is raw[1]', t => {

    t.true( a.y === a.raw[ 1 ] );

} );

test( 'i@width is x', t => {

    t.true( a.width === a.x );

} );

test( 'i@height is y', t => {

    t.true( a.height === a.y );

} );

test( '@cache is a vec2', t => {

    t.true( Vector2.cache instanceof Vector2 );

} );

test( 'i#set set value and renturn self', t => {

    const out = a.set( 1, 2 );
    t.true( a === out && a.x === 1 && a.y === 2 );

} );

test( 'i@width&height set value success', t => {

    a.set( 1, 2 );
    b.width = 1;
    b.height = 2;
    t.true( a.x = b.x && a.y == b.y );

} );

test( 'i#equals reture true', t => {

    t.true( a.set( 0.1 + 0.9, 2.0 ).equals( b.set( 1, 2 ) ) );

} );

test( 'i#clone reture new vec2 have same value', t => {

    const out = a.clone();
    t.true( a !== out && a.x === out.x && a.y === out.y );

} );

test( 'i#copy reture self and copy value', t => {

    const out = a.copy( b.set( 2, 3 ) );
    t.true( out === a && a.x === 2 && a.y === 3 );

} );

test( 'i#add reture self and add value', t => {

    const out = a.set( 0, 0 ).add( b.set( 2, 3 ) );
    t.true( out === a && a.x === 2 && a.y === 3 );

} );

test( 'i#sub reture self and sub value', t => {

    const out = a.set( 0, 0 ).sub( b.set( 2, 3 ) );
    t.true( out === a && a.x === - 2 && a.y === - 3 );

} );

test( 'i#subVectors reture self and set value with sub values', t => {

    const out = a.subVectors( a.set( 0, 0 ), b.set( 2, 3 ) );
    t.true( out === a && a.x === - 2 && a.y === - 3 );

} );

test( 'i#clamp reture self and clamp value', t => {

    const out = a.set( 2, 5 ).clamp( 2, 3 );
    t.true( out === a && a.x === 2 && a.y === 3 );

} );
