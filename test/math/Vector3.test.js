import test from 'ava';
import { Vector3, Spherical, Matrix4, Matrix3, PMath } from '../../';

const a = new Vector3();
const b = new Vector3();

test( '#constructor set the right value', t => {

    const v = new Vector3( 0, 1, 2 );
    t.true( v.x === 0 && v.y === 1 && v.z === 2 );

} );

test( 'i@raw is typed array', t => {

    t.true( a.raw instanceof Float32Array );

} );

test( 'i@x is a number and equals raw[0]', t => {

    t.true( typeof a.x === 'number' && a.x === a.raw[ 0 ] );

} );

test( 'i@y is a number and equals raw[1]', t => {

    t.true( typeof a.y === 'number' && a.y === a.raw[ 1 ] );

} );

test( 'i@z is a number and equals raw[2]', t => {

    t.true( typeof a.z === 'number' && a.z === a.raw[ 2 ] );

} );

test( '@cache instance of Vector3', t => {

    t.true( Vector3.cache instanceof Vector3 );

} );

test( 'i#set return self and set values', t => {

    const out = a.set( 0, 1, 2 );
    t.true( out === a && a.x === 0 && a.y === 1 && a.z === 2 );

} );

test( 'i#setFromArray return self and set values', t => {

    const out = a.setFromArray( [ 0, 1, 2 ] );
    t.true( out === a && a.x === 0 && a.y === 1 && a.z === 2 );

} );

test( 'i#setFromArray apply offset', t => {

    a.setFromArray( [ - 2, - 1, 0, 1, 2 ], 2 );
    t.true( a.x === 0 && a.y === 1 && a.z === 2 );

} );

test( 'i#setFromSpherical return self and set values', t => {

    const out = a.setFromSpherical( new Spherical( 10, Math.PI / 2, 0 ) );
    const approximate = ( x, y ) => Math.abs( x - y ) < 0.00001;
    t.true( out === a && approximate( a.x, 0 ) && approximate( a.y, 0 ) && approximate( a.z, 10 ) );

} );

test( 'i#setFromSpherical circle test', t => {

    const spherical = new Spherical().setFromVector3( b.set( 1 * Math.random(), 2 * Math.random(), 3 * Math.random() ) );
    a.setFromSpherical( spherical );
    t.true( a.equals( b ) );

} );

test( 'i#equals return true', t => {

    t.true( a.set( 0.0, 0.1 + 0.9, 2.0 ).equals( b.set( 0, 1, 2 ) ) );

} );

test( 'i#length return right length', t => {

    const out = a.set( 0, 0, 0.9 ).length();
    t.true( PMath.floatEquals( out, 0.9 ) );

} );

test( 'i#length return right length when have two arguments', t => {

    const out = a.set( 0, 0, 0.9 ).length( b.set( 0, 0.8, 0 ) );
    t.true( PMath.floatEquals( out, Math.sqrt( 0.8 * 0.8 + 0.9 * 0.9 ) ) );

} );

test( 'i#squareLength return right squareLength', t => {

    const out = a.set( 0, 0, 1.1 ).squareLength();
    t.true( PMath.floatEquals( out, 1.1 * 1.1 ) );

} );

test( 'i#squareLength when pass another vec3', t => {

    const out = a.set( 0, 0, 1.1 ).squareLength( b.set( 1, 0, 0 ) );
    t.true( PMath.floatEquals( out, 1.1 * 1.1 + 1 ) );

} );

test( 'i#normalize return self and length is 1', t => {

    const out = a.set( 0, 0, 1.1 ).normalize().length();
    t.true( PMath.floatEquals( out, 1 ) && a.equals( b.set( 0, 0, 1 ) ) );

} );

test( 'i#scale return self and scaled', t => {

    const out = a.set( 0, 1, 2 ).scale( 2 );
    t.true( out === a && a.equals( b.set( 0, 2, 4 ) ) );

} );

test( 'i#copy return self and set value', t => {

    const out = a.set( 0, 1, 2 ).copy( b.set( 3, 3, 3 ) );
    t.true( out === a && a.equals( b ) );

} );

test( 'i#clone return new instance and set value', t => {

    const out = a.set( 0, 1, 2 ).clone();
    t.true( out !== a && a.equals( out ) );

} );

test( 'i#sub return self and sub value', t => {

    const out = a.set( 0, 0, 0 ).sub( b.set( 0, 1, 2 ) );
    t.true( out === a && a.equals( new Vector3( 0, - 1, - 2 ) ) );

} );

test( 'i#add return self and add value', t => {

    const out = a.set( 0, 0, 0 ).add( b.set( 0, 1, 2 ) );
    t.true( out === a && a.equals( new Vector3( 0, 1, 2 ) ) );

} );

test( 'i#subVectors return self and set value', t => {

    const out = a.subVectors( a.set( 0, 0, 0 ), b.set( 0, 1, 2 ) );
    t.true( out === a && a.equals( new Vector3( 0, - 1, - 2 ) ) );

} );

test( 'i#dot return 1', t => {

    const out = a.set( 0, 1, 1 ).dot( b.set( 1, 1, 0 ) );
    t.true( out === 1 );

} );

test( 'i#cross return self and cross', t => {

    const out = a.set( 0, 1, 0 ).cross( b.set( 0, 0, 1 ) );
    t.true( out === a && out.equals( b.set( 1, 0, 0 ) ) );

} );

test( 'i#transfromMatrix3 return self and right value', t => {

    const o = a.set( 0, 0, 1 ).transfromMatrix3( new Matrix3() );
    t.true( o === a && a.equals( b.set( 0, 0, 1 ) ) );

} );

test( 'i#transfromMatrix3 when rotate about Y', t => {

    a.set( 1, 0, 0 ).transfromMatrix3( new Matrix3( 0, 0, - 1, 0, 1, 0, 1, 0, 0 ) );
    t.true( a.equals( b.set( 0, 0, - 1 ) ) );

} );

test( 'i#transfromMatrix4() return self', t=>{

    const o = a.set( 1, 2, 3 ).transfromMatrix4( new Matrix4() );
    t.true( o === a && a.equals( b.set( 1, 2, 3 ) ) );

} );
