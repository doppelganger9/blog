<script>
  import TitleBar from '$lib/components/TitleBar.svelte';
  import Favicons from '$lib/components/Favicons.svelte';
</script>

<svelte:head>
  <title>404</title>
</svelte:head>
<Favicons/>
<TitleBar level="h3" />

<div class="col-md-9">
  <h1>404</h1>
  <h2>Not Found</h2>

  <img
    src="https://static.tumblr.com/a602cadec102d22b9adfdd2ebe3c9e1d/av7hhsf/Gwmn2vshq/tumblr_static_tumblr_meh77bjsth1r2rg7vo1_500.gif"
    alt="TARDIS lost in space"
  />
</div>

<style>
  h1 {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
