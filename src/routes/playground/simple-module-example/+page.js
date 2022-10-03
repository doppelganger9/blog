console.log('Hello, simple-module-example.svelte script module.')
export const prerender = false

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load() {

  return {
    a: 'toto'
  }
}
