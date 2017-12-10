import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

let output = [];
if (process.env.NODE_ENV === 'module') {
    output.push({
        format: 'es',
        sourcemap: true,
        file: 'build/czpg.module.js'
    });
} else {
    output.push({
        format: 'umd',
        name: 'CZPG',
        sourcemap: true,
        file: (process.env.NODE_ENV === 'combine') ? 'build/czpg.js' : 'build/czpg.min.js'
    });
}

let plugins = [eslint()];

if (process.env.NODE_ENV !== 'combine') {
    plugins.push(babel({
        exclude: 'node_modules/**'
    }));
    if (process.env.NODE_ENV !== 'module') {
        plugins.push(uglify());
    }
}

export default {
    input: 'src/CZPG.js',
    output,
    plugins
};
