// server load: the list of posts is computed when prerendering, the browser only gets this data
import { getPublishedPosts, getAllCategoriesOfPublishedPosts, getAllTagsOfPublishedPosts } from '#lib/posts.js';

export const prerender = true;

/**
 * Transform a post extracted from markdown to a usable view model.
 */
function mapStoredPostToViewablePost(storedPost) {
  return {
    title: storedPost.metadata.title,
    date: storedPost.metadata.dateString,
    description: storedPost.metadata.description,
    slug: storedPost.slug,
    lang: storedPost.metadata.lang,
    minutesToRead: storedPost.minutesToRead,
    categories: storedPost.metadata.category,
    tags: storedPost.metadata.tags,
  };
}

/**
 * @type {import('./$types').PageServerLoad}
 */
export function load() {
  const publishedPosts = getPublishedPosts();
  const allTags = getAllTagsOfPublishedPosts(publishedPosts);
  const allCategories = getAllCategoriesOfPublishedPosts(publishedPosts);

  const contents = publishedPosts.map(mapStoredPostToViewablePost);

  return {
    posts: contents,
    tags: allTags,
    categories: allCategories,
  };
}
