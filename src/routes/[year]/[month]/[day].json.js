import { getPostForDateSlug } from '$lib/posts.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get({ params }) {
  // the `month` and `day` parameters are available because
  // this file is called [year]/[month]/[day].json.js
  const { year, month, day } = params;
  const slug = `${year}/${month}/${day}`;

  const post = getPostForDateSlug(slug);

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
          message: `2019 Blog Not found`
        })
    };
  }
}
