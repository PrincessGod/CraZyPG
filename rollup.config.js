/* eslint prefer-template: 0 */

import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
// import glslify from 'rollup-plugin-glslify';
import fs from 'fs-extra';

function glsl() {

    return {

        transform( code, id ) {

            if ( /\.glsl$/.test( id ) === false ) return undefined;

            const transformedCode = 'export default ' + JSON.stringify( code.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
                .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) ) + ';'; // remove /* */
                // .replace( /\n{2,}/g, '\n' ) ) + ';'; // # \n+ to \n

            return {
                code: transformedCode,
                map: { mappings: '' },
            };

        },

    };

}

fs.ensureDirSync( './build' );
fs.copySync( './resource', './build/resource' );
fs.copySync( './sample', './build' );

const output = [];
console.log( process.env.NODE_ENV );
if ( process.env.NODE_ENV === 'module' )
    output.push( {
        format: 'es',
        sourcemap: true,
        file: 'build/czpg.module.js',
    } );
else
    output.push( {
        format: 'umd',
        name: 'CZPG',
        sourcemap: true,
        file: ( process.env.NODE_ENV === 'combine' ) ? 'build/czpg.js' : 'build/czpg.min.js',
    } );

// glslify( { basedir: 'src/shader/shadersrc/' } ),

const plugins = [ glsl(), eslint( { exclude: '**/*.glsl' } ) ];

if ( process.env.NODE_ENV !== 'combine' ) {

    plugins.push( babel( {
        exclude: 'node_modules/**',
    } ) );
    if ( process.env.NODE_ENV !== 'module' )
        plugins.push( uglify() );


}

export default {
    input: 'src/CZPG.js',
    output,
    plugins,
};
