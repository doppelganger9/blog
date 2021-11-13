//import { computeMinutesToRead } from "$lib/minutesToRead";

export const slugFromPath = (path) => path.match(/\/src\/posts\/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

// mdsvex exposes all posts as modules we can import dynamically
const imports = import.meta.globEager(`/src/posts/*.{md,svx,svelte.md}`);
const posts = [];

for (const path in imports) {
  const postModule = imports[path];
  if (postModule) {
    const slug = slugFromPath(path);

    const alternateSlug = postModule.metadata.slug;
    const component = postModule.default;
    //const rendered = component.render();
    //const minutesToRead = computeMinutesToRead(rendered.html); // Error with static server
    const date = new Date(postModule.metadata.date);
    const lang = postModule.metadata.lang || 'en';
    const dateString = date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    posts.push({
      path,
      slug: alternateSlug || slug, // possibilité de surcharger le slug via le frontmatter
      metadata: {...postModule.metadata, dateString},
      //html: undefined now
      //minutesToRead,
      component,
    });
  }
}

// sort posts by date
posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

export function getPublishedPosts() {
  const publishedPosts = posts.filter(p => p.metadata.published); // mdsvex make it a real boolean!
  const notPostsFromFutureOrAlternateReality = publishedPosts
    .filter(p => p.slug.indexOf('future/') < 0 && p.slug.indexOf('alternate-reality/') < 0);
  return notPostsFromFutureOrAlternateReality;
}

export function getPostForSlug(slug) {
  return posts.find(p => p.slug === slug);
}

export function getPostForDateSlug(slug) {
  const regexp_YYYY_MM_DD = /(\d){4}\/(\d){2}\/(\d){2}/;
  return regexp_YYYY_MM_DD.test(slug) ? getPostForSlug(slug) : undefined;
}

export function loadPostForSlug(slug) {
  const post = getPostForSlug(slug);
  if (!post) {
    return {
      status: 404,
      error: new Error('Oh no! The requested page could not be found.')
    };
  }

  return {
    props: {
      post
    }
  };  
}