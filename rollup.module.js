import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default {
    input: 'src/CZPG.js',
    output: [
        {
            format: 'es',
            sourcemap: true,
            file: 'build/czpg.module.js'
        }
    ],
    plugins: [
        eslint(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
