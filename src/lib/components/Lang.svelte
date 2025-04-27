<script>
  import { get } from 'svelte/store';
  import { switchLang, lang } from '$lib/stores/i18n.js';
  import { onMount } from 'svelte';

  onMount(() => {
    const currentLang = get(lang);
    if (!currentLang) {
      const browserLang = navigator.language.split('-')[0];
      switchLang(browserLang);
    } else {
      switchLang(currentLang);
    }
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
<button data-cy='switch-lang-button' on:click={() => switchLang('en')}>🇫🇷 ➡️ 🇺🇸</button>
{:else if $lang === 'en'}
<button data-cy='switch-lang-button' on:click={() => switchLang('fr')}>🇺🇸 ➡️ 🇫🇷</button>
{/if}
