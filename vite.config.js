// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

// Compile a Svelte component as a Custom Element when it has `<svelte:options tag=...>`
function isWebComponentSvelte(code) {
  const svelteOptionsIdx = code.indexOf('<svelte:options ')
  if (svelteOptionsIdx < 0) {
    return false
  }
  const tagOptionIdx = code.indexOf('tag=', svelteOptionsIdx)
  const svelteOptionsEndIdx = code.indexOf('>', svelteOptionsIdx)
  return tagOptionIdx > svelteOptionsIdx && tagOptionIdx < svelteOptionsEndIdx
}

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: true,
  },
  server: {
    // npm run dev use this one
    port: 3000
  },
  preview: {
    // `vite preview` (the e2e tests serve build/ with http-server instead)
    port: 3000
  },
  plugins: [
    // SvelteKit 3: the former svelte.config.js options are passed to the plugin
    sveltekit({
      adapter: adapter(),
      extensions: ['.svelte', ...mdsvexConfig.extensions],
      preprocess: [
        mdsvex(mdsvexConfig),
        vitePreprocess({ script: true }), // to transpile typescript when using `npm run dev` for ex.
      ],
      // forwarded to vite-plugin-svelte
      dynamicCompileOptions({ code }) {
        if (isWebComponentSvelte(code)) {
          return { customElement: true }
        }
      },
    }),
  ]
};

export default config;
