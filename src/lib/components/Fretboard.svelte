<script lang="ts">
  import { Interval, Note } from "tonal";
  import { toBemol, toDiese } from "$lib/music";

  // Définition des types pour la clarté
  interface Props {
    // Nombre de frettes à afficher (ex: 12, 15, 24)
    fretCount?: number;
    // Ex: ["C", "D#", "F"] - on peut aussi utiliser des notes avec octave, mais on se base sur le pitch class
    // affichées en bleu
    specialNotesToHighlight?: string[];
    // Ex: ["C", "D#", "F"] - on peut aussi utiliser des notes avec octave, mais on se base sur le pitch class
    // affichées en rouge
    notesToHighlight?: string[];
    // Option pour préférer les dièses ou les bémols dans l'affichage
    preferredAccidental?: 'sharp' | 'flat';
    // Optionnel : tuning pour permettre d'afficher différents types de manches (guitare, basse, etc.)
    // Ex: ["G2", "D2", "A1", "E1"] pour une basse 4 cordes
    // Corde la plus aiguë en premier (ordre de haut en bas dans l'affichage)
    tuning?: string[];
    // Callback optionnel pour gérer les clics sur les notes
    onNote?: (noteName: string) => void;
  }

  // Utilisation de la déstructuration des props avec valeurs par défaut
  let { 
    fretCount = 12,
    specialNotesToHighlight = [],
    notesToHighlight = [],
    preferredAccidental = 'sharp',
    tuning = ["G2", "D2", "A1", "E1"],
    onNote
  }: Props = $props();

  const normalize = $derived(preferredAccidental === 'flat' ? toBemol : toDiese);


  // Helper pour vérifier la présence d'une note (indépendamment de l'octave)  
  const shouldHighlightNote = (noteName: string) => {
    // noteName peut être "C4", "D#3", etc. On veut comparer uniquement les pitch classes (C, C#, D, etc.)
    if (notesToHighlight.length === 0) return false;
    if (!noteName) return false;
    const normalizedNoteName = normalize(Note.get(noteName).pc);
    console.log(`note name: ${noteName} - ${Note.get(noteName).pc} - Normalized : ${normalizedNoteName}`);
    const pc = Note.get(normalizedNoteName).pc;
    const shouldHighlight = notesToHighlight.some(n => Note.get(normalize(n)).pc === pc);
    console.log(`Checking if ${noteName}(${normalizedNoteName}) should be highlighted, pitch class: ${pc}, shouldHighlight: ${shouldHighlight}`);
    return shouldHighlight;
  };

  // Construction de la matrice du manche
  let strings = $derived(
    tuning.map(openNote => Array.from({ length: fretCount + 1 }, (_, fret) => 
      // On convertit le numéro de la case en intervalle (ex: 3 -> "3m")
      Note.transpose(openNote, Interval.fromSemitones(fret))
    ))  
  );

  const shouldShowSimpleInlay = (fretIndex: number) => {
    // Cases d'inlays standard pour guitare basse (repeating pattern every 12 frets)
    const fretInOctave = fretIndex % 12;
    return [3, 5, 7, 9].includes(fretInOctave);
  };

  const shouldShowDoubleInlay = (fretIndex: number) => {
    // Cases d'inlays doubles pour guitare basse
    return fretIndex % 12 === 0 && fretIndex !== 0; // Inlay double à la 12ème case, 24ème, etc. (pas à la 0)
  };

</script>

<p>
  Préférence pour les altérations : {preferredAccidental} <br/>
  Nombre de frettes : {fretCount} <br/>
  Tuning : {tuning.join(", ")} <br/>
  Notes à mettre en évidence : {notesToHighlight.join(", ")} <br/>
  Note(s) spéciale(s) : {specialNotesToHighlight.join(", ")} <br/>
  Pitch Class des notes à mettre en évidence : {notesToHighlight.map(n => Note.get(n).pc).join(", ")}
</p>

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
  {@const pc = normalize(Note.get(noteName).pc)}
  {@const active = shouldHighlightNote(noteName)}
  {@const isSpecial = specialNotesToHighlight.includes(pc)}

  <div class="fret" class:nut={fIndex === 0}>
    <div class="string-line" style="height: {sIndex + 1}px"></div>

    {#if active}
      <button 
        title={`Fret ${fIndex}, String ${sIndex + 1}, Note ${noteName}`}
        class="note-marker" 
        class:isSpecial
        onclick={() => onNote?.(noteName)}
      >
        {pc}
      </button>
    {:else}
      <button 
        title={`Fret ${fIndex}, String ${sIndex + 1}, Note ${noteName}`}
        class="hidden-note-marker"
        onclick={() => onNote?.(noteName)}
        aria-label={`Fret ${fIndex}, String ${sIndex + 1}, Note ${noteName}`}
      >{pc}</button>
    {/if}

    {#if sIndex === 1 && shouldShowSimpleInlay(fIndex)}
       <div class="inlay"></div>
    {:else if sIndex === 1 && shouldShowDoubleInlay(fIndex)}
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
    cursor: pointer;
  }
  .hidden-note-marker {
    z-index: 10;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: transparent;
    color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
  }

  .isSpecial { background: #ef4444; }

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