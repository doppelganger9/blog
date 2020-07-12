import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import istanbul from 'rollup-plugin-istanbul';
//import image from 'svelte-image';
import { mdsvex } from 'mdsvex';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const jsonModeWithSimpleQuotes = mode ? JSON.stringify(mode).replace(/\"/g, '\'') : "''";
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': jsonModeWithSimpleQuotes
			}),
			svelte({
				// tell svelte to handle mdsvex files, all markdown will be processed by mdsvex
				extensions: ['.svelte', '.svx'],
				preprocess: mdsvex({
					layout: {
						_: './src/layouts/post.svelte' // par défaut
					}
				}),
				dev,
				hydratable: true,
				emitCss: true
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			}),

			// only instrument source code in development mode
			// sapper rollup config will configure the output
			// with sourcemap: 'inline'
			dev &&
			istanbul({
				// only instrument our files in 'src' folder
				// which will instrument '.svelte' and '.js' files
				extensions: ['.js', '.svelte'],
				include: ['src/**/*'],
				sourceMap: true,
				compact: false,
				debug: true
			}),
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': jsonModeWithSimpleQuotes
			}),
			svelte({
				// tell svelte to handle mdsvex files
				extensions: ['.svelte', '.svx'],
				preprocess: mdsvex({
					layout: {
						_: './src/layouts/post.svelte' // par défaut
					}
				}),
				generate: 'ssr',
				dev
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		preserveEntrySignatures: 'strict',
		onwarn,
	},

	// serviceworker: {
	// 	input: config.serviceworker.input(),
	// 	output: config.serviceworker.output(),
	// 	plugins: [
	// 		resolve(),
	// 		replace({
	// 			'process.browser': true,
	// 			'process.env.NODE_ENV': jsonModeWithSimpleQuotes
	// 		}),
	// 		commonjs(),
	// 		!dev && terser()
	// 	],

	// 	preserveEntrySignatures: false,
	// 	onwarn,
	// }
};
