<script lang="typescript">
  import { tick, onMount, onDestroy } from 'svelte';
  import { Timer } from '$lib/chrono.ts';

  let timer: Timer;
  let frame: number;
  let progress = 0;
  let timerFinished = false;
  // en faire des stores
  let roundsCount = 6; // nb of rounds
  let roundDurationMinutes = 1;
  let roundDurationSeconds = 0;
  let prepareDurationMinutes = 0;
  let prepareDurationSeconds = 10;
  let warningDurationMinutes = 0;
  let warningDurationSeconds = 5;
  let restDurationMinutes = 0;
  let restDurationSeconds = 20;
  let presetNumber = 3;
  let currentPhaseClass = 'prepare';
  let currentPhaseTitle = 'PREPARE';
  let computedTotalWorkoutTime;

  interface PlannedPhaseEvent {
    phase: 'workout'|'prepare'|'round'|'rest';
    event: 'start'|'warn'|'end';
    beginAt: number;
    nb?: number;
  }

  /**
   * start PREPARE timer elapsed = 0
   *    tick each second elapsed++
   *    if PREPARE timer >= prepareDuration then end PREPARE Phase
   * then each round of roundsCount:
   *    start ROUND timer elpased = 0
   *    tick each second : elapsed ++
   *    if round timer elapsed > roundDuration - warningDuration
   *    start WARNING timer
   *    if round timer elapsed >= roundDuration : 
   *      end round timer, 
   *      end warning timer
   *      end ROUND
   *    if it was last round, END workout
   *    else start REST timer elapsed = 0
   *    if REST timer elapsed > restDuration - warningDuration : alert user for next round
   */

  async function startWorkout() {
    // TODO play start sound
    //  playSound(audioContext, gongAudioFileBuffer)
    let plan = planWorkout();
    console.debug(plan);
    timer = new Timer(
      plan[plan.length-1].beginAt * 1000,
      0,
      window.performance
    );
    timer.start();

    (async function refreshTimer() {
      if (timer.update()) {
        frame = window.requestAnimationFrame(refreshTimer);
        progress = +timer.elapsed / +timer.duration;
        plan = tickProgress(timer, plan);
        tick();
      } else {
        resetProgress(timer);
        timerFinished = true;
      };
    })();
  }

  function tickProgress(timer: Timer, plan: PlannedPhaseEvent[]) {
    if (timer.elapsed) {
      let triggerPhases = plan.filter(item => item.beginAt * 1000 <= timer.elapsed);
      if (triggerPhases.length) console.log(triggerPhases);
      triggerPhases.forEach(p => triggerPhaseEvent(timer, p));
      let remainingFuturePhases = plan.filter(item => item.beginAt * 1000 > timer.elapsed);
      //console.log(remainingFuturePhases);
      return remainingFuturePhases;
    } else {
      console.log("nothing triggered");
      return plan;
    }
  }

  function resetProgress(timer: Timer) {
    currentPhaseClass = undefined;
    currentPhaseTitle = undefined;
    playSound(audioContext, gongAudioFileBuffer)
  }

  function triggerPhaseEvent(timer: Timer, phaseEvent : PlannedPhaseEvent) {
      // phaseEvent.event; // TODO play sound
      console.log('at ' + timer.elapsed + ' play sound for ' + phaseEvent.phase + "-" + phaseEvent.event);
      currentPhaseClass = phaseEvent.phase.toLocaleLowerCase()+"-"+phaseEvent.event;
      if (phaseEvent.phase === 'rest' || phaseEvent.phase === 'round') {
        currentPhaseTitle = phaseEvent.phase.toUpperCase() + " #" + phaseEvent.nb;
      } else {
        currentPhaseTitle = phaseEvent.phase.toUpperCase();
      }
  }

  /**
   * WORKOUT START
   * PREPARE |0----5===9
   * ROUND 1 |0--------90--------90--------90--------90--------90----5===9
   * REST  1 |0--------90--------90----5===9
   * ROUND 2 |0--------90--------90--------90--------90--------90----5===9
   * REST  2 |0--------90--------90----5===9
   * ROUND 3 |0--------90--------90--------90--------90--------90----5===9
   * WORKOUT END
   */
  function planWorkout() {
    let plan: PlannedPhaseEvent[] = [];
    plan.push({phase:'workout', event:'start', beginAt:0 });

    plan.push({phase:'prepare', event:'start', beginAt:0 });
    plan.push({phase:'prepare', event:'warn', beginAt:((prepareDurationMinutes - warningDurationMinutes)*60 + prepareDurationSeconds - warningDurationSeconds) });
    plan.push({phase:'prepare', event:'end', beginAt:(prepareDurationMinutes*60 + prepareDurationSeconds)-1 });
    let lastEventEnd = (prepareDurationMinutes*60 + prepareDurationSeconds);

    let currentRoundNumber = 0;
    while(currentRoundNumber < roundsCount) {
      plan.push({phase:'round', nb: currentRoundNumber+1, event:'start', beginAt:0+lastEventEnd });
      plan.push({phase:'round', nb: currentRoundNumber+1, event:'warn', beginAt:lastEventEnd + ((roundDurationMinutes - warningDurationMinutes)*60 + roundDurationSeconds - warningDurationSeconds) });
      plan.push({phase:'round', nb: currentRoundNumber+1, event:'end', beginAt:lastEventEnd + (roundDurationMinutes*60 + roundDurationSeconds)-1 });
      lastEventEnd += (roundDurationMinutes*60 + roundDurationSeconds);

      if (currentRoundNumber < roundsCount-1) {
        plan.push({phase:'rest', nb: currentRoundNumber+1, event:'start', beginAt:0+lastEventEnd });
        plan.push({phase:'rest', nb: currentRoundNumber+1, event:'warn', beginAt:lastEventEnd + ((restDurationMinutes - warningDurationMinutes)*60 + restDurationSeconds - warningDurationSeconds) });
        plan.push({phase:'rest', nb: currentRoundNumber+1, event:'end', beginAt:lastEventEnd + (restDurationMinutes*60 + restDurationSeconds)-1 });
        lastEventEnd += (restDurationMinutes*60 + restDurationSeconds);
      }
      currentRoundNumber++;
    }
    plan.push({phase:'workout', event:'end', beginAt:0+lastEventEnd});
    
    return plan;
  }

  let gongAudioFileBuffer;
  let audioContext;

  async function loadSound(audioContext, url) {
    let request = await fetch(url);
    let data = await request.arrayBuffer();

    return await (new Promise((resolve, reject) => {
      audioContext.decodeAudioData(data, function(buffer) {
        resolve(buffer);
      });
    }));
  }

  function playSound(audioContext, buffer) {
    console.log("playSound");
    return; // TODO commenter pour avoir le son
    let source = audioContext.createBufferSource(); // creates a sound source
    source.buffer = buffer;                         // tell the source which sound to play
    source.connect(audioContext.destination);       // connect the source to the audioContext's destination (the speakers)
    source.start(0);                                // play the source now
                                                    // note: on older systems, may have to use deprecated noteOn(time);
  }

  onMount(async () => {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window['webkitAudioContext'];
    audioContext = new AudioContext();

    gongAudioFileBuffer = await loadSound(audioContext, `/gong.mp3`);
    // TODO autres sons
  });

  onDestroy(() => {
    timer && timer.stop();
  })

  function decreaseRoundsCount() {
    console.log("decrease");
    if (roundsCount > 0) roundsCount -= 1;
  }
  function increaseRoundsCount() {
    console.log("increase");
    if (roundsCount < 99) roundsCount += 1;
  }
  // TODO en faire une variable/valeur dérivée
  function computeTotalWorkoutTime() {
    let total = (prepareDurationMinutes*60 + prepareDurationSeconds)
        + (roundsCount * (roundDurationSeconds + roundDurationMinutes*60))
        + ((roundsCount - 1) * (restDurationMinutes*60 + restDurationSeconds));
    computedTotalWorkoutTime = (Math.floor(total / 60)) + ":" + (total % 60);
    return computedTotalWorkoutTime;
  }
