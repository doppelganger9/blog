import { getPosts, onlyPublishedPosts, onlyRealPosts } from './_posts.js';

const toExpectedListItem = post => ({
  title: post.title,
  date: post.dateString,
  description: post.description,
  slug: post.slug,
  minutesToRead: post.minutesToRead,
});

export async function get(req, res) {
  const allPosts = await getPosts();
  const posts = allPosts
    .filter(onlyPublishedPosts)
    .filter(onlyRealPosts)
    .map(toExpectedListItem);
  const contents = JSON.stringify(posts);

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(contents);
}
