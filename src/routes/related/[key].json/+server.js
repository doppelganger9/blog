// The related posts of a post, as a small static JSON file per post (/related/2019_06_16.json),
// fetched by the post page's load: the full list of posts stays on the server.
import { json } from '@sveltejs/kit';
import { getRelatedPosts } from '#lib/posts.js';
import { slugFromRelatedPostsKey } from '#lib/post.js';

export const prerender = true;

/** @type {import('@sveltejs/kit').RequestHandler} */
export function GET({ params }) {
  return json(getRelatedPosts(slugFromRelatedPostsKey(params.key)));
}
