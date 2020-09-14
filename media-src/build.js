const replace = require('@rollup/plugin-replace');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const livereload = require('rollup-plugin-livereload');
const rollup = require('rollup');
const { basename } = require('path');
const { writeFileSync } = require('fs');
const react = require('react');
const reactDom = require('react-dom');

// @ts-check

const isProd = process.env.NODE_ENV === 'production';
const extensions = ['.js', '.ts', '.tsx'];

const plugins = [
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
            ['@babel/preset-env', {
                "targets": {"chrome": "75"}
            }],
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
        plugins: [
            'react-require',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            ['@babel/plugin-proposal-object-rest-spread', {
                useBuiltIns: true,
            }],
            ['@babel/plugin-transform-runtime', {
                corejs: 3,
                helpers: true,
                regenerator: true,
                useESModules: false,
            }],
        ],
    }),
    terser(),
];

function watchFile( name ) {
    rollup.watch({
        input: `src/${name}.tsx`,
        output: {
            name: name,
            file: `../media/react/${name}.js`,
            format: 'iife',
            sourcemap: isProd? false : 'inline',
        },
        inlineDynamicImports: true,
        plugins,
    })
    .on('event', async (evt) => {
        if(evt.code === 'ERROR') {
            console.log(evt);
        } else if(evt.code === 'FATAL') {
            console.log(evt);
        } else if (evt.code === 'BUNDLE_START') {
            console.log(`Bundle start ${name}`);
        } else if (evt.code === 'BUNDLE_END') {
            console.log(`Bundle end ${name}`);
        }
    })
    .on('change', (p) => {
        const d = new Date();
        console.log(`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] Build:`, basename(p));
    });
}

watchFile('SoundEventsEditor');
watchFile('NetTableEditor');