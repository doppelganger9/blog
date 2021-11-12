<script>
  import Footer from '$lib/components/Footer.svelte';
  import Favicons from '$lib/components/Favicons.svelte';
</script>

<style>
  main {
    position: relative;
    max-width: 42em;
    /*background-color: white;*/
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(img) {
    width: auto;
    max-width: 100%;
  }
</style>

<Favicons/>

<main>
  <slot />
</main>

<Footer />
