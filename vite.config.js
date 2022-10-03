// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import istanbulPlugin from 'vite-plugin-istanbul';

/** @type {import('vite').UserConfig} */
const config = {
  server: {
    // npm run dev use this one
    port: 3000
  },
  preview: {
    // npm test / cypress tests use this one
    port: 3000
  },
  plugins: [
    sveltekit(),
    istanbulPlugin({
      include: 'src/*',
      extension: [ '.js', '.svelte' ],
      requireEnv: true,
      checkProd: false, // only check CYPRESS_COVERAGE
      cypress: true,
      // NOTE: last 2 options mean if you do not run with CYPRESS_COVERAGE=true 
      // as an env var, no instrumentation will occur
    }),
  ]
};

export default config;
