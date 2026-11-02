// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

// Compile a Svelte component as a Custom Element when it has `<svelte:options customElement=...>`
// (Svelte 4+ syntax; `tag=` was the Svelte 3 one). Without the `customElement: true` compile option,
// Svelte 5 still registers the element but warns `options_missing_custom_element`.
export function isWebComponentSvelte(code) {
  return /<svelte:options\b[^>]*\bcustomElement\s*=/.test(code)
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
