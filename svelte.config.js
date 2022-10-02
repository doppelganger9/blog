/** @type {import('@sveltejs/kit').Config} */
import staticAdapter from '@sveltejs/adapter-static';
import istanbulPlugin from 'vite-plugin-istanbul';
import { defineConfig } from 'vite';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import sveltePreprocess from 'svelte-preprocess';

const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		mdsvex(mdsvexConfig),
		sveltePreprocess(),
	],
	kit: {
		adapter: staticAdapter(),
		vite: defineConfig({
			plugins: [ 
				istanbulPlugin({
					include: 'src/*',
					extension: [ '.js', '.svelte' ],
					requireEnv: true,
					checkProd: false, // only check CYPRESS_COVERAGE
					cypress: true,
          // NOTE: last 2 options mean if you do not run with CYPRESS_COVERAGE=true 
          // as an env var, no instrumentation will occur
				}),
			],
		}),
	},
};

// const config = {
// 	// options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
// 	compilerOptions: null,

// 	// an array of file extensions that should be treated as Svelte components
// 	extensions: ['.svelte'],

// 	kit: {
// 		adapter: null,
// 		amp: false,
// 		appDir: '_app',
// 		files: {
// 			assets: 'static',
// 			hooks: 'src/hooks',
// 			lib: 'src/lib',
// 			routes: 'src/routes',
// 			serviceWorker: 'src/service-worker',
// 			template: 'src/app.html'
// 		},
// 		floc: false,
// 		host: null,
// 		hostHeader: null,
// 		hydrate: true,
// 		package: {
// 			dir: 'package',
// 			emitTypes: true,
// 			// excludes all .d.ts and files starting with _ as the name
// 			exports: (filepath) => !/^_|\/_|\.d\.ts$/.test(filepath),
// 			files: () => true
// 		},
// 		paths: {
// 			assets: '',
// 			base: ''
// 		},
// 		prerender: {
// 			crawl: true,
// 			enabled: true,
// 			entries: ['*'],
// 			onError: 'fail'
// 		},
// 		router: true,
// 		serviceWorker: {
// 			files: (filepath) => !/\.DS_STORE/.test(filepath)
// 		},
// 		ssr: true,
// 		target: null,
// 		trailingSlash: 'never',
// 		vite: () => ({})
// 	},
	
// 	// SvelteKit uses vite-plugin-svelte. Its options can be provided directly here.
// 	// See the available options at https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md

// 	// options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
// 	preprocess: null
// };

export default config;