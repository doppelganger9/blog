<script lang="ts">
  let count = 0;

  const increment = () => count++;
</script>
<svelte:options tag="sample-custom-element" />

<div role="button" tabindex=0 on:click={increment} on:keyup={increment}>Counter: {count}</div>

<style>
  div {
    color: white;
    background-color: blueviolet;
    display: block;
    padding: 1em;
    user-select: none; 
    text-align: center;
  }
</style>