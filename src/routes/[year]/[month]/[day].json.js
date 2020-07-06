import { getPosts } from '../../_posts.js';

const regexp = /(\d){4}\/(\d){2}\/(\d){2}/;

const lookup = new Map();
getPosts()
  .filter(p => regexp.test(p.slug))
  .forEach(post => {
    lookup.set(post.slug, JSON.stringify(post));
  });

export function get(req, res, next) {
  // the `month` and `day` parameters are available because
  // this file is called [year]/[month]/[day].json.js
  const { year, month, day } = req.params;
  const slug = `${year}/${month}/${day}`;
  if (lookup.has(slug)) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(lookup.get(slug));
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      message: `2019 Blog Not found`
    }));
  }
}
