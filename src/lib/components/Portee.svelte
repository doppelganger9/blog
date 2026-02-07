<script lang="ts">
  import * as Tone from 'tone';
  import VexFlow, { Renderer, Stave, StaveNote, Formatter } from 'vexflow';

  let { 
    clef = 'bass', 
    notes = ['C', 'E', 'G'] 
  } = $props<{ 
    clef: 'bass' | 'treble';
    notes: string[];
  }>();

  let container: HTMLDivElement;

  function drawNotes(notes: string[], clef: string) {
    if (!container) return;
    container.innerHTML = '';

    const notesPerBar = 4;
    const numBars = Math.ceil(notes.length / notesPerBar);
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    const barWidth = 180; // augmenté pour accommoder les accidentels
    const totalWidth = numBars * (barWidth + 40) + 20;
    renderer.resize(totalWidth, 200);
    const context = renderer.getContext();

    let x = 10;
    for (let bar = 0; bar < numBars; bar++) {
      const stave = new Stave(x, 40, barWidth);
      if (bar === 0) {
        stave.addClef(clef);
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
          clef: clef
        });

        if (accidental) {
          staveNote.addModifier(new VexFlow.Accidental(accidental), 0);
        }
        return staveNote;
      });

      Formatter.FormatAndDraw(context, stave, vexNotes);

      x += barWidth + 5;
    }
  }

  $effect(() => {
    if (notes.length) {
      console.log(`Drawing notes on staff: ${notes.join(', ')} with clef: ${clef}`);
      drawNotes(notes, clef);
    }
  });
</script>

<div class="portee">
  <div bind:this={container} class="notation"></div>
</div>

<style>
  .portee {
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
  .notation {
    margin-top: 1rem;
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
  }
</style>
