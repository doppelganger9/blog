<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].html
    const res = await this.fetch(`future/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
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
    font-size: 1.4em;
    font-weight: 500;
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
  }

  .content :global(li) {
    margin: 0 0 0.5em 0;
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

  .content :global(h2) {
      margin-top: 4rem;
  }

</style>

<svelte:head>
  <title>{post.metadata.title}</title>
</svelte:head>

<h1>{post.metadata.title}</h1>
<p class='date'>{post.metadata.dateString}</p>
<p class='reading-time'>{post.minutesToRead}</p>

<div class='content'>
  {@html post.html}
</div>

<ArticleFooter />
