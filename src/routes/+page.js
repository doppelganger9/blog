import { getPublishedPosts } from '$lib/posts';
import { getAllCategoriesOfPublishedPosts, getAllTagsOfPublishedPosts } from '../lib/posts';

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
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load() {
  // this appears during build and in the browser while `npx http-server build`
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
