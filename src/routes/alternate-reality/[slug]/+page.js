import { loadPostForSlug } from '#lib/postPage.js';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  return loadPostForSlug(`alternate-reality/${params.slug}`);
}
