import { loadPublishedPostForSlug } from '#lib/posts.js';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  return loadPublishedPostForSlug(params.slug);
}
