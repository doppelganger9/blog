import { loadPublishedPostForSlug } from '#lib/postPage.js';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  return loadPublishedPostForSlug(`${params.year}/${params.month}/${params.day}`);
}
