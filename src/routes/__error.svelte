<script context="module">
	export function load({ error, status }) {
		return {
			props: { error, status }
		};
	}
</script>

<script>
  import TitleBar from '../components/TitleBar.svelte';
  import Favicons from '../components/Favicons.svelte';
	import { dev } from '$app/env';

	export let error, status;
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<Favicons/>
<TitleBar level="h3" />

<div class="col-md-9">
	<h1>{status}</h1>

	<p>{error.message}</p>

  {#if status == 404}
  <img
    src="https://static.tumblr.com/a602cadec102d22b9adfdd2ebe3c9e1d/av7hhsf/Gwmn2vshq/tumblr_static_tumblr_meh77bjsth1r2rg7vo1_500.gif"
    alt="TARDIS lost in space"
  />
  {/if}
  
	{#if dev && error.stack}
		<pre>{error.stack}</pre>
	{/if}
</div>

<style>
	h1,
	p {
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
