<script lang="ts">
  import { selectedCategory } from "$lib/stores/category"
  import { i18n, registerMoreLabels } from "$lib/stores/i18n"

  let categories = ["", "Dev", "TTRPG", "Musique", "Famille", "Sport", "Agile", "Gaming"]; 
  // TODO récupérer la liste des category de l'ensemble des posts...
  // TODO récupérer le nombre de post pour chaque Category
  export let mode: "horizontal"|"vertical" = "horizontal"; // or "vertical"

  registerMoreLabels({
    "en": {
      "Dev": "Code",
      "Famille": "Family",
      "Musique": "Music",
      "Sport": "Sports"
    },
    "fr": {
      "TTRPG": "JdR",
    }
  });

  function selectCategory(category) {
    selectedCategory.set(category);
  }
</script>

<ul data-cy="categories" class="categories {mode}">
  {#each categories as category}
    <li on:keyup={() => selectCategory(category)} on:click={() => selectCategory(category)} class:category={true} class:selected={$selectedCategory === category}>{category ? $i18n`${category}`:$i18n`All`}</li>
  {/each}
</ul>

<style>
  .categories.horizontal {
    list-style: none;
    margin: 0 0 3em 0;
    padding: 1em;
    height: 2em;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .categories.vertical {
    list-style: none;
    margin: 0 0 3em 0;
    padding: 1em;
    height: 20em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .category {
    margin: .25em;
    padding: .25em 1em;
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