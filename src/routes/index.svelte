<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`index.json`).then(r => r.json()).then(posts => {
      return { posts };
    });
  }
</script>

<script>
  import TitleBar from '../components/TitleBar.svelte';
  import ArticleFooter from '../components/ArticleFooter.svelte';

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
  }
</style>

<svelte:head>
  <title>David's Blog</title>
</svelte:head>

<TitleBar level='h1' />

<ArticleFooter />

<ul>
  {#each posts as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
        tell Sapper to load the data for the page as soon as
        the user hovers over the link or taps it, instead of
        waiting for the 'click' event -->
    <li>
      <h3><a rel='prefetch' href='{post.slug}'>{post.title}</a></h3>
      <div class='subtitle'><date>{post.date}</date> &dash; {post.minutesToRead}<br/></div>
      <p>{post.description}</p>
    </li>
  {/each}
</ul>
