<script lang="ts">
  import { twemoji } from "$lib/twemoji.svelte";

  export let data;
</script>

{#if data}
<ul use:twemoji class="tags" data-cy="tags">
  {#each data as d}
    <li>{d.tag}({d.nb})</li>
  {/each}
</ul>
{/if}

<style>
  .tags {
    list-style: none;
    margin: 0 0 1em 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    align-content: stretch;
    flex-direction: row;
  }
  .tags li {
    padding: 0.25em 0.5em;
    font-size: 9pt;
    margin: 0;
  }
</style>