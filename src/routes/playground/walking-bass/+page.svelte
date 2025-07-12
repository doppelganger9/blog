<script lang="ts">
  import WalkingBassEditor from '$lib/components/WalkingBassEditor.svelte';
</script>

<main class="page">
  <h1>Walking Bass Playground</h1>
  <WalkingBassEditor />
</main>

<style>
  .page {
    padding: 2rem;
    font-family: system-ui, sans-serif;
    background: #fdf6f0;
    color: #333;
  }
  h1 {
    color: #c27ba0; /* pastel violet */
  }
</style>