<script context="module">
/**
 * @type {import('@sveltejs/kit').Load}
 */
export async function load({ page, fetch, session, stuff }) {
  const res = await fetch(`/index.json`);
  
  if (res.ok) {
    return {
      props: {
        posts: await res.json()
      }
    };
  }

  return {
    status: res.status,
    error: new Error(`No data found for posts`)
  }
}
</script>

<script>
  import TitleBar from '../components/TitleBar.svelte';
  import ArticleFooter from '../components/ArticleFooter.svelte';
  import { i18n } from '../stores/_i18n.js';
  import { siteUrl } from '../stores/_config.js';

  export let posts;
</script>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
  h3 {
    font-family: Georgia, 'Times New Roman', Times, serif;
    color: #ff5e00;
    font-size: 18pt;
    margin: 0 0 .3em 0;
  }
  div.subtitle {
    font-size: 9pt;
    margin-bottom: 1em;
    display: block;
  }
  li p {
    font-size: 12pt;
  }
  li a {
    box-shadow: none;
    text-decoration: none;
    color: inherit;
  }
</style>

<svelte:head>
  <title>{$i18n`title`}</title>

  <meta name="description" content="David Lacourt's Blog. Posts about web technology, modern JavaScript frameworks, Agile methodologies, Software Craftmanship." />
  <meta name="keywords" content="sveltekit,svletekit,svlete-kit,svelte-kit,sapper,saper,sappr,svelte,sevlte,svetle,blog,david,dave,lacourt,lacour,la cour,la court,developpeur,developer,daveloper,devloper,devlopr,gatsbyjs,gatsby,gatsbi,gastby"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{siteUrl}/">
  <meta property="og:title" content="{$i18n`title`}">
  <meta property="og:description" content="David Lacourt's Blog. Posts about web technology, modern JavaScript frameworks, Agile methodologies, Software Craftmanship.">
  <meta property="og:image" content="{siteUrl}/profile-pic.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="{siteUrl}/">
  <meta property="twitter:title" content="{$i18n`title`}">
  <meta property="twitter:description" content="David Lacourt's Blog. Posts about web technology, modern JavaScript frameworks, Agile methodologies, Software Craftmanship.">
  <meta property="twitter:image" content="{siteUrl}/profile-pic.png">
</svelte:head>

<TitleBar level='h1' />

<ArticleFooter />

<ul data-cy="blog-posts-list">
  {#each posts as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
        tell SvelteKit to load the data for the page as soon as
        the user hovers over the link or taps it, instead of
        waiting for the 'click' event -->
    <li data-cy="blog-posts-item">
      <a rel='prefetch' href='{post.slug}'>
        <h3>{post.title}</h3>
        <div class='subtitle'><date>{post.date}</date> - {post.minutesToRead}<br/></div>
        <p>{post.description}</p>
      </a>
    </li>
  {/each}
</ul>
