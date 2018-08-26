import test from 'ava';
import { Register } from '../../';

test( '@map return a map', t => {

    t.truthy( Register.map instanceof Map );

} );

test( '@size return a number', t => {

    t.truthy( typeof Register.size === 'number' );

} );

test( '#inject is a function', t => {

    t.truthy( typeof Register.inject === 'function' );

} );
