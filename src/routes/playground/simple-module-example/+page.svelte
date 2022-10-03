<script>
  import { onMount } from 'svelte';
  import TitleBar from '$lib/components/TitleBar.svelte';
  
  export let data;

  let { a } = data;
  let b = a;

  onMount(() => console.log('log from inside onMount.'));

  console.log('plain script JS code');
</script>

<TitleBar level="h3"></TitleBar>
<h1>Very simple example</h1>
<p>{b},{a}</p>
