<script lang="ts">
  import { tick, onMount, onDestroy } from 'svelte';
  import { Speech } from '$lib/speech.js';
  import { Timer } from '$lib/chrono.ts';
  import FallingEmojis from '$lib/components/FallingEmojis.svelte';

  let speech: Speech;
  let timer: Timer;
  let frame: number;
  let progress = 0;
  let timerFinished = false;

  interface Timebox {
    name: string;
    duration: number;
    enableSpeech: boolean;
  };

  let timebox: Timebox = {
    name:'5 second test',
    duration: 5000,
    enableSpeech: true,
  };

  async function startTimeBox() {
    if (timebox.enableSpeech) {
      timerFinished = false;
      playSound(audioContext, gongAudioFileBuffer)
      await speech.utterAndWaitUntilFinished('starting time box!');
    }
    timer = new Timer(
      timebox.duration || 5000,
      0,
      window.performance,
    );
    timer.start();
    (async function refreshTimer() {
      if (timer.update()) {
        frame = window.requestAnimationFrame(refreshTimer);
        progress = +timer.elapsed / +timer.duration;
        tick();
      } else {
        if (timebox.enableSpeech) {
          playSound(audioContext, gongAudioFileBuffer)
          await speech.utterAndWaitUntilFinished('time box ended!');
          timerFinished = true;
          //setTimeout(() => {timerFinished = false;}, 5000);
          // TODO: only let X emojis fall as part of the animation instead of brutally ending it!
        }
      };
    })();
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
    let source = audioContext.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(audioContext.destination);       // connect the source to the audioContext's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  }

  onMount(async () => {
    speech = new Speech({synth: globalThis.speechSynthesis, rate:1, pitch:1, lang:'en-US', volume:10});

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window['webkitAudioContext'];
    audioContext = new AudioContext();

    gongAudioFileBuffer = await loadSound(audioContext, `/gong.mp3`);
  });
  onDestroy(() => {
    timer && timer.stop();
  })
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

</style>

<h1>Time Boxing 💥⏱🥊💥</h1>
<p>Fighting time dilation by setting clear expectations on the duration of an activity.</p>
<p>The idea behind this pun is to provide a simple web application to time-box a meeting or workshop or your agile rituals.</p>
<p>The content is open sourced on Github</p>

<h2>Time-Box?</h2>
<p>What is a <a href="https://en.wikipedia.org/wiki/Timeboxing">time-box</a>?</p>
<p>It is a time management technique where you allocate a certain amount of time for an activity. No more, no less.</p>
<p>It helps avoid perfectionnism, and enhances creativity and focus given the sense of urgency</p>
<h2>Parkinson's Law</h2>
<p>Also helps to fight <a href="https://en.wikipedia.org/wiki/Parkinson%27s_law">Parkinson's Law</a>:</p>
<blockquote>work expands so as to fill the time available for its completion</blockquote>

<h2>The Time-Boxer</h2>
<ol>
<li>Now that all of this is said, tell us about the kind of activity you want to time-box? <input type="text" bind:value={timebox.name}/></li>
<li>How much time will the time-box be? <input type="text" bind:value={timebox.duration}/></li>
<li>Do you want me to tell you when time passes using speech synthesis? <input type="checkbox" bind:checked={timebox.enableSpeech}/></li>
</ol>
<p><button on:click={startTimeBox}>Start the time-box!</button></p>
{#if progress && !timerFinished}
<p>Here is a progress bar that will visually remind you of the elapsed time, and left time.</p>
<progress value="{progress}"></progress>
{/if}
{#if timerFinished}
<FallingEmojis />
{/if}
