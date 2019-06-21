<script>
	import FallingEmojis from '../../components/FallingEmojis.svelte';

	export let characters = ['💎', '💵', '💶', '💰', '💷', '💴'];
	export let numberOfFallingItems = 50;

</script>

<style>
  div {
    height: 92vh;
  }

</style>

<div>
<FallingEmojis {characters} {numberOfFallingItems} />
</div>
