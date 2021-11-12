import { getPostForSlug } from '$lib/posts.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get({ params }) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { slug } = params;
  const post = getPostForSlug('alternate-reality/' + slug);

  if (post) {
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
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
