import test from 'ava';
import { PMath } from '../../';

test( '@RADIAN_PER_DEGREE return Math.PI', t => {

    t.true( PMath.RADIAN_PER_DEGREE * 180 === Math.PI );

} );

test( '@DEGREE_PER_RADIAN return 180', t => {

    t.true( PMath.DEGREE_PER_RADIAN * Math.PI === 180 );

} );

test( '@EPS return 0.000001', t => {

    t.true( PMath.EPS === 0.000001 );

} );

test( '#floatEquals 0.1 + 0.2 = 0.3', t => {

    t.true( PMath.floatEquals( 0.1 + 0.2, 0.3 ) );

} );

test( '#degree2Radian always return true', t => {

    const degree = 180 * Math.random();
    const target = degree / 180 * Math.PI;

    t.true( PMath.floatEquals( PMath.degree2Radian( degree ), target ) );

} );

test( '#radian2Degree always return true', t => {

    const radian = Math.PI * Math.random();
    const target = radian * 180 / Math.PI;

    t.true( PMath.floatEquals( PMath.radian2Degree( radian ), target ) );

} );

test( '#clamp return value in range', t => {

    const value  = 10 * Math.random();
    const min    = 3 * Math.random();
    const max    = min + 3 * Math.random();
    const result = PMath.clamp( value, min, max );

    t.true( result >= min && result <= max );

} );

test( '#map return value map to another range', t => {

    const value  = 10 * Math.random();
    const min    = 3 * Math.random();
    const max    = min + 3 * Math.random();
    const newMin = 3 * Math.random();
    const newMax = newMin + 3 * Math.random();
    const result = PMath.map( value, min, max, newMin, newMax );
    const target = ( value - min ) / ( max - min ) * ( newMax - newMin ) + newMin;

    t.true( PMath.floatEquals( result, target ) );

} );

test( '#arrayEquals reture true when length and value equals', t => {

    const a1 = [ 1, 2, 3 ];
    const a2 = [ 1, 2, 3, 4 ];
    const a3 = new Float32Array( [ 1.0, 0.1 + 1.9, 3 ] );
    const a4 = {}; a4[ '0' ] = 1; a4[ '1' ] = 2; a4[ '2' ] = 3; a4.length = 3;

    t.true( ! PMath.arrayEquals( a1, a2 ) && PMath.arrayEquals( a1, a3 ) && PMath.arrayEquals( a1, a4 ) );

} );

test( '#arrayClone reture different object with same type and value', t => {

    const a1 = [ 1, 2, 3 ];
    const a2 = new Float32Array( a1 );
    const c1 = PMath.arrayClone( a1 );
    const c2 = PMath.arrayClone( a2 );

    t.true( a1.constructor === c1.constructor && a1 !== c1 && PMath.arrayEquals( a1, c1 ) &&
    a2.constructor === c2.constructor && a2 !== c2 && PMath.arrayEquals( a2, c2 ) );

} );
