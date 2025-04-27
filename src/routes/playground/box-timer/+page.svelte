<script lang="ts">
  import { tick, onMount, onDestroy } from 'svelte';
  import { Timer } from '$lib/chrono.ts';

  /**
   * TODO:
   *   - better UI (Graphics Design is my passion)
   *   - fix timing bugs (last/first second...)
   *   - show a progress overview with colors for each phase and a line moving to show where we are in the workout plan.
   *   - load/save presets from local/session storage
   */

  function format(n:number) {
      return ('0' + n).slice(-2);
  }

  class TimerConfig {
    roundsCount = 2; // nb of rounds
    roundDurationMinutes = 0;
    roundDurationSeconds = 20;
    prepareDurationMinutes = 0;
    prepareDurationSeconds = 10;
    warningDurationMinutes = 0;
    warningDurationSeconds = 5;
    restDurationMinutes = 0;
    restDurationSeconds = 10;
    presetNumber = 3;

    decreaseRoundsCount(): void {
      if (timerConfig.roundsCount > 0) timerConfig.roundsCount -= 1;
    }
    increaseRoundsCount(): void {
      if (timerConfig.roundsCount < 99) timerConfig.roundsCount += 1;
    }

    get formattedRestDurationSeconds(): string {
      return format(this.restDurationSeconds);
    }
    set formattedRestDurationSeconds(val: string) {
      this.restDurationSeconds = +val;
    }
    get formattedRestDurationMinutes(): string {
      return format(this.restDurationMinutes);
    }
    set formattedRestDurationMinutes(val: string) {
      this.restDurationMinutes = +val;
    }

    get formattedRoundDurationSeconds(): string {
      return format(this.roundDurationSeconds);
    }
    set formattedRoundDurationSeconds(val: string) {
      this.roundDurationSeconds = +val;
    }
    get formattedRoundDurationMinutes(): string {
      return format(this.roundDurationMinutes);
    }
    set formattedRoundDurationMinutes(val: string) {
      this.roundDurationMinutes = +val;
    }

    get formattedWarningDurationSeconds(): string {
      return format(this.warningDurationSeconds);
    }
    set formattedWarningDurationSeconds(val: string) {
      this.warningDurationSeconds = +val;
    }
    get formattedWarningDurationMinutes(): string {
      return format(this.warningDurationMinutes);
    }
    set formattedWarningDurationMinutes(val: string) {
      this.warningDurationMinutes = +val;
    }


    get formattedPrepareDurationSeconds(): string {
      return format(this.prepareDurationSeconds);
    }
    set formattedPrepareDurationSeconds(val: string) {
      this.prepareDurationSeconds = +val;
    }
    get formattedPrepareDurationMinutes(): string {
      return format(this.prepareDurationMinutes);
    }
    set formattedPrepareDurationMinutes(val: string) {
      this.prepareDurationMinutes = +val;
    }

    // in seconds
    get prepareDurationWarningTime() {
      return ((this.prepareDurationMinutes - this.warningDurationMinutes)*60 + this.prepareDurationSeconds - this.warningDurationSeconds);
    }
    get prepareDurationEndTime() {
      return (this.prepareDurationMinutes*60 + this.prepareDurationSeconds);
    }
    get roundDurationWarningTime() {
      return ((this.roundDurationMinutes - this.warningDurationMinutes)*60 + this.roundDurationSeconds - this.warningDurationSeconds);
    }
    get roundDurationEndTime() {
      return (this.roundDurationMinutes*60 + this.roundDurationSeconds);
    }
    get restDurationWarningTime() {
      return ((this.restDurationMinutes - this.warningDurationMinutes)*60 + this.restDurationSeconds - this.warningDurationSeconds);
    }
    get restDurationEndTime() {
      return (this.restDurationMinutes*60 + this.restDurationSeconds);
    }

    get computeTotalWorkoutTime() {
      let total = (this.prepareDurationMinutes*60 + this.prepareDurationSeconds)
          + (this.roundsCount * (this.roundDurationSeconds + this.roundDurationMinutes*60))
          + ((this.roundsCount - 1) * (this.restDurationMinutes*60 + this.restDurationSeconds));
      const computedTotalWorkoutTime = format(Math.floor(total / 60)) + ":" + format(total % 60);
      return computedTotalWorkoutTime;
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
    planWorkout(): PlannedPhaseEvent[] {
      let plan: PlannedPhaseEvent[] = [];
      plan.push({phase:'workout', event:'start', beginAt:0 });

      plan.push({phase:'prepare', event:'start', beginAt:0 });
      plan.push({phase:'prepare', event:'warn', beginAt:this.prepareDurationWarningTime });
      plan.push({phase:'prepare', event:'tap', beginAt:this.prepareDurationEndTime-4 });
      plan.push({phase:'prepare', event:'tap', beginAt:this.prepareDurationEndTime-3 });
      plan.push({phase:'prepare', event:'tap', beginAt:this.prepareDurationEndTime-2 });
      plan.push({phase:'prepare', event:'end', beginAt:this.prepareDurationEndTime-1 });
      let lastEventEnd = +this.prepareDurationEndTime;

      let currentRoundNumber = 0;
      while(currentRoundNumber < this.roundsCount) {
        plan.push({phase:'round', nb: currentRoundNumber+1, event:'start', beginAt:0+lastEventEnd });
        plan.push({phase:'round', nb: currentRoundNumber+1, event:'warn', beginAt:lastEventEnd + this.roundDurationWarningTime });

        plan.push({phase:'round', nb: currentRoundNumber+1, event:'tap', beginAt:lastEventEnd + this.roundDurationEndTime-4 });
        plan.push({phase:'round', nb: currentRoundNumber+1, event:'tap', beginAt:lastEventEnd + this.roundDurationEndTime-3 });
        plan.push({phase:'round', nb: currentRoundNumber+1, event:'tap', beginAt:lastEventEnd + this.roundDurationEndTime-2 });

        plan.push({phase:'round', nb: currentRoundNumber+1, event:'end', beginAt:lastEventEnd + this.roundDurationEndTime-1 });
        lastEventEnd += this.roundDurationEndTime;

        if (currentRoundNumber < this.roundsCount-1) {
          plan.push({phase:'rest', nb: currentRoundNumber+1, event:'start', beginAt:0+lastEventEnd });
          plan.push({phase:'rest', nb: currentRoundNumber+1, event:'warn', beginAt:lastEventEnd + this.restDurationWarningTime });

          plan.push({phase:'rest', nb: currentRoundNumber+1, event:'tap', beginAt:lastEventEnd + this.restDurationEndTime-4 });
          plan.push({phase:'rest', nb: currentRoundNumber+1, event:'tap', beginAt:lastEventEnd + this.restDurationEndTime-3 });
          plan.push({phase:'rest', nb: currentRoundNumber+1, event:'tap', beginAt:lastEventEnd + this.restDurationEndTime-2 });

          plan.push({phase:'rest', nb: currentRoundNumber+1, event:'end', beginAt:lastEventEnd + this.restDurationEndTime-1 });
          lastEventEnd += this.restDurationEndTime;
        }
        currentRoundNumber++;
      }
      plan.push({phase:'workout', event:'end', beginAt:0+lastEventEnd});
      
      return plan;
    }
  };

  class TimerStatus {
    timer: Timer;
    frame: number;
    progress = 0;
    elapsed = 0;
    currentPhaseStart = 0;
    //timerFinished = false;
    currentPhaseClass = 'prepare';
    currentPhaseTitle = 'PREPARE';
  };

  let timerStatus = new TimerStatus();
  let timerConfig = new TimerConfig();

  interface PlannedPhaseEvent {
    phase: 'workout'|'prepare'|'round'|'rest';
    event: 'start'|'warn'|'end'|'tap';
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
   * 
   * PREPARE:
   * tit
   * ...
   * 3.2.1 x3 tit
   * ROUND 1:
   * gong
   * ...
   * -10sec toctoctoc
   * ...3.2.1 x3 tit
   * REST 1:
   * gong-gong-gong
   * ...3.2.1 x3 tit
   * ROUND 2..
   * 
   */

  async function startWorkout() {
    let plan = timerConfig.planWorkout();
    timerStatus.timer = new Timer({
      duration: plan[plan.length-1].beginAt * 1000,
      elapsed: 0,
      perf: window.performance
    });
    timerStatus.timer.start();

    (async function refreshTimer() {
      if (timerStatus.timer.update()) {
        timerStatus.frame = window.requestAnimationFrame(refreshTimer);
        timerStatus.progress = +timerStatus.timer.elapsed / +timerStatus.timer.duration;
        plan = tickProgress(timerStatus.timer, plan);
        tick();
      } else {
        resetProgress(timerStatus.timer);
        plan = tickProgress(timerStatus.timer, plan);
      };
    })();
  }

  function tickProgress(timer: Timer, plan: PlannedPhaseEvent[]) {
    if (timer.elapsed) {
      timerStatus.elapsed = Math.floor(timer.elapsed / 1000) - timerStatus.currentPhaseStart;
      let triggerPhases = plan.filter(item => item.beginAt * 1000 <= timer.elapsed);
      triggerPhases.forEach(p => triggerPhaseEvent(timer, p));
      let remainingFuturePhases = plan.filter(item => item.beginAt * 1000 > timer.elapsed);
      return remainingFuturePhases;
    } else {
      return plan;
    }
  }

  function resetProgress(timer: Timer) {
    timerStatus.currentPhaseClass = undefined;
    timerStatus.currentPhaseTitle = undefined;
  }

  function triggerPhaseEvent(timer: Timer, phaseEvent : PlannedPhaseEvent) {
      //console.log('at ' + timer.elapsed + ' play sound for ' + phaseEvent.phase + "-" + phaseEvent.event);
      let sound2play;
      switch(phaseEvent.phase + '-' + phaseEvent.event) {
        case 'workout-start':
          sound2play = workoutFinishedAudioFileBuffer;
          break;
        case 'workout-warn':
          break;
        case 'workout-end':
          timerStatus.currentPhaseStart += timerStatus.elapsed;
          sound2play = workoutFinishedAudioFileBuffer;
          break;
        case 'prepare-start':
          break;
        case 'prepare-warn':
          sound2play = warningAudioFileBuffer;
          break;
        case 'prepare-tap':
          sound2play = tapAudioFileBuffer;
          break;
        case 'prepare-end':
          timerStatus.currentPhaseStart += timerStatus.elapsed;
          break;
        case 'rest-start':
          break;
        case 'rest-warn':
          sound2play = warningAudioFileBuffer;
          break;
        case 'rest-tap':
          sound2play = tapAudioFileBuffer;
          break;
        case 'rest-end':
          timerStatus.currentPhaseStart += timerStatus.elapsed;
          break;
        case 'round-start':
          sound2play = gong1AudioFileBuffer;
          break;
        case 'round-warn':
          sound2play = warningAudioFileBuffer;
          break;
        case 'round-tap':
          sound2play = tapAudioFileBuffer;
          break;
        case 'round-end':
          timerStatus.currentPhaseStart += timerStatus.elapsed;
          sound2play = gong3AudioFileBuffer;
          break;
        default:
          break;
      }
      if (sound2play) { 
        playSound(audioContext, sound2play);
      }
      if (phaseEvent.phase != 'workout') {
        timerStatus.currentPhaseClass = phaseEvent.phase.toLocaleLowerCase()+"-"+phaseEvent.event;
        if (phaseEvent.phase === 'rest' || phaseEvent.phase === 'round') {
          timerStatus.currentPhaseTitle = phaseEvent.phase.toUpperCase() + " #" + phaseEvent.nb;
        } else {
          timerStatus.currentPhaseTitle = phaseEvent.phase.toUpperCase();
        }
      }
  }


  let gong1AudioFileBuffer, gong3AudioFileBuffer, warningAudioFileBuffer, whistleAudioFileBuffer, tapAudioFileBuffer, workoutFinishedAudioFileBuffer;
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
    let source = audioContext.createBufferSource(); // creates a sound source
    source.buffer = buffer;                         // tell the source which sound to play
    source.connect(audioContext.destination);       // connect the source to the audioContext's destination (the speakers)
    source.start(0);                                // play the source now
                                                    // note: on older systems, may have to use deprecated noteOn(time);
  }

  function preset(index: number) {
    // TODO better handle this to save/load presets. currently hardcoded
    if (index === 1) {
      timerConfig.roundsCount = 8; // nb of rounds
      timerConfig.roundDurationMinutes = 0;
      timerConfig.roundDurationSeconds = 15;
      timerConfig.prepareDurationMinutes = 0;
      timerConfig.prepareDurationSeconds = 10;
      timerConfig.warningDurationMinutes = 0;
      timerConfig.warningDurationSeconds = 5;
      timerConfig.restDurationMinutes = 0;
      timerConfig.restDurationSeconds = 10;
      timerConfig.presetNumber = 1;
    }
    else if (index === 2) {
      timerConfig.roundsCount = 5; // nb of rounds
      timerConfig.roundDurationMinutes = 1;
      timerConfig.roundDurationSeconds = 30;
      timerConfig.prepareDurationMinutes = 0;
      timerConfig.prepareDurationSeconds = 10;
      timerConfig.warningDurationMinutes = 0;
      timerConfig.warningDurationSeconds = 5;
      timerConfig.restDurationMinutes = 0;
      timerConfig.restDurationSeconds = 30;
      timerConfig.presetNumber = 2;
    }
    else if (index === 3) {
      timerConfig.roundsCount = 5; // nb of rounds
      timerConfig.roundDurationMinutes = 2;
      timerConfig.roundDurationSeconds = 0;
      timerConfig.prepareDurationMinutes = 0;
      timerConfig.prepareDurationSeconds = 10;
      timerConfig.warningDurationMinutes = 0;
      timerConfig.warningDurationSeconds = 5;
      timerConfig.restDurationMinutes = 0;
      timerConfig.restDurationSeconds = 45;
      timerConfig.presetNumber = 3;
    }
  }

  onMount(async () => {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window['webkitAudioContext'];
    audioContext = new AudioContext();

    gong1AudioFileBuffer = await loadSound(audioContext, `/gong1.mp3`);
    gong3AudioFileBuffer = await loadSound(audioContext, `/gong.mp3`);
    tapAudioFileBuffer = await loadSound(audioContext, `/tap.mp3`);
    warningAudioFileBuffer = await loadSound(audioContext, `/Warning.mp3`);
    whistleAudioFileBuffer = await loadSound(audioContext, `/whistle.mp3`);
    workoutFinishedAudioFileBuffer = await loadSound(audioContext, `/workout_finished.wav`);
  });

  onDestroy(() => {
    timerStatus && timerStatus.timer && timerStatus.timer.stop();
  })
</script>

<style>

:global(main) {
  background-color: black;
  --main-color-rgb: 150, 10, 250;
  --secondary-color-rgb: 255, 255, 255;
  --prepare-start-color: yellow;
  --prepare-warn-color: orange;
  --prepare-tap-color: orange;
  --prepare-end-color: yellowgreen;
  --round-start-color: green;
  --round-warn-color: orange;
  --round-tap-color: orange;
  --round-end-color: blue;
  --rest-start-color: lightskyblue;
  --rest-warn-color: orange;
  --rest-tap-color: orange;
  --rest-end-color: blueviolet;
  padding: 0 !important;
}
h1 {
  color: rgb(var(--main-color-rgb));
  text-align: center;
  margin: 0 1em 1em 1em;
}
progress {
  width: 100%;
}
input {
  border: none;
  border-bottom: 2px solid rgb(var(--main-color-rgb));
  padding: .5em .1em .5em .5em;
  font-size: 2em;
  text-align: center;
  color: var(--main-color);
}
button {
  border: 2px solid rgb(var(--main-color-rgb));
  border-radius: 50px;
  padding: 10px 20px;
  margin: 10px;
  display: block;
  background: rgb(var(--secondary-color-rgb), 1);
  font-family: "Merriweather";
  color: rgb(var(--main-color-rgb));
  font-weight: 900;
  font-size: 30px;
  box-shadow: 0 9px rgb(var(--main-color-rgb));
}
button:active {
  background-color: rgb(var(--secondary-color-rgb), 0.75);
  box-shadow: rgb(var(--main-color-rgb), 0.75);
  border-color: rgb(var(--main-color-rgb), 0.75);
  color: rgb(var(--main-color-rgb), 0.75);
  transform: translateY(4px);
}
button:focus {outline:0;}
input:focus {outline:0;}

#current-phase div.prepare-start {
  color: var(--prepare-start-color) !important;
}
#current-phase div.prepare-warn {
  color: var(--prepare-warn-color) !important;
}
#current-phase div.prepare-tap {
  color: var(--prepare-tap-color) !important;
}
#current-phase div.prepare-end {
  color: var(--prepare-end-color) !important;
}
#current-phase div.round-start {
  color: var(--round-start-color)  !important;
}
#current-phase div.round-warn {
  color: var(--round-warn-color)  !important;
}
#current-phase div.round-tap {
  color: var(--round-tap-color) !important;
}
#current-phase div.round-end {
  color: var(--round-end-color) !important;
}
#current-phase div.rest-start {
  color: var(--rest-start-color) !important;
}
#current-phase div.rest-warn {
  color: var(--rest-warn-color) !important;
}
#current-phase div.rest-tap {
  color: var(--rest-tap-color) !important;
}
#current-phase div.rest-end {
  color: var(--rest-end-color) !important;
}

