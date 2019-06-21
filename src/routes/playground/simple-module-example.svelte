<script context="module">
console.log('Hello, simple-module-example.svelte script module.')
const a = 'toto';
</script>

<script>
import { onMount } from 'svelte';
import TitleBar from '../../components/TitleBar.svelte';
let b = a;

onMount(() => console.log('log from inside onMount.'));

console.log('plain script JS code');
</script>

<TitleBar level="h3"></TitleBar>
<h1>Very simple example</h1>
<p>{b},{a}</p>