</script>

<style>
h1 {
  color: violet;
}
progress {
  width: 100%;
}
input {
  border: none;
  border-bottom: 2px solid magenta;
  padding: .5em;
  font-size: 1em;
  color: magenta;
}
button {
  border: 2px solid magenta;
  border-radius: 5px;
  padding: 1em 2em;
  margin: 1em auto;
  display: block;
  background: aquamarine;
  font-family: "Merriweather";
  color: magenta;
  font-weight: 900;
  font-size: 1em;
  box-shadow: 0 9px magenta;
}
button:active {
  background-color:rgb(53, 165, 127);/* rgb(144, 26, 144);*/
  box-shadow: 0 5px rgb(144, 26, 144);
  border-color: rgb(144, 26, 144);
  color: rgb(255, 155, 255);
  transform: translateY(4px);
}
button:focus {outline:0;}
input:focus {outline:0;}

.prepare-start {
  color: yellow;
}
.prepare-warn {
  color: orange;
}
.prepare-end {
  color: yellowgreen;
}
.round-start {
  color: green;
}
.round-warn {
  color: orange;
}
.round-end {
  color: blue;
}
.rest-start {
  color: lightskyblue;
}
.rest-warn {
  color: orange;
}
.rest-end {
  color: blueviolet;
}

</style>

