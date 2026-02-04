<script lang="ts">
  import { Interval, Note, Scale } from "tonal";

  // Définition des types pour la clarté
  interface Props {
    root?: string;
    scaleType?: string;
    fretCount?: number;
  }

  // Utilisation de la déstructuration des props avec valeurs par défaut
  let { root = "C", scaleType = "major", fretCount = 12 }: Props = $props();

  const tuning = ["G2", "D2", "A1", "E1"];

  // État dérivé : se recalcule automatiquement quand root ou scaleType change
  let scaleNotes = $derived(Scale.get(`${root} ${scaleType}`).notes);

  // Helper pour vérifier la présence d'une note (indépendamment de l'octave)
  const isNoteInScale = (noteName: string) => {
    const pc = Note.get(noteName).pc;
    return scaleNotes.some(s => Note.get(s).pc === pc);
  };

  // Construction de la matrice du manche
  let strings = $derived(
  tuning.map(openNote => 
    Array.from({ length: fretCount + 1 }, (_, fret) => 
      // On convertit le numéro de la case en intervalle (ex: 3 -> "3m")
      Note.transpose(openNote, Interval.fromSemitones(fret))
    )
  )
);
</script>

<div class="fretboard">
  {#each strings as stringNotes, sIndex}
    <div class="string">
      {#each stringNotes as note, fIndex}
        {@render fret(note, fIndex, sIndex)}
      {/each}
    </div>
  {/each}
</div>

{#snippet fret(noteName: string, fIndex: number, sIndex: number)}
  {@const pc = Note.get(noteName).pc}
  {@const active = isNoteInScale(noteName)}
  {@const isRoot = pc === root}

  <div class="fret" class:nut={fIndex === 0}>
    <div class="string-line" style="height: {sIndex + 1}px"></div>

    {#if active}
      <div class="note-marker" class:isRoot>
        {pc}
      </div>
    {/if}

    {#if sIndex === 1 && ([3, 5, 7, 9, 12+3, 12+5, 12+7, 12+9].includes(fIndex))}
       <div class="inlay"></div>
    {:else if sIndex === 1 && (fIndex === 12 || fIndex === 24)}
       <div class="inlay double-inlay-top"></div>
       <div class="inlay double-inlay-bottom"></div>
    {/if}
  </div>
{/snippet}

<style>
  .fretboard {
    display: flex;
    flex-direction: column;
    background: #2a1b0e;
    border-radius: 4px;
    padding: 20px 0;
    box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .string {
    display: flex;
    position: relative;
    height: 50px;
    width: max-content;
  }

  .fret {
    flex: 0 0 60px;
    width: 60px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 2px solid #888888;
  }

  .nut { border-right: 8px solid #e5e5e5; }

  .string-line {
    position: absolute;
    width: 100%;
    background: linear-gradient(to bottom, #737373, #424242, #737373);
    z-index: 1;
    pointer-events: none;
  }

  .note-marker {
    z-index: 10;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .isRoot { background: #ef4444; }

  .inlay {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    z-index: 0;
  }
  
  .double-inlay-top { 
    top: 0%;
    z-index: 100;
  }
  .double-inlay-bottom {
    top: 200%;
    z-index: 100;
  }
</style>