#roundsCounter {
  display: flex;
  background-color: darkgray;
  padding: 5px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  align-items: center;
  justify-content: space-evenly;
}
#roundsCounter h3 {
  margin: 1em;
}
#roundsCounter #roundsNumber {
  font-size: 6em;
  font-family: sans-serif;
  font-weight: bold;
  line-height: 1em;
  width: auto;
  height: 1em;
}

.minus-round {

}

.plus-round {

}

.timing-conf-block {
  display: flex;
  background-color: gainsboro;
  padding: 5px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  align-items: center;
  justify-content: space-evenly;
}
.timing-conf-block h3 {
  margin: 1em;
  min-width: 5em;
}

.timing-conf-block.prepare-start {
  background-color: var(--prepare-start-color) !important;
}
.timing-conf-block.prepare-warn {
  background-color: var(--prepare-warn-color) !important;
}
.timing-conf-block.prepare-tap {
  background-color: var(--prepare-tap-color) !important;
}
.timing-conf-block.prepare-end {
  background-color: var(--prepare-end-color) !important;
}
.timing-conf-block.round-start {
  background-color: var(--round-start-color)  !important;
}
.timing-conf-block.round-warn {
  background-color: var(--round-warn-color)  !important;
}
.timing-conf-block.round-tap {
  background-color: var(--round-tap-color) !important;
}
.timing-conf-block.round-end {
  background-color: var(--round-end-color) !important;
}
.timing-conf-block.rest-start {
  background-color: var(--rest-start-color) !important;
}
.timing-conf-block.rest-warn {
  background-color: var(--rest-warn-color) !important;
}
.timing-conf-block.rest-tap {
  background-color: var(--rest-tap-color) !important;
}
.timing-conf-block.rest-end {
  background-color: var(--rest-end-color) !important;
}

