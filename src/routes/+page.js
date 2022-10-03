import { getPublishedPosts } from '$lib/posts';

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export function load() {
  // this appears during build and in the browser while `npx http-server build`
  const publishedPosts = getPublishedPosts();
  const contents = publishedPosts.map(post => {
    return {
      title: post.metadata.title,
      date: post.metadata.dateString,
      description: post.metadata.description,
      slug: post.slug,
      minutesToRead: post.minutesToRead,
    };
  });
  return {
    posts: contents
  };
}
