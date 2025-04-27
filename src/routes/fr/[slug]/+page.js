import { loadPostForSlug } from '$lib/posts';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  return loadPostForSlug(params.slug, 'fr');
}
