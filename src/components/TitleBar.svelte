<script>
  export let level = 'h1';
</script>
<style>
.title-bar h1 {
  font-size: 4rem;
  margin: 0 0 2rem 0;
}
.title-bar h1 a {
  box-shadow: none;
  text-decoration: none;
  color: inherit;
}
.title-bar h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
}
.title-bar h3 a {
  box-shadow: none;
  text-decoration: none;
  color: inherit;
}
</style>
<div class='title-bar'>
{#if level == 'h1'}
  <h1><a href='/'>David's Blog</a></h1>
{:else}
  <h3><a href='/'>David's Blog</a></h3>
{/if}
</div>
