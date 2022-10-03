import { loadPostForSlug } from '$lib/posts';

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  return loadPostForSlug(`future/${params.slug}`);
}
