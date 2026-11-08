import { computeMinutesToRead } from '#lib/minutesToRead.js';

/** `src/posts/2019-03-01-hello-world.md` → `2019-03-01-hello-world` */
export const slugFromPath = (path) => path.match(/\/src\/posts\/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

/** the file name of a post's related posts, `2019/06/16` → `2019_06_16` (route src/routes/related) */
export const relatedPostsKey = (slug) => slug.replaceAll('/', '_');
export const slugFromRelatedPostsKey = (key) => key.replaceAll('_', '/');

/**
 * The view model of a post, from the path and the frontmatter of its module.
 * Shared by #lib/posts.js (all posts, on the server) and #lib/postPage.js (one post, in the browser).
 */
export function toPost(path, metadata) {
  const date = new Date(metadata.date);
  const lang = metadata.lang || 'en';
  return {
    path,
    slug: metadata.slug || slugFromPath(path), // possibilité de surcharger le slug via le frontmatter
    metadata: {
      ...metadata,
      dateString: date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      lang,
    },
    minutesToRead: computeMinutesToRead(metadata.wordCount, 180, lang),
    categories: metadata.category?.split(/, ?/),
    tags: metadata.tags?.split(/, ?/),
  };
}
