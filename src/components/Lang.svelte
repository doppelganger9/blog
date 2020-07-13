<script>
  import { switchLang, lang, i18n } from '../stores/_i18n.js';
  import { onMount } from 'svelte';
  import twemoji from 'twemoji';

  onMount(() => {
    switchLang(navigator.language.split('-')[0]);
  })

</script>

<style>
  button {
    color: #ff5e00;
    border: none;
    background: transparent;
    border-radius: 5px;
    border: 1px solid #ff5e00;
    vertical-align: top;
    margin: 1em;
    position: absolute;
    top: 0;
    right: 0;
  }
  button:hover {
    font-weight: bolder;
    background-color: #ff5e00;
  }
  button:focus {outline:0;}
</style>

{#if $lang === 'fr'}
<button data-cy='switch-lang-button' aria-label="{$i18n`switch to English`}" on:click={() => switchLang('en')}>{@html twemoji.parse('🇫🇷 ➡️ 🇺🇸')}</button>
{:else if $lang === 'en'}
<button data-cy='switch-lang-button' aria-label="{$i18n`switch to French`}" on:click={() => switchLang('fr')}>{@html twemoji.parse('🇺🇸 ➡️ 🇫🇷')}</button>
{/if}
