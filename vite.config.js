// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { readdirSync, readFileSync } from 'node:fs';

// Compile a Svelte component as a Custom Element when it has `<svelte:options customElement=...>`
// (Svelte 4+ syntax; `tag=` was the Svelte 3 one). Without the `customElement: true` compile option,
// Svelte 5 still registers the element but warns `options_missing_custom_element`.
export function isWebComponentSvelte(code) {
  return /<svelte:options\b[^>]*\bcustomElement\s*=/.test(code)
}

// `virtual:post-index`: { slug: '/src/posts/<file>' } for every post, read from the `slug`
// frontmatter field (or the file name). The post pages use it to import only the post they show
// (src/lib/postPage.js); src/lib/posts.js checks at build time that it agrees with mdsvex.
const POSTS_DIR = 'src/posts';
function postIndex() {
  const id = 'virtual:post-index';
  const resolvedId = '\0' + id;
  return {
    name: 'post-index',
    resolveId: (source) => (source === id ? resolvedId : undefined),
    load(loadedId) {
      if (loadedId !== resolvedId) return;
      const index = {};
      for (const file of readdirSync(POSTS_DIR).filter((f) => /\.(md|svx)$/.test(f))) {
        const frontmatter = readFileSync(`${POSTS_DIR}/${file}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
        const slug = frontmatter.match(/^slug:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? file.replace(/\.(svelte\.md|md|svx)$/, '');
        index[slug] = `/${POSTS_DIR}/${file}`;
      }
      return `export default ${JSON.stringify(index)};`;
    },
    configureServer(server) {
      // npm run dev: a post added, renamed or re-slugged updates the index
      server.watcher.on('all', (_event, file) => {
        if (!file.includes(`/${POSTS_DIR}/`)) return;
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) server.moduleGraph.invalidateModule(mod);
      });
    },
  };
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
    postIndex(),
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
