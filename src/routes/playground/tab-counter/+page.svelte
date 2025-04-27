<script lang="ts">
  import { Timer } from "$lib/chrono";
  import { onMount } from "svelte";
  import { favicon } from "$lib/stores/favicon";

  let suffix = "⏹";
  let title = "00:00";
  let t : Timer;
  let intervalHandler;
  let perf;

  function formatElapsed(elapsed: number) {
    let minutes = Math.floor(elapsed / (60*1000));
    let seconds = Math.floor((elapsed % (60*1000))/1000);
    let text = `${minutes < 10 ? ("0" + minutes) : minutes}:${seconds < 10 ? ("0" + seconds) : seconds}`;
    return text;
  }

  let stopTimer = () => {
    t.stop();
    title = formatElapsed(t.elapsed);
    suffix = "⏸";
    if (intervalHandler) clearInterval(intervalHandler);
    t.update();
  };

  let continueTimer = () => {
    t.start();
    if (intervalHandler) clearInterval(intervalHandler);
    intervalHandler = setInterval(() => {
      t.update();
      title = formatElapsed(t.elapsed);
      suffix = "⏵";
    }, 1000);
  };

  let startTimer = () => {
    title = "00:00";
    suffix = "⏵";
    t = new Timer({
      duration: 30 * 60 * 1000,
      elapsed: 0,
      perf
    });

    if (intervalHandler) clearInterval(intervalHandler);

    t.start();
    intervalHandler = setInterval(() => {
      t.update();
      title = formatElapsed(t.elapsed);
    }, 1000);
  };

  onMount(async () => {
    favicon.set('https://fav.farm/%E2%8F%B1');

    // il faut attendre pour avoir accès à `window` sinon on est hors navigateur (SSR, etc.)
    perf = window.performance;
  });
</script>

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

<svelte:head>
    <title>{ title }{ suffix ? " " + suffix : "" }</title> 
</svelte:head>

<h1>Tab Counter</h1>
<div class="flexed">
  <h2>Temps écoulé {suffix}:</h2>
  <div class="elapsed">{ title }</div>

  <div class="buttons">
    <button on:click={startTimer}>↪ | redémarrer</button>
    <button on:click={stopTimer}>⏸ | arrêter</button>
    <button on:click={continueTimer}>▶ | continuer</button>
  </div>
  <div class="about">
    <p>Un time-boxer qui s’affiche dans le titre de l'onglet (title page)</p>
    <p>La favicon vient de <a href="https://fav.farm">fav.farm</a></p>
  </div>
  
</div>

<br/>
<br/>
<br/>
<br/>