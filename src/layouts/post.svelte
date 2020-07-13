<script context="module">
/**
 * This module script is for exporting custom HTML tag overrides.
 * see https://mdsvex.com/docs#custom-components
 */
</script>

<script>
  import TitleBar from '../components/TitleBar.svelte';
  import Separator from '../components/Separator.svelte';
  import ArticleFooter from '../components/ArticleFooter.svelte';
  
  import { onMount } from 'svelte';

  import { siteUrl } from '../stores/_config.js';
  import { processDate } from '../routes/_date.js';
  import { computeMinutesToRead } from '../routes/_minutesToRead.js';

  import twemoji from 'twemoji';

  // all the following will be injected as Layout metadata from FrontMatter SVX parsed values.
  export let title;
  export let thumb;
  export let slug;
  export let description;
  export let keywords;

  export let lang;
  export let date;
  // data derived from post FrontMatter metadata
  let dateString = processDate({lang, date});

  // Did not find how to derive a value from post contents unless making a JSON route with data and preload it.
  let contentNode; // bound to a div to access the HTML Node innerText.
  let minutesToRead;
  onMount(() => {
		minutesToRead = computeMinutesToRead(contentNode.textContent);
  });
  
  // hack for adding location onto anchor links bc of base element
  onMount(async () => {
    ;[...document.querySelectorAll('a[href^="#"]')].map(
      x => (x.href = document.location + new URL(x.href).hash)
    )
  });
</script>

<style>
  /*
    By default, CSS is locally scoped to the component,
    and any unused styles are dead-code-eliminated.
    In this page, Svelte can't know which elements are
    going to appear inside the <slot> block,
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

  .content :global(pre) {
    background-color: #f9f9f9;
    box-shadow: inset 1px 1px 5px rgba(0,0,0,0.05);
    padding: 0.5em;
    border-radius: 2px;
    overflow-x: auto;
  }

  .content :global(pre) :global(code) {
    background-color: transparent;
    padding: 0;
  }

  .content :global(ul) {
    line-height: 1.5;
    list-style-type: disc;
    margin: 0 0 1.75rem 0;
  }

  .content :global(li) {
    margin: 0 0 0.875rem 0;
  }

  p.reading-time {
    margin: 0 0 4rem 0;
    font-size: 8pt;
  }

  p.date {
      margin: 0 0 .5rem 0;
      font-size: 10pt;
  }

  h1 {
      font-size: 2.5rem;
      margin: 0 0 .5rem 0;
  }

  :global(img.emoji) {
    width: 1em;
  }
</style>

<svelte:head>
  <title>{slug} - {title}</title>
  <meta name="description" content="{description}" />
  <meta name="keywords" content="sapper,saper,sappr,svelte,sevlte,svetle,blog,david,dave,lacourt,lacour,la cour,la court,developpeur,developer,daveloper,devloper,devlopr,gatsbyjs,gatsby,gatsbi,gastby,{keywords}"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{siteUrl}/{slug}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  {#if thumb}
  <meta property="og:image" content="{thumb}">
  {/if}

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="{siteUrl}/{slug}">
  <meta property="twitter:title" content="{title}">
  <meta property="twitter:description" content="{description}">
  {#if thumb}
  <meta property="twitter:image" content="{thumb}">
  {/if}
</svelte:head>

<TitleBar level='h3' />

<h1 data-cy='blog-post-heading'>{@html twemoji.parse(title)}</h1>
<p data-cy='blog-post-date' class='date'>{dateString}</p>
<p data-cy='blog-post-readtime' class='reading-time'>{minutesToRead}</p>

<div data-cy='blog-post-content' class='content' bind:this={contentNode}>
<slot>
</slot>
</div>

<Separator />
<ArticleFooter />