#current-phase {
  display: flex;
  background-color: black;
  padding: 5px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  align-items: center;
  flex-direction: column;
}

#current-phase {
  color: white;
}
#current-phase h3 {
  font-size: 4em;
}
#current-phase h4 {
  font-size: 3em;
}

#total-time {
  display: flex;
  background-color: lemonchiffon;
  padding: 5px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  align-items: baseline;
  justify-content: space-evenly;
}
#total-time h3 {
  margin: 10px;
  font-size: 30px;
  width: auto;
}
#presets {
  display: flex;
  justify-content: space-evenly;
}
#presets button {
  margin: 5px;
  width: auto;
  padding: 5px;
  font-size: 20px;
  background: none;
  color: gray;
  box-shadow: none;
  border: none;
  text-decoration: underline;
}
#presets button:active {
  color:yellow;
  transform: none;
}

#info {
  background-color: lightblue;
  display: none;
}

#bottom-panel {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
#bottom-panel button {
  flex: 1;
}
#bottom-panel div {
  flex: 6;
}

</style>


<h1>🥊 Boxing Timer ⏱️</h1>

<div id="info">
  <!-- TODO: add(i) and show it only once or put it into an info button away from usable content -->
  <p>Here is an app to create workout timers.</p>
  <p>It's based on the time-boxing page I made a few years ago.</p>
  <p>The content is open sourced on Github</p>
