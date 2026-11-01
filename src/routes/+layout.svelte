<script>
  import Footer from '#lib/components/Footer.svelte';
  import Favicons from '#lib/components/Favicons.svelte';
  import { afterNavigate } from '$app/navigation';
  import { tick } from 'svelte';

  // GoatCounter (src/app.html) counts the first page view when count.js loads; the pages
  // opened afterwards by the client-side router are counted here.
  afterNavigate(async ({ type, from, to }) => {
    if (type === 'enter' || !from || !to || !window.goatcounter?.count) return;
    if (from.url.pathname === to.url.pathname && from.url.search === to.url.search) return; // anchors
    await tick(); // lets <svelte:head> update the title
    window.goatcounter.count({
      path: to.url.pathname + to.url.search,
      referrer: from.url.href,
      title: document.title,
    });
  });
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
