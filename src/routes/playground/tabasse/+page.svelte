<script lang="ts">
  import Fretboard from '$lib/components/Fretboard.svelte';
  
  // États réactifs pour piloter le manche
  let selectedRoot = $state("E");
  let selectedScale = $state("minor pentatonic");
  let frets = $state(15);

  const roots = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const scales = ["major", "minor", "major pentatonic", "minor pentatonic", "dorian", "mixolydian"];
</script>

<main class="container">
  <h1>TaBasse: Visualiseur de Basse</h1>

  <div class="controls">
    <label>
      Tonalité :
      <select bind:value={selectedRoot}>
        {#each roots as r}
          <option value={r}>{r}</option>
        {/each}
      </select>
    </label>

    <label>
      Gamme :
      <select bind:value={selectedScale}>
        {#each scales as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </label>

    <label>
      Cases :
      <input type="range" min="12" max="24" bind:value={frets} />
      <span>{frets}</span>
    </label>
  </div>

  <hr />

  <div class="fretboard-wrapper">
    <Fretboard 
      root={selectedRoot} 
      scaleType={selectedScale} 
      fretCount={frets} 
    />
  </div>
</main>

<style>
  .container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: sans-serif;
  }

  .controls {
    display: flex;
    gap: 20px;
    margin-bottom: 2rem;
    align-items: center;
    background: #f4f4f4;
    padding: 1rem;
    border-radius: 8px;
  }

  .fretboard-wrapper {
    margin-top: 3rem;
    /* Permet le défilement horizontal sur mobile */
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  select, input {
    margin-left: 0.5rem;
    padding: 0.4rem;
  }
</style>