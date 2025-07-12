<script lang="ts">
  import { onDestroy } from 'svelte';

  let bpm = 80;
  let originalBpm = bpm;
  let timeSignature = 4;
  let isRunning = false;
  let currentBeat = 0;
  let tempoStep = 5;
  let stepEveryXMeasures = 4;
  let beatCounter = 0;
  let measureCount = 0;
  let mute = false;
  let interval: ReturnType<typeof setInterval>;
  let circleEl: HTMLDivElement | null = null;

  function playSound(path: string) {
    if (mute) return;
    const audio = new Audio(path);
    audio.play().catch(() => {});
  }

  function tick() {
    const beat = currentBeat;

    if (beat === 2) {
      console.log('Accent beat');
      playSound('/tap.mp3');
    } else {
      playSound('/metronome.mp3');
    }

    if ((beat + 1) % timeSignature === 0) {
      beatCounter++;
      measureCount++;
      if (beatCounter % stepEveryXMeasures === 0) {
        bpm += tempoStep;
      }
    }

    currentBeat = (beat + 1) % timeSignature;

    // Reset animation by toggling the style
    if (circleEl) {
      circleEl.style.animation = 'none';
      // force reflow
      void circleEl.offsetHeight;
      circleEl.style.animation = '';
    }
  }

  function startMetronome() {
    stopMetronome();
    currentBeat = -1;
    beatCounter = 0;
    measureCount = 0;
    isRunning = true;
    tick();
    interval = setInterval(tick, 60000 / bpm);
  }

  function stopMetronome() {
    clearInterval(interval);
    isRunning = false;
  }

  function resetBpm() {
    bpm = originalBpm;
  }

  onDestroy(() => clearInterval(interval));
</script>

<style>
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 80vh;
    box-sizing: border-box;
  }

  .circle {
    width: 30vmin;
    height: 30vmin;
    border-radius: 50%;
    animation: pulse var(--pulse-duration, 1s) ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5vmin;
    /* color: white; */
    font-weight: bold;
  }

  .accent {
    background: radial-gradient(circle, rgba(255, 71, 87, 0.9), rgba(255, 87, 34, 0.6));
  }

  .sub-accent {
    background: radial-gradient(circle, rgba(249, 71, 255, 0.9), rgba(255, 34, 181, 0.6));
  }

  .non-accent {
    background: radial-gradient(circle, rgba(255, 179, 71, 0.8), rgba(255, 204, 51, 0.5));
  }

  .paused {
    background: radial-gradient(circle, rgba(73, 97, 255, 0.1), rgba(93, 204, 255, 0.1));
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(10); opacity: 1; }
    100% { transform: scale(1); opacity: 0.2; }
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    /* color: #fff; */
    backdrop-filter: blur(6px);
    width: fit-content;
  }

  input, button {
    font-size: 1rem;
  }

  .mesure {
    font-size: 1.5rem;
    margin: 0;
  }
  h1 {
    font-size: 5vw;
    margin: 0;
  }
</style>

<div class="page">
  <h1>🐙 Poupoulse 🐓 {bpm} BPM</h1>
  {#if isRunning}
    <div
      bind:this={circleEl}
      class="circle {currentBeat === 3 ? 'accent' : ( currentBeat === 1 ? 'sub-accent' : 'non-accent')}"
      style={`--pulse-duration: ${60000 / bpm}ms`}
    >
      {currentBeat + 1}
    </div>
  {:else}
    <div class="circle paused" style="--pulse-duration: 0s;">
      <span>⏸️</span>
    </div>
  {/if}

  <p class="mesure">Mesure : {measureCount}</p>

  <div class="controls">
    <label>BPM <input type="number" bind:value={bpm} /></label>
    <label>Mesure (temps) <input type="number" bind:value={timeSignature} min="1" /></label>
    <label>+{tempoStep} BPM tous les <input type="number" bind:value={stepEveryXMeasures} /> mesures</label>
    <label><input type="checkbox" bind:checked={mute} /> Mute</label>
    <button on:click={isRunning ? stopMetronome : startMetronome}>
      {isRunning ? 'Stop' : 'Start'}
    </button>
    <button on:click={resetBpm}>Reset BPM</button>
  </div>
</div>
