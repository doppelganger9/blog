import { loadPostForSlug } from '#lib/posts.js';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  return loadPostForSlug(`future/${params.slug}`);
}
