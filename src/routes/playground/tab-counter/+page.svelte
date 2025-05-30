<script lang="ts">
  import { Timer } from "$lib/chrono";
  import { onMount } from "svelte";
  import { favicon } from "$lib/stores/favicon";

  // CORRECT WAY to define props with default values and expose as attributes
  // The default value for the prop itself is handled by JavaScript's destructuring default.
  // The `attribute: true` option is passed directly to the prop definition,
  // indicating it should sync with an HTML attribute.
  const {
    showHelp = "true", // JavaScript default value
    updateTitleWithTimeElapsed = "true" // JavaScript default value
  } = $props<{
    showHelp?: string; // Mark as optional as it might not be provided via prop or attribute
    updateTitleWithTimeElapsed?: string; // Mark as optional
  }, {
    attribute: true; // This applies to ALL props in this $props() block
  }>();

  let suffix = $state("⏹");
  let title = $state("00:00");
  let t = $state<Timer | undefined>(undefined); // Typage avec undefined car il est initialisé plus tard
  let intervalHandler: ReturnType<typeof setInterval> | undefined = $state(undefined);
  let perf: Performance | undefined = $state(undefined);

  function formatElapsed(elapsed: number) {
    let minutes = Math.floor(elapsed / (60 * 1000));
    let seconds = Math.floor((elapsed % (60 * 1000)) / 1000);
    let text = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    return text;
  }

  const stopTimer = () => {
    if (t) { // Vérifier si t est défini avant d'appeler stop()
      t.stop();
      title = formatElapsed(t.elapsed);
    }
    suffix = "⏸";
    if (intervalHandler) {
      clearInterval(intervalHandler);
      intervalHandler = undefined; // Réinitialiser pour éviter de le conserver
    }
  };

  const continueTimer = () => {
    if (t) { // Vérifier si t est défini avant d'appeler start()
      t.start();
    } else {
      // Si le timer n'a pas été démarré, le démarrer
      startTimer();
      return; // Sortir après le démarrage pour éviter le double intervalle
    }
    if (intervalHandler) {
      clearInterval(intervalHandler);
    }
    intervalHandler = setInterval(() => {
      if (t) {
        t.update();
        title = formatElapsed(t.elapsed);
      }
      suffix = "⏵";
    }, 1000);
  };

  const startTimer = () => {
    title = "00:00";
    suffix = "⏵";
    t = new Timer({
      duration: 30 * 60 * 1000,
      elapsed: 0,
      perf: perf! // Utilisation de l'opérateur non-null assertion car perf sera initialisé au onMount
    });

    if (intervalHandler) {
      clearInterval(intervalHandler);
    }

    t.start();
    intervalHandler = setInterval(() => {
      if (t) {
        t.update();
        title = formatElapsed(t.elapsed);
      }
    }, 1000);
  };

  onMount(() => {
    const initialFaviconValue = '' + $favicon;
    if (updateTitleWithTimeElapsed === "true") {
      favicon.set("https://fav.farm/%E2%8F%B1");
    }

    // il faut attendre pour avoir accès à `window` sinon on est hors navigateur (SSR, etc.)
    perf = window.performance;

    return () => {
      // unMount function
      favicon.set(initialFaviconValue); 
    };
  });
</script>

<svelte:options customElement="tab-counter" />

<svelte:head>
  {#if updateTitleWithTimeElapsed === 'true'}
    <title>{title}{suffix ? " " + suffix : ""}</title>
  {/if}
</svelte:head>

<div>
  <h1>Tab Counter</h1>
  <div class="flexed">
    <h2>Temps écoulé {suffix}:</h2>
    <div class="elapsed">{title}</div>

    <div class="buttons">
      <button onclick={startTimer}>↪ | redémarrer</button>
      <button onclick={stopTimer}>⏸ | arrêter</button>
      <button onclick={continueTimer}>▶ | continuer</button>
    </div>
    {#if showHelp === 'true'}
      <div class="about">
        <p>Un time-boxer qui s’affiche dans le titre de l'onglet (title page)</p>
        <p>La favicon vient de <a href="https://fav.farm">fav.farm</a></p>
      </div>
    {/if}
  </div>
</div>

<style>
  h1 {
    color: violet;
  }
  h2 {
    margin-top: 10px;
  }
  .elapsed {
    display: inline-block;
    font-size: 20vmin;
    font-family: monospace;
  }
  .flexed {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buttons {
    display: flex;
  }
  button {
    width: 120px;
    height: 50px;
    margin: 10px;
    padding: 10px;
  }
  .about {
    margin: 20px;
    padding: 20px;
    font-size: small;
    background-color: lightcyan;
  }
</style>