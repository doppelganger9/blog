<script>
  import TitleBar from '../components/TitleBar.svelte';

  export let status;
  export let error;

  const dev = process.env.NODE_ENV === 'development';
</script>

<style>
  h1, p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<TitleBar level="h3" />

<h1>{error.message}</h1>
<h2>{status}</h2>

{#if status == 404}
<img
  src="https://static.tumblr.com/a602cadec102d22b9adfdd2ebe3c9e1d/av7hhsf/Gwmn2vshq/tumblr_static_tumblr_meh77bjsth1r2rg7vo1_500.gif"
  alt="TARDIS lost in space"
/>
{/if}

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
