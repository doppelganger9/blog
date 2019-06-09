import { getPosts } from './_posts.js';

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

export function get(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(contents);
}
