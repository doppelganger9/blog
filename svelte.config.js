/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';
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
    adapter: adapter(),
  },
  // some config to compile Svelte components as Custom Elements if they have `<svelte:options tag=`
  vitePlugin: {
      dynamicCompileOptions({code}) {
          if(isWebComponentSvelte(code)) {
              return {
                  customElement: true
              }
          }
      }
  }
};

function isWebComponentSvelte(code) {
  const svelteOptionsIdx = code.indexOf('<svelte:options ')
  if(svelteOptionsIdx < 0) {
      return false
  }
  const tagOptionIdx = code.indexOf('tag=', svelteOptionsIdx)
  const svelteOptionsEndIdx = code.indexOf('>',svelteOptionsIdx);
  return tagOptionIdx > svelteOptionsIdx && tagOptionIdx < svelteOptionsEndIdx
}

// const config = {
//   // options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
//   compilerOptions: null,

//   // an array of file extensions that should be treated as Svelte components
//   extensions: ['.svelte'],

//   kit: {
//     adapter: null,
//     amp: false,
//     appDir: '_app',
//     files: {
//       assets: 'static',
//       hooks: 'src/hooks',
//       lib: 'src/lib',
//       routes: 'src/routes',
//       serviceWorker: 'src/service-worker',
//       template: 'src/app.html'
//     },
//     floc: false,
//     host: null,
//     hostHeader: null,
//     hydrate: true,
//     package: {
//       dir: 'package',
//       emitTypes: true,
//       // excludes all .d.ts and files starting with _ as the name
//       exports: (filepath) => !/^_|\/_|\.d\.ts$/.test(filepath),
//       files: () => true
//     },
//     paths: {
//       assets: '',
//       base: ''
//     },
//     prerender: {
//       crawl: true,
//       enabled: true,
//       entries: ['*'],
//       onError: 'fail'
//     },
//     router: true,
//     serviceWorker: {
//       files: (filepath) => !/\.DS_STORE/.test(filepath)
//     },
//     ssr: true,
//     target: null,
//     trailingSlash: 'never',
//     vite: () => ({})
//   },
  
//   // SvelteKit uses vite-plugin-svelte. Its options can be provided directly here.
//   // See the available options at https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md

//   // options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
//   preprocess: null
// };

export default config;