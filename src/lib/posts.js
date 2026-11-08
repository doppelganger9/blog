// Server-side only (+page.server.js, +server.js and hooks.server.js files): the eager import
// below bundles every post, so importing this module from client code would make every
// visitor download all of them. Post pages load their post with #lib/postPage.js instead.
import postIndex from 'virtual:post-index';
import { toPost } from '#lib/post.js';

const POSTS = _loadPosts();

function _loadPosts() {
  // mdsvex exposes all posts as modules we can import
  const imports = import.meta.glob(`/src/posts/*.{md,svx,svelte.md}`, {eager: true});
  const posts = Object.entries(imports).map(([path, postModule]) => toPost(path, postModule.metadata));

  // the slug → file index used by the post pages in the browser must agree with mdsvex
  for (const post of posts) {
    if (postIndex[post.slug] !== post.path) {
      throw new Error(`virtual:post-index maps ${post.slug} to ${postIndex[post.slug]} instead of ${post.path} (see vite.config.js)`);
    }
  }

  // sort posts by date
  posts.sort((a, b) => {
    if (a.metadata.date === b.metadata.date) return 0;
    return (new Date(a.metadata.date) < new Date(b.metadata.date)) ? 1 : -1;
  });

  return posts;
}

export function getPublishedPosts() {
  const publishedPosts = POSTS.filter(p => p.metadata.published); // mdsvex make it a real boolean!
  const notPostsFromFutureOrAlternateReality = publishedPosts
    .filter(p => p.slug.indexOf('future/') < 0 && p.slug.indexOf('alternate-reality/') < 0);
  return notPostsFromFutureOrAlternateReality;
}

export function getAllTagsOfPublishedPosts(postList) {
  const tags = cleanAndDedupe(postList.map(p => p.tags).flat(1)).sort();
  const hasTag = tag => p => p.tags?.indexOf(tag)>=0;
  return tags.map( tag => ({
    tag,
    nb: postList.filter(hasTag(tag)).length
  }));
}

export function getAllCategoriesOfPublishedPosts(postList) {
  const defaultCategories = ["Dev", "TTRPG", "Music", "Family", "Sports", "Agile", "Gaming"];
  const categoriesFromPosts = postList.map(p => p.categories).flat(1).filter(x => !!x);
  const categoriesFromPostsCapitalized = categoriesFromPosts.map(c => c.substring(0,1).toUpperCase() + c.substring(1).toLowerCase());
  const merged = [...defaultCategories, ...categoriesFromPostsCapitalized];
  const categories = ["", ...cleanAndDedupe(merged).sort()];
  const hasCategory = c => p => (p.categories?.indexOf(c)>= 0) || (c === "") || (!p.categories);
  return categories.map(c => ({
    category: c,
    nb: postList.filter(hasCategory(c)).length
  }));
}

function cleanAndDedupe(arrayWithDuplicateOrFalsyElements) {
  const arrayWithoutFalsies = arrayWithDuplicateOrFalsyElements.filter(x => !!x);
  return Array.from(new Set(arrayWithoutFalsies));
}

export function getPostForSlug(slug) {
  return POSTS.find(p => p.slug === slug);
}

export function getPostForDateSlug(slug) {
  const regexp_YYYY_MM_DD = /(\d){4}\/(\d){2}\/(\d){2}/;
  return regexp_YYYY_MM_DD.test(slug) ? getPostForSlug(slug) : undefined;
}

/**
 * The published posts closest to a post, for its "Read next" block: 3 points per shared tag,
 * 1 for a shared category, 1 for the same language, -2 for an archived (`obsolete`) post.
 * Ties go to the most recent post. Only what the block displays is returned.
 */
export function getRelatedPosts(slug, count = 3) {
  const post = getPostForSlug(slug);
  if (!post) return [];
  const words = (list) => new Set((list ?? []).map((w) => w.trim().toLowerCase()).filter(Boolean));
  const shared = (a, b) => [...words(a)].filter((w) => words(b).has(w)).length;
  return getPublishedPosts()
    .filter((other) => other.slug !== slug)
    .map((other) => ({
      other,
      score:
        3 * shared(post.tags, other.tags) +
        shared(post.categories, other.categories) +
        (post.metadata.lang === other.metadata.lang ? 1 : 0) -
        (other.metadata.obsolete ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score) // stable sort: getPublishedPosts is newest first
    .slice(0, count)
    .map(({ other }) => ({
      slug: other.slug,
      title: other.metadata.title,
      description: other.metadata.description,
      date: other.metadata.date,
      lang: other.metadata.lang,
    }));
}
