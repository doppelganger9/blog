export class Speech {

  constructor({ synth, pitch = 1, rate = 1, volume = 1, lang }) {
    this.synth = synth || global.speechSynthesis;
    this.pitch = pitch;
    this.rate = rate;
    this.volume = volume;
    this.lang = lang ? lang : getDefaultLangFromGlobalObject();
    this.voice = undefined;
    this.init();
  }

  init() {
    this.synth.onvoiceschanged = () => {
      this.voice = this.selectVoiceForLang(this.lang);
    }
  }

  getDefaultLangFromGlobalObject() {
    return global.navigator ? global.navigator.language : undefined;
  }

  utterAndWaitUntilFinished(text) {
    return new Promise(resolve => {
      let utterThis = new SpeechSynthesisUtterance(text);
      utterThis.pitch = +this.pitch;
      utterThis.rate = +this.rate;
      utterThis.voice = this.voice;
      utterThis.volume = this.volume;
      utterThis.onend = () => resolve();
      this.synth.speak(utterThis);
    });
  }

  utterAndWaitUntilStarted(text = 'hello') {
    return new Promise(resolve => {
      let utterThis = new SpeechSynthesisUtterance(text);
      utterThis.pitch = +this.pitch;
      utterThis.rate = +this.rate;
      utterThis.voice = this.voice;
      utterThis.volume = this.volume;
      utterThis.onstart = () => resolve()
      this.synth.speak(utterThis);
    });
  }

  utterSometimeInTheFuture(text = 'hello') {
    let utterThis = new SpeechSynthesisUtterance(text);
    utterThis.pitch = +this.pitch;
    utterThis.rate = +this.rate;
    utterThis.voice = this.voice;
    utterThis.volume = this.volume;
    this.synth.speak(utterThis);
  }

  selectVoiceForLang(lang) {
    const voices = this.synth.getVoices();
    const langs = [...new Set(voices.map(voice => voice.lang))];
    if (!lang && langs) {
      lang = langs[0];
    }
    let voiceForLang = voices.filter(v => v.lang == lang);

    if (!voiceForLang || voiceForLang.length <= 0) {
      console.error(`no voices for lang ${lang}`);
    } else {
      console.debug(`${voiceForLang.length} voices found for lang ${lang}`);
    }
    // Google voice is the best, and usually the last.
    return (voiceForLang && voiceForLang.length > 0) ? voiceForLang[voiceForLang.length-1] : undefined;
  }
}
