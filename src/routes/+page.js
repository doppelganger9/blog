import { getPublishedPosts } from '$lib/posts';
import { getAllCategoriesOfPublishedPosts, getAllTagsOfPublishedPosts } from '../lib/posts';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load() {
  // this appears during build and in the browser while `npx http-server build`
  const publishedPosts = getPublishedPosts();
  const allTags = getAllTagsOfPublishedPosts();
  const allCategories = getAllCategoriesOfPublishedPosts();

  const contents = publishedPosts.map(post => {
    return {
      title: post.metadata.title,
      date: post.metadata.dateString,
      description: post.metadata.description,
      slug: post.slug,
      minutesToRead: post.minutesToRead,
      categories: post.metadata.category,
      tags: post.metadata.tags,
    };
  });
  return {
    posts: contents,
    tags: allTags,
    categories: allCategories,
  };
}
