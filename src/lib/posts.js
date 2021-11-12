import { createPostsFromMarkdownFilesInDirectory } from "$lib/posts-db";

const WHERE_ALL_THE_MARKDOWN_BLOG_POSTS_ARE = './src/posts';
const allPosts = createPostsFromMarkdownFilesInDirectory(WHERE_ALL_THE_MARKDOWN_BLOG_POSTS_ARE);

export function getPosts() {
  return allPosts;
}
 
export function getPublishedPosts() {
  return getPosts()
    .filter(it => it.metadata.published == 'true')
    .filter(p => p.slug.indexOf('future/') < 0 && p.slug.indexOf('alternate-reality/') < 0);
}

export function getPostForSlug(slug) {
  return getPosts().find(p => p.slug === slug);
}

export function getPostForDateSlug(slug) {
  const regexp_YYYY_MM_DD = /(\d){4}\/(\d){2}\/(\d){2}/;
  return regexp_YYYY_MM_DD.test(slug) ? getPostForSlug(slug) : undefined;
}