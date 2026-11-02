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
