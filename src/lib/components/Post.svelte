<script>
  import TitleBar from '#lib/components/TitleBar.svelte';
  import Separator from '#lib/components/Separator.svelte';
  import ArticleFooter from '#lib/components/ArticleFooter.svelte';
  import AddGiscusScript from './AddGiscusScript.svelte';
  import ContactBlock from '#lib/components/ContactBlock.svelte';
  
  import { siteUrl } from '#lib/stores/config.js';
  import { i18n } from '#lib/stores/i18n.js';
  import { twemoji } from '#lib/twemoji.svelte.ts';

  export let post;
</script>

<style>
  h1 {
      font-size: 2.5rem;
      margin: 0 0 .5rem 0;
  }

  /*
    By default, CSS is locally scoped to the component,
    and any unused styles are dead-code-eliminated.
    In this page, Svelte can't know which elements are
    going to appear inside the <slot/> block,
    so we have to use the :global(...) modifier to target
    all elements inside .content
  */
  .content :global(h2) {
    font-size: 1.8em;
    font-weight: 900;
  }

  .content :global(h3) {
    font-size: 1.4rem;
  }

  .content :global(ul) {
    line-height: 1.5;
    list-style-type: disc;
    margin: 0 0 1.75rem 0;
  }

  .content :global(li) {
    margin: 0 0 0.875rem 0;
  }

  .reading-time {
    margin: 0 0 4rem 0;
    font-size: 8pt;
    grid-row: 2;
    grid-column: 1;
  }

  .date {
    margin: 0 0 .5rem 0;
    font-size: 10pt;
    grid-row: 1;
    grid-column: 1;
  }

  .categories {
    font-size: 10pt;
    margin: 0;
    padding: 0 2em 0 0;
    grid-row: 1 / 2;
    grid-column: 2;
  }
  .obsolete {
    margin: -2.5rem 0 2rem;
    padding: 0.75rem 1rem;
    border: 1px solid hsl(35, 80%, 60%);
    border-left: 0.32813rem solid hsl(35, 80%, 50%);
    border-radius: 4px;
    background: hsl(40, 100%, 96%);
    color: #333;
    font-size: 0.9rem;
  }
  .metadata {
    display: grid;
    justify-content: space-between;
    align-items: start;
    justify-items: stretch;
  }

</style>

<svelte:head>
  <title>{post.slug} - {post.metadata.title}</title>
  <meta name="description" content="{post.metadata.description}" />
  <meta name="keywords" content="sapper,saper,sappr,svelte,sevlte,svetle,blog,david,dave,lacourt,lacour,la cour,la court,developpeur,developer,daveloper,devloper,devlopr,gatsbyjs,gatsby,gatsbi,gastby,{post.metadata.keywords}"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{siteUrl}/{post.slug}">
  <meta property="og:title" content="{post.metadata.title}">
  <meta property="og:description" content="{post.metadata.description}">
  {#if post.metadata.thumb}
  <meta property="og:image" content="{post.metadata.thumb}">
  {/if}

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="{siteUrl}/{post.slug}">
  <meta property="twitter:title" content="{post.metadata.title}">
  <meta property="twitter:description" content="{post.metadata.description}">
  {#if post.metadata.thumb}
  <meta property="twitter:image" content="{post.metadata.thumb}">
  {/if}
</svelte:head>

<AddGiscusScript />

<TitleBar level='h3' />

<h1 use:twemoji data-cy='blog-post-heading'>{post.metadata.title}</h1>

<div class='metadata'>
  <div data-cy='blog-post-date' class='date'>{post.metadata.dateString}</div>
  <div data-cy='blog-post-readtime' class='reading-time'>{#if post.minutesToRead}{post.minutesToRead}{/if}</div>
  <!-- TODO : faire un composant comme la liste des categories qui au clic renvoie sur la liste en selectionnant la categorie cliquée -->
  <div use:twemoji data-cy='blog-post-categories' class='categories'>{post.metadata.category ?? $i18n`None`}</div>
</div>

{#if post.metadata.obsolete}
  <!-- `obsolete:` frontmatter field: posts about tools or a stack that no longer apply, kept for history -->
  <aside class='obsolete' data-cy='blog-post-obsolete' role='note'>
    {#if post.metadata.lang === 'fr'}
      <strong>📦 Article archivé.</strong> {post.metadata.obsolete} Il est conservé pour l'historique.
    {:else}
      <strong>📦 Archived post.</strong> {post.metadata.obsolete} It is kept for history.
    {/if}
  </aside>
{/if}

<div data-cy='blog-post-content' class='content'>
  <svelte:component this="{post.component}" />
</div>

<ContactBlock slug={post.slug} title={post.metadata.title} lang={post.metadata.lang} />

<div id="comments" class="giscus"></div>

<Separator />
<ArticleFooter />
