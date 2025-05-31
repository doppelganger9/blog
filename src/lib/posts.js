import { computeMinutesToRead } from "$lib/minutesToRead";
import { error } from '@sveltejs/kit';

const POSTS = _loadPosts();

function _loadPosts() {
  const slugFromPath = (path) => path.match(/\/src\/posts\/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

  // mdsvex exposes all posts as modules we can import dynamically
  const imports = import.meta.glob(`/src/posts/*.{md,svx,svelte.md}`, {eager: true});
  const posts = [];

  for (const path in imports) {
    const postModule = imports[path];
    if (postModule) {
      const slug = slugFromPath(path);

      const alternateSlug = postModule.metadata.slug;
      const component = postModule.default;
      const wordCount = postModule.metadata.wordCount;
      const date = new Date(postModule.metadata.date);
      const lang = postModule.metadata.lang || 'en';
      const categories = postModule.metadata.category?.split(/, ?/);
      const tags = postModule.metadata.tags?.split(/, ?/);
      const minutesToRead = computeMinutesToRead(wordCount, 180, lang);
      const dateString = date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      posts.push({
        path,
        slug: alternateSlug || slug, // possibilité de surcharger le slug via le frontmatter
        metadata: {...postModule.metadata, dateString, lang},
        //html: undefined now
        minutesToRead,
        categories,
        tags,
        component,
      });
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

export function loadPostForSlug(slug) {
  const post = getPostForSlug(slug);
  if (!post) {
    error(404, 'Oh no! The requested page could not be found.');
  }

  return post;
}