<script>
  import Footer from '../components/Footer.svelte';
  import Favicons from '../components/Favicons.svelte';
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
  <slot></slot>
</main>

<Footer />
