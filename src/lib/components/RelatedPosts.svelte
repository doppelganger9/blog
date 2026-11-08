<script>
  // "Read next" block at the end of a post: the closest published posts (#lib/posts.js getRelatedPosts),
  // in the post's language. Clicks are counted as a GoatCounter event (related) to see if it helps.
  import { twemoji } from '#lib/twemoji.svelte.ts';

  let { posts = [], lang = 'en', slug } = $props();

  const fr = $derived(lang === 'fr');
  const flags = { en: '🇬🇧', fr: '🇫🇷' };
  // year and month only: the day could differ between the prerender and the visitor's time zone
  const when = (date) => new Date(date).toLocaleDateString(lang, { year: 'numeric', month: 'long' });

  function track() {
    window.goatcounter?.count?.({ path: 'related', title: `/${slug}`, event: true });
  }
</script>

<style>
  .related {
    margin: 3rem 0 0;
  }
  h2 {
    margin: 0 0 1rem;
    font-size: 1.4rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    margin: 0 0 1.25rem;
    line-height: 1.4;
  }
  a {
    font-weight: 700;
  }
  .meta {
    display: block;
    color: #777;
    font-size: 0.8rem;
  }
  .description {
    margin-top: 0.25rem;
    font-size: 0.9rem;
    line-height: 1.5;
    /* some descriptions are long: two lines at most */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

{#if posts.length}
  <nav use:twemoji class='related' data-cy='blog-post-related' aria-labelledby='related-heading'>
    <h2 id='related-heading'>{fr ? 'À lire aussi' : 'Read next'}</h2>
    <ul>
      {#each posts as post (post.slug)}
        <li>
          <a href='/{post.slug}' hreflang={post.lang} onclick={track}>{post.title}</a>
          <span class='meta'>
            {when(post.date)}{#if post.lang !== lang}&nbsp;· <span title={post.lang === 'fr' ? 'en français' : 'in English'}>{flags[post.lang] ?? post.lang}</span>{/if}
          </span>
          {#if post.description}<span class='description'>{post.description}</span>{/if}
        </li>
      {/each}
    </ul>
  </nav>
{/if}
