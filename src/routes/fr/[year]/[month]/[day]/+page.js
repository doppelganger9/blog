import { loadPostForSlug } from '$lib/posts';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load({ params }) {
  console.log(`lang=fr / page slug: ${params.year}/${params.month}/${params.day}`);

  return loadPostForSlug(`${params.year}/${params.month}/${params.day}`, 'fr');
}
