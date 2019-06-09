<script>
  import Nav from '../components/Nav.svelte';
  import Footer from '../components/Footer.svelte';

  export let segment;
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

<Nav {segment}/>

<main>
  <slot></slot>
</main>

<Footer />
