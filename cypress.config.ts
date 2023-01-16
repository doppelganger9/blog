import { defineConfig } from "cypress";

export default defineConfig({
  video: false,

  env: {
    BLOG_JAMSTACK: "svelte-kit",
  },

  chromeWebSecurity: false,

  e2e: {
    baseUrl: "http://127.0.0.1:8080",
  },

});