</div>

<div id="">
  <div id="presets">
  <button on:click={() => preset(1)}>PRESET 1</button>
  <button on:click={() => preset(2)}>PRESET 2</button>
  <button on:click={() => preset(3)}>PRESET 3</button>
  </div>

  <div id="roundsCounter">
    <h3>ROUNDS</h3>
    <button class="minus-round" on:click={timerConfig.decreaseRoundsCount}>-</button>
    <div id="roundsNumber">{timerConfig.roundsCount}</div>
    <button class="plus-round" on:click={timerConfig.increaseRoundsCount}>+</button>
  </div>

  <div class="timing-conf-block prepare-start">
    <h3>PREPARE</h3>
    <input id="prepareMinutes" type="number" min="0" max="60" step="1" bind:value={timerConfig.formattedPrepareDurationMinutes}/>:
    <input id="prepareSeconds" type="number" min="0" max="59" step="1" bind:value={timerConfig.formattedPrepareDurationSeconds}/>
  </div>
  <div class="timing-conf-block round-start">
    <h3>ROUND</h3>
    <input id="roundMinutes" type="number" min="0" max="60" step="1" bind:value={timerConfig.formattedRoundDurationMinutes}/>:
    <input id="roundSeconds" type="number" min="0" max="59" step="1" bind:value={timerConfig.formattedRoundDurationSeconds}/>
  </div>
  <div class="timing-conf-block round-warn">
    <h3>WARNING</h3>
    <input id="warningMinutes" type="number" min="0" max="60" step="1" bind:value={timerConfig.formattedWarningDurationMinutes}/>:
    <input id="warningSeconds" type="number" min="0" max="59" step="1" bind:value={timerConfig.formattedWarningDurationSeconds}/>
  </div>
  <div class="timing-conf-block rest-start">
    <h3>REST</h3>
    <input id="restMinutes" type="number" min="0" max="60" step="1" bind:value={timerConfig.formattedRestDurationMinutes}/>:
    <input id="restSeconds" type="number" min="0" max="59" step="1" bind:value={timerConfig.formattedRestDurationSeconds}/>
  </div>

  {#if timerStatus.progress}
  <div id="current-phase">
    <progress value="{timerStatus.progress}"></progress>
    <div class:rest-start={timerStatus.currentPhaseClass=='rest-start'}
        class:rest-warn={timerStatus.currentPhaseClass=='rest-warn'}
        class:rest-tap={timerStatus.currentPhaseClass=='rest-tap'}
        class:rest-end={timerStatus.currentPhaseClass=='rest-end'}
        class:round-start={timerStatus.currentPhaseClass=='round-start'}
        class:round-warn={timerStatus.currentPhaseClass=='round-warn'}
        class:round-tap={timerStatus.currentPhaseClass=='round-tap'}
        class:round-end={timerStatus.currentPhaseClass=='round-end'}
        class:prepare-start={timerStatus.currentPhaseClass=='prepare-start'}
        class:prepare-warn={timerStatus.currentPhaseClass=='prepare-warn'}
        class:prepare-tap={timerStatus.currentPhaseClass=='prepare-tap'}
        class:prepare-end={timerStatus.currentPhaseClass=='prepare-end'}
    ><h3>{timerStatus.currentPhaseTitle}</h3>
    <h4>Elapsed: {timerStatus.elapsed}</h4></div>
  </div>
  {/if}

  {#if !timerStatus.progress}
  <div id="bottom-panel">
    <button on:click={startWorkout}>START</button>
    <div id="total-time">
      <h3>TOTAL Time : {timerConfig.computeTotalWorkoutTime}</h3>
    </div>
  </div>
  {/if}
</div>