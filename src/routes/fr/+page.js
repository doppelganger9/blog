import { filterForLang, getPublishedPosts, getAllCategoriesOfPublishedPosts, getAllTagsOfPublishedPosts } from '$lib/posts';

export const prerender = true;

/**
 * Transform a post extracted from markdown to a usable view model.
 */
function mapStoredPostToViewablePost(storedPost) {
  return {
    title: storedPost.metadata.title,
    date: storedPost.metadata.dateString,
    description: storedPost.metadata.description,
    slug: 'fr/' + storedPost.slug,
    lang: storedPost.metadata.lang,
    minutesToRead: storedPost.minutesToRead,
    categories: storedPost.metadata.category,
    tags: storedPost.metadata.tags,
  };
}

/**
 * Loads all posts for the lang specified in the slug
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load() {
  // this appears during build and in the browser while `npx http-server build`
  //const publishedPosts = getPublishedPosts();
  const currentLang = 'fr';
  const publishedPosts = filterForLang(getPublishedPosts(), currentLang);
  const allTags = getAllTagsOfPublishedPosts(publishedPosts);
  const allCategories = getAllCategoriesOfPublishedPosts(publishedPosts);

  const contents = publishedPosts.map(mapStoredPostToViewablePost);
  console.log(`lang=fr / pages : ${contents.length} / tags: ${allTags.length} / categorie: ${allCategories.length}`);

  return {
    posts: contents,
    tags: allTags,
    categories: allCategories,
  };
}
