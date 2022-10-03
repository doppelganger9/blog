<script>
  import { onMount } from 'svelte';

  let gongAudioFileBuffer;
  let context;

  async function loadDogSound(context, url) {
    let request = await fetch(url);
    let data = await request.arrayBuffer();

    return await (new Promise((resolve, reject) => {
      context.decodeAudioData(data, function(buffer) {
        resolve(buffer);
      });
    }));
  }

  function playSound(context, buffer) {
    let source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  }

  onMount(async () => {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    gongAudioFileBuffer = await loadDogSound(context, `/gong.mp3`);
  })

</script>

<h1>Web Audio API</h1>
<h3>Purpose</h3>
<p>Simply loading an MP3 file, and playing it. {#if context && gongAudioFileBuffer}Ring the bell by clicking on it.{/if}</p>
{#if context && gongAudioFileBuffer}
<img on:click={() => playSound(context, gongAudioFileBuffer)} src="https://www.dragonsports.eu/372871-verylarge_default/gong-de-ring-metal-boxe-mb466.jpg" alt="boxing ring bell"/>
{:else}
<p>...Loading the Ring Bell MP3 file</p>
{/if}
<br/>
<h3>References</h3>
<ul>
<li><a href="https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API">MDN article on Web Audio API</a>
</li>
<li>
<a href="https://www.html5rocks.com/en/tutorials/webaudio/intro/">HTML5Rock article: Getting Started with Web Audio API</a>
</li>
</ul>
