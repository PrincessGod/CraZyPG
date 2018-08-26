import test from 'ava';
import { Register } from '../../';

test( '@map return a map', t => {

    t.true( Register.map instanceof Map );

} );

test( '@size return a number', t => {

    t.true( typeof Register.size === 'number' );

} );

test( '#inject is a function', t => {

    t.true( typeof Register.inject === 'function' );

} );
