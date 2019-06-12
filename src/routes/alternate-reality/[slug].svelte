<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].html
    const res = await this.fetch(`alternate-reality/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import TitleBar from '../../components/TitleBar.svelte';
  import Separator from '../../components/Separator.svelte';
  import ArticleFooter from '../../components/ArticleFooter.svelte';

  export let post;
</script>

<style>
  /*
    By default, CSS is locally scoped to the component,
    and any unused styles are dead-code-eliminated.
    In this page, Svelte can't know which elements are
    going to appear inside the {{{post.html}}} block,
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


</style>

<svelte:head>
  <title>{post.metadata.title}</title>
  <meta name="description" content="{post.metadata.description}" />
  <meta name="keywords" content="sapper,svelte,blog,david,lacourt,developpeur,developer,gatsbyjs,gatsby,{post.metadata.keywords}"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://lacourt.dev/{post.slug}">
  <meta property="og:title" content="{post.metadata.title}">
  <meta property="og:description" content="{post.metadata.description}">
  {#if post.metadata.thumb}
  <meta property="og:image" content="{post.metadata.thumb}">
  {/if}

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://lacourt.dev/{post.slug}">
  <meta property="twitter:title" content="{post.metadata.title}">
  <meta property="twitter:description" content="{post.metadata.description}">
  {#if post.metadata.thumb}
  <meta property="twitter:image" content="{post.metadata.thumb}">
  {/if}

</svelte:head>

<TitleBar level='h3' />

<h1>{post.metadata.title}</h1>
<p class='date'>{post.metadata.dateString}</p>
<p class='reading-time'>{post.minutesToRead}</p>

<div class='content'>
  {@html post.html}
</div>

<Separator />
<ArticleFooter />
