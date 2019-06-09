import { getPosts } from '../../_posts.js';

const lookup = new Map();
getPosts()
  .filter(p => p.slug.indexOf('2019/') >= 0)
  .forEach(post => {
    lookup.set(post.slug, JSON.stringify(post));
  });

export function get(req, res, next) {
  // the `month` and `day` parameters are available because
  // this file is called 2019/[month]/[day].json.js
  const { month, day } = req.params;
  const slug = `2019/${month}/${day}`;
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
