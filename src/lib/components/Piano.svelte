<script lang="ts">
	import { toSolfege } from '$lib/music';
  import { Note } from "tonal"
  
  let { 
    notesToHighlight = [], 
    notation = 'scientific' 
  } = $props<{ 
    notesToHighlight?: string[]; 
    notation?: 'scientific' | 'solfege'; 
  }>();

	const pianoKeys = [
		{ note: 'C', type: 'white' }, { note: 'C#', type: 'black' },
		{ note: 'D', type: 'white' }, { note: 'D#', type: 'black' },
		{ note: 'E', type: 'white' },
		{ note: 'F', type: 'white' }, { note: 'F#', type: 'black' },
		{ note: 'G', type: 'white' }, { note: 'G#', type: 'black' },
		{ note: 'A', type: 'white' }, { note: 'A#', type: 'black' },
		{ note: 'B', type: 'white' }
	];

	// LOGIQUE AMÉLIORÉE : On se base sur le "chroma" (valeur numérique de 0 à 11)
	// pour gérer les notes enharmoniques (ex: C# et Db).
	const highlightedChromaSet = $derived(
		new Set(notesToHighlight.map(n => Note.chroma(n)))
	);

	function isKeyHighlighted(keyNote: string): boolean {
		const keyChroma = Note.chroma(keyNote);
		return highlightedChromaSet.has(keyChroma);
	}
</script>

<div class="piano">
	{#each pianoKeys as { note, type }}
		<div
			class="key {type}"
			class:highlighted={isKeyHighlighted(note)}
		>
			<div class="note-name">
				{notation === 'solfege' ? toSolfege(note) : note}
			</div>
		</div>
	{/each}
</div>

<style>
	.piano { display: flex; height: 180px; }
	.key {
		border: 1px solid #333;
		border-radius: 0 0 5px 5px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 10px;
		font-weight: bold;
		position: relative;
	}
	.white {
		width: 60px;
		height: 100%;
		background-color: white;
		color: #333;
		z-index: 1;
	}
	.black {
		width: 38px;
		height: 60%;
		background-color: #333;
		color: white;
		margin: 0 -19px;
		z-index: 2;
	}
	.highlighted {
		background-color: #3b82f6; /* Un joli bleu pour la surbrillance */
		color: white;
	}
	.note-name {
		opacity: 0.7;
		font-size: 0.9em;
	}
</style>