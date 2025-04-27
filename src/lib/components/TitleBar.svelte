<script>
  import { i18n } from '$lib/stores/i18n.js';

  // Add prism in the Title Bar
  import Prism from 'prismjs';
  import 'prism-svelte';

  export let level = 'h1';
</script>
<style>
.title-bar h1 {
  font-size: 4rem;
  margin: 0 0 2rem 0;
}
.title-bar h1 a {
  box-shadow: none;
  text-decoration: none;
  color: inherit;
}
.title-bar h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
}
.title-bar h3 a {
  box-shadow: none;
  text-decoration: none;
  color: inherit;
}
</style>
<div class='title-bar' data-cy='title-bar'>
{#if level == 'h1'}
  <h1><a href='/'>{$i18n`title`}</a></h1>
{:else}
  <h3><a href='/'>{$i18n`title`}</a></h3>
{/if}
</div>
