/* eslint prefer-template: 0 */
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

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

let output = [];
output.push( {
    format: 'umd',
    name: 'CZPG',
    sourcemap: true,
    file: 'build/czpg.js',
} );

if ( process.env.NODE_ENV === 'module' )
    output = [ {
        format: 'es',
        external: [ 'czpg-ecs' ],
        file: 'build/czpg.module.js',
    }, {
        format: 'cjs',
        external: [ 'czpg-ecs' ],
        file: 'build/czpg.cjs.js',
    } ];


const plugins = [ glsl(), resolve(), commonjs(), babel( {
    exclude: 'node_modules/**',
} ) ];

export default {
    input: 'src/CZPG.js',
    output,
    plugins,
};
