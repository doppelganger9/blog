import { getPosts } from '$lib/posts.js';

const contents = JSON.stringify(getPosts()
  .filter(it => it.metadata.published == 'true')
  .filter(p => p.slug.indexOf('future/') < 0 && p.slug.indexOf('alternate-reality/') < 0)
  .map(post => {
  return {
    title: post.metadata.title,
    date: post.metadata.dateString,
    description: post.metadata.description,
    slug: post.slug,
    minutesToRead: post.minutesToRead,
  };
}));

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get({ params }) {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: contents
  };
}