<h1>Boxing Timer 💥🥊⏱💥</h1>
<p>Here is an app to create workout timers.</p>
<p>It's based on the time-boxing page I made a few years ago.</p>
<p>The content is open sourced on Github</p>

<div id="roundsCounter">
  <h3>ROUNDS</h3>
  <button on:click={decreaseRoundsCount}>-</button>
  <p>{roundsCount}</p>
  <button on:click={increaseRoundsCount}>+</button>
</div>
<div>PREPARE
  <input id="prepareMinutes" type="number" min="0" max="60" bind:value={prepareDurationMinutes}/>
  <input id="prepareSeconds" type="number" min="0" max="59" bind:value={prepareDurationSeconds}/>
</div>
<div>ROUND
  <input id="roundMinutes" type="number" min="0" max="60" bind:value={roundDurationMinutes}/>
  <input id="roundSeconds" type="number" min="0" max="59" bind:value={roundDurationSeconds}/>
</div>
<div>WARNING
  <input id="warningMinutes" type="number" min="0" max="60" bind:value={warningDurationMinutes}/>
  <input id="warningSeconds" type="number" min="0" max="59" bind:value={warningDurationSeconds}/>
</div>
<div>REST
  <input id="restMinutes" type="number" min="0" max="60" bind:value={restDurationMinutes}/>
  <input id="restSeconds" type="number" min="0" max="59" bind:value={restDurationSeconds}/>
</div>
<div>PRESET {presetNumber}</div>
{#if progress && !timerFinished}
<progress value="{progress}"></progress>
<div class:rest-start={currentPhaseClass=='rest-start'}
    class:rest-warn={currentPhaseClass=='rest-warn'}
    class:rest-end={currentPhaseClass=='rest-end'}
    class:round-start={currentPhaseClass=='round-start'}
    class:round-warn={currentPhaseClass=='round-warn'}
    class:round-end={currentPhaseClass=='round-end'}
    class:prepare-start={currentPhaseClass=='prepare-start'}
    class:prepare-warn={currentPhaseClass=='prepare-warn'}
    class:prepare-end={currentPhaseClass=='prepare-end'}
><h3>{currentPhaseTitle}</h3></div>
{/if}
{#if !progress || timerFinished}
<p><button on:click={startWorkout}>START</button> TOTAL Time : {computeTotalWorkoutTime()}</p>
{/if}

<!--
  au clic sur prepare/round/warning:
PREPARE
00:10

00:10  00:20  01:00

roulette 00 mins 10 secs

DONE
-->