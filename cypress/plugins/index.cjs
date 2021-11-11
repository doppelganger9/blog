/**
 * NOTE: for SvelteKit, package.json has type:module, which creates an error in cypress config
 * so we need to use index.cjs instead of index.js
 * see https://github.com/cypress-io/cypress/issues/8090#issuecomment-955570508
 */

module.exports = function(on, config) {
  require('@cypress/code-coverage/task')(on, config)

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config
}