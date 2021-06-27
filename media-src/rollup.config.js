const replace = require('@rollup/plugin-replace');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
import scss from 'rollup-plugin-scss';

// @ts-check
const isProd = process.env.NODE_ENV === 'production';
const extensions = ['.js', '.ts', '.tsx'];

export default {
    input: ['src/Demo.tsx', 'src/SoundEventsEditor.tsx', 'src/CustomGameSettings.tsx'],
    output: {
        dir: '../media/bundle',
        format: 'es',
        sourcemap: isProd ? false : 'inline',
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        }),
        nodeResolve({
            extensions,
        }),
        commonjs({
            include: /node_modules/,
        }),
        babel({
            extensions,
            exclude: /node_modules/,
            babelrc: false,
            runtimeHelpers: true,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: { chrome: '83' },
                    },
                ],
                '@babel/preset-react',
                '@babel/preset-typescript',
            ],
            plugins: [
                // ["module-resolver", {
                //     root: ["./src/"],
                //     alias: {
                //         "@emotion/react": "./node_modules/@emotion/styled/dist/emotion-styled.umd.min.js",
                //     }
                // }],
                'react-require',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                [
                    '@babel/plugin-proposal-object-rest-spread',
                    {
                        useBuiltIns: true,
                    },
                ],
                // ['@babel/plugin-transform-runtime', {
                //     // corejs: 3,
                //     helpers: true,
                //     regenerator: true,
                //     useESModules: false,
                // }],
                ['@emotion'],
            ],
        }),
        scss({
            output: '../media/bundle/style.css',
        }),
        isProd && terser(),
    ],
};
