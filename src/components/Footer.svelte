<script>
  import { i18n } from '../stores/_i18n.js';
  import Status from '../components/Status.svelte';
  import twemoji from 'twemoji';
</script>

<style>
footer {
  text-align: center;
}
</style>

<footer data-cy='footer'>
  <p>
  © {new Date().getFullYear()} 
  &dash; 
  {$i18n`built with`} <a href="https://svelte.dev">Svelte</a> 
  {$i18n`and`} <a href='https://sapper.svelte.dev'>Sapper</a> 
  &dash; 
  <a href='privacy-policy'>{@html twemoji.parse('🍪')} {$i18n`Privacy Policy`}</a>
  &dash;
  <Status/>
  </p>
</footer>
