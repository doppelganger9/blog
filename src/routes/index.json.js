import { getPublishedPosts } from '$lib/posts.js';

const contents = getPublishedPosts().map(post => {
  return {
    title: post.metadata.title,
    date: post.metadata.dateString,
    description: post.metadata.description,
    slug: post.slug,
    minutesToRead: post.minutesToRead,
  };
});

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get({ params }) {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contents)
  };
}
