import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  video: false,

  env: {
    BLOG_JAMSTACK: "svelte-kit",
  },

  chromeWebSecurity: false,

  e2e: {
    baseUrl: "http://127.0.0.1:8080",
    setupNodeEvents(on, config) {
      // merges the coverage of each test and writes the nyc report into coverage/
      codeCoverageTask(on, config);
      return config;
    },
  },

});
