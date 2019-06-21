<script>
  import { onMount } from 'svelte';

  let synth;
  let lang;
	let text2speech = 'Il reste 10 minutes';
	let pitch = 1;
	let rate = 1;
	let voiceOptions, selectedVoice;
  let langs, selectedLang;
  let volume = 1;

  let populateVoiceList;
  let utter;

	onMount(async () => {
    // example adapted from MDN
    synth = global.speechSynthesis;
  	lang = global.navigator ? global.navigator.language : undefined;

    populateVoiceList = () => {
      const voices = synth.getVoices();
      langs = [...new Set(voices.map(voice => voice.lang))];
      if (!selectedLang && langs){
        selectedLang = langs[0];
      }
      voiceOptions = voices.filter(v=>v.lang == selectedLang).map(voice => ({textContent: `${voice.name} (${voice.lang}) ${voice.default ? ' -- DEFAULT':''}`, value: voice}));
      selectedVoice = voiceOptions && voiceOptions.length>0 ? voiceOptions[0].value : undefined;
    };
    populateVoiceList();
    if (global.speechSynthesis && global.speechSynthesis.onvoiceschanged !== undefined) {
      global.speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    utter = (event) => {
      event.preventDefault();

      let utterThis = new SpeechSynthesisUtterance(text2speech);
      utterThis.pitch = pitch;
      utterThis.rate = rate;
      utterThis.voice = selectedVoice;
      utterThis.volume = volume;

      synth.speak(utterThis);
    }
  });
</script>

<svelte:head>
  <title>Speech Synthesis</title>
</svelte:head>

<h1>🤖 Web Speech Synthesis</h1>
<p>The current <code>navigator.lang</code> is <code>{lang}</code></p>
{#if langs}
  <p><label>You can select the lang (it defaults to {lang}) from <code>global.speechSynthesis.getVoices()</code>:</label>
  <select bind:value={selectedLang} on:change={populateVoiceList}>
    {#each langs as lang}
    <option label="{lang}" value="{lang}"/>
    {/each}
  </select></p>
{:else}
  <p>Searching for langs...</p>
{/if}
{#if voiceOptions}
  <p><label>For this lang, you can select a voice:</label>
  <select bind:value={selectedVoice}>
    {#each voiceOptions as voice}
    <option label="{voice.textContent}" value="{voice.value}"/>
    {/each}
  </select></p>
{:else}
  <p>No voices found yet...</p>
{/if}
<p>
The current selected voice is <code>{selectedVoice ? selectedVoice.name : 'none yet'}</code>
</p>
<p>
Then you can choose a rate (normal = 1, minimum = 0.1, maximum = 10 by spec, but browser can further limit this range): <input type="number" bind:value={rate} />
</p>
<p>
Also choose a pitch (between 0 and 2): <input type="number" bind:value={pitch} />
</p>
<p>
And the text to speak: <input type="text" bind:value={text2speech}/>
</p>
<button on:click={event => utter(event)}>Now, click here to Speak!</button>
<p>References:<p>
<ul>
<li><a href="https://w3c.github.io/speech-api/#tts-section">W3C Speech API, Text to speech section</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis">MDN Article on Speech Synthesis</a></li>
<li><a href="https://developer.mozilla.org/fr/docs/Web/API/NavigatorLanguage/language">MDN Article on language</a></li>
</ul>
