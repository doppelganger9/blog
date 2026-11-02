import { getPostForSlug } from '#lib/posts.js';

/**
 * `<html lang>` in src/app.html is `%lang%`: the language of the post for a post page
 * (`lang` frontmatter field), English everywhere else. src/routes/+layout.svelte keeps it up to date
 * when the client-side router opens another page.
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
  const slug = event.url.pathname.replace(/^\/|\/$/g, '');
  const lang = getPostForSlug(slug)?.metadata.lang ?? 'en';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang),
  });
}
