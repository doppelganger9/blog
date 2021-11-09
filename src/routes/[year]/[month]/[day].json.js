import { getPosts } from '../../_posts.js';

const regexp = /(\d){4}\/(\d){2}\/(\d){2}/;

const lookup = new Map();
getPosts()
  .filter(p => regexp.test(p.slug))
  .forEach(post => {
    lookup.set(post.slug, JSON.stringify(post));
  });

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get({ params }) {
  // the `month` and `day` parameters are available because
  // this file is called [year]/[month]/[day].json.js
  const { year, month, day } = params;
  const slug = `${year}/${month}/${day}`;

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
          message: `2019 Blog Not found`
        })
    };
  }
}
