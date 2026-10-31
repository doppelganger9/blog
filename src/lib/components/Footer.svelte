<script>
  import { i18n } from '#lib/stores/i18n.js';
  import Status from '#lib/components/Status.svelte';
  import { twemoji } from '#lib/twemoji.svelte.ts';
</script>

<style>
footer {
  text-align: center;
}
</style>

<footer use:twemoji data-cy='footer'>
  <p>
  © {new Date().getFullYear()} 
  -
  {$i18n`built with`} <a href="https://svelte.dev">Svelte</a> 
  {$i18n`and`} <a href='https://kit.svelte.dev'>SvelteKit</a> 
  -
  <a href='/privacy-policy'>🍪 {$i18n`Privacy Policy`}</a>
  -
  <Status/>
  </p>
</footer>
