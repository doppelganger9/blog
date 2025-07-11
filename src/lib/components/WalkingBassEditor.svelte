<script lang="ts">
  import { Chord, Note } from 'tonal';
  import * as Tone from 'tone';
  import VexFlow, { Renderer, Stave, StaveNote, Formatter } from 'vexflow';

  let chordsInput = $state('Cmaj7 | Am7 | Dm7 | G7');
  let tempo = $state(100);
  let loop = $state(false);
  let generatedNotes = $state<string[]>([]);

  let container: HTMLDivElement;
  let player: Tone.Part | null = null;

  function parseChords(input: string): string[] {
    return input
      .split('|')
      .map(c => c.trim())
      .filter(Boolean);
  }

  function addOctave(note: string, octave: number) {
    // Remove any existing octave and add the desired one
    return note.replace(/\d+$/, '') + octave;
  }

  function generateBassLine(chords: string[]): string[] {
    const defaultOctave = 2;
    return chords.flatMap((chord, i) => {
      const notes = Chord.get(chord).notes;
      const root = addOctave(notes[0] ?? 'C', defaultOctave);
      const nextChord = chords[i + 1] ?? chord;
      const nextNotes = Chord.get(nextChord).notes;
      const nextRoot = addOctave(nextNotes[0] ?? 'C', defaultOctave);

      // Compare MIDI numbers to decide direction
      const rootMidi = Note.midi(root) ?? 36;      // fallback to C2
      const nextRootMidi = Note.midi(nextRoot) ?? 36;

      // TODO : I need to refine this when the 5th is above the nextRoot but the root was below
      //   Also to add some octave shifts for variety with half notes

      let approachNote, third, fifth;
      if (nextRootMidi > rootMidi) {
        // Ascending: chromatic up
        approachNote = Note.transpose(nextRoot, '-2m');
        third = Note.transpose(root, '3M');
        fifth = Note.transpose(root, '5P');
      } else if (nextRootMidi < rootMidi) {
        // Descending: chromatic down
        approachNote = Note.transpose(nextRoot, '2m');
        third = Note.transpose(root, '-3M');
        fifth = Note.transpose(root, '-5P');
      } else {
        // Same note, just use nextRoot
        approachNote = nextRoot;
        third = Note.transpose(root, '3M');
        fifth = Note.transpose(root, '5P');
      }

      return [
        root,
        third,
        fifth,
        approachNote
      ];
    });
  }

  function drawNotes(notes: string[]) {
    if (!container) return;
    container.innerHTML = '';

    const notesPerBar = 4;
    const numBars = Math.ceil(notes.length / notesPerBar);
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    const barWidth = 140;
    const totalWidth = numBars * barWidth + 20;
    renderer.resize(totalWidth, 200);
    const context = renderer.getContext();

    let x = 10;
    for (let bar = 0; bar < numBars; bar++) {
      const stave = new Stave(x, 40, barWidth);
      if (bar === 0) {
        stave.addClef('bass');
        stave.addTimeSignature('4/4');
      }
      stave.setContext(context).draw();

      // Get notes for this bar
      const barNotes = notes.slice(bar * notesPerBar, (bar + 1) * notesPerBar);
      const vexNotes = barNotes.map(n => {
      // Parse note and accidental, e.g. "F#2"
      let match = n.match(/^([A-Ga-g])([b#]*)?(\d)$/);
      if (!match) {
        // fallback to C2 if parsing fails
        n = "C2";
        match = n.match(/^([A-Ga-g])([b#]*)?(\d)$/);
      }
      const letter = match[1].toLowerCase();
      const accidental = match[2] || "";
      const octave = match[3];
      const key = `${letter}${accidental}/${octave}`;
      const staveNote = new StaveNote({
        keys: [key],
        duration: 'q',
        clef: 'bass'
      });

      if (accidental) {
        staveNote.addModifier(new VexFlow.Accidental(accidental), 0);
      }
      return staveNote;
    });

      Formatter.FormatAndDraw(context, stave, vexNotes);

      x += barWidth;
    }
  }

  async function playNotes(notes: string[]) {
    await Tone.start(); // Ensures AudioContext is resumed
      if (player) {
      player.dispose();
    }
    const synth = new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination();
    player = new Tone.Part((time, note) => {
      synth.triggerAttackRelease(note, '8n', time);
    }, notes.map((n, i) => [i * 0.5, n]));
    player.loop = loop;
    player.loopEnd = `${notes.length * 0.5}`;
    Tone.getTransport().bpm.value = tempo;
    player.start(0);
    Tone.getTransport().start();
  }

  function stopPlayback() {
    if (player) {
      player.stop();
      player.cancel(); // ensures all scheduled events are cleared
    }
    if (Tone.getTransport().state !== "stopped") {
      Tone.getTransport().stop();
    }
  }

  function generate() {
    const chords = parseChords(chordsInput);
    const notes = generateBassLine(chords);
    generatedNotes = notes;
    drawNotes(notes);
  }

  $effect(() => {
    if (generatedNotes.length) drawNotes(generatedNotes);
  });
</script>

<div class="editor">
  <label>
    Grille d'accords:
    <textarea bind:value={chordsInput} rows="2" ></textarea>
    <div>{generatedNotes.join(', ')}</div>
  </label>

  <label>
    Tempo:
    <input type="number" bind:value={tempo} min="40" max="240" />
  </label>

  <label>
    <input type="checkbox" bind:checked={loop} /> Lecture en boucle
  </label>

  <div class="buttons">
    <button onclick={generate}>Générer</button>
    <button onclick={() => playNotes(generatedNotes)}>Écouter</button>
    <button onclick={stopPlayback}>Stop</button>
  </div>

  <div bind:this={container} class="notation"></div>
</div>

<style>
  .editor {
    background: #fff7f3;
    border: 2px solid #ffe0d1;
    border-radius: 1rem;
    padding: 1.5rem;
    max-width: 800px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  textarea, input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 1rem;
  }
  .buttons button {
    background: #f7c59f;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-weight: bold;
    color: #502d63;
    cursor: pointer;
  }
  .buttons button:hover {
    background: #f4a261;
  }
  .notation {
    margin-top: 1rem;
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
  }
</style>
