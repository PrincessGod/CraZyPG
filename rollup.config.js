import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/CZPG.js',
    output: [
        {
            format: 'umd',
            name: 'CZPG',
            sourcemap: true,
            file: 'build/czpg.js'
        }
    ],
    plugins: [
        eslint(),
        (process.env.NODE_ENV !== 'combine' && babel({
            exclude: 'node_modules/**'
        })),
        (process.env.NODE_ENV !== 'combine' && uglify())
    ]
};
