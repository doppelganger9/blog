import { getPosts } from '../_posts.js';

const lookup = new Map();
getPosts().filter(p => p.slug.indexOf('alternate-reality/')>=0).forEach(post => {
  lookup.set(post.slug.split('alternate-reality/')[1], JSON.stringify(post));
});

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get({ params }) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { slug } = params;
  if (lookup.has(slug)) {
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: lookup.get(slug)
    };
  } else {
    return {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          message: `Not found`
        })
    };
  }
}
