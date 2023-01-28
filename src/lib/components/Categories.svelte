<script lang="ts">
  import { selectedCategory } from "$lib/stores/category"
  import { i18n } from "$lib/stores/i18n"

  export let data;
  export let mode: "horizontal"|"vertical" = "horizontal"; // or "vertical"

  function selectCategory(category) {
    selectedCategory.set(category);
  }
</script>

<ul data-cy="categories" class="categories {mode}">
  {#each data as d}
    <li on:keyup={() => selectCategory(d?.category)} on:click={() => selectCategory(d?.category)} class:category={true} class:selected={$selectedCategory === d?.category}>{d && d.category ? $i18n`${d.category}`:$i18n`All`} ({d.nb})</li>
  {/each}
</ul>

<style>
  .categories.horizontal {
    list-style: none;
    margin: 0 0 3em 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .categories.vertical {
    list-style: none;
    margin: 0 0 3em 0;
    padding: 1em;
    height: 20em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .category {
    margin: 0 2px;
    padding: 5px 10px;
    box-sizing: border-box;
    border-bottom: 3px solid transparent;
    transition: all .5s;
  }
  .category:hover {
    border-bottom: 3px solid blueviolet;
    background-color: white;
    color: blueviolet;
  }
  .category.selected {
    border-bottom: 3px solid #ff5e00;
    background-color: white;
    color: #ff5e00;
  }
</style>