<script lang="ts">
import { Scale, Chord } from 'tonal';
	import {
		SCALES,
		CHORDS,
		PITCH_CLASSES,
		ACCIDENTALS,
		CHORD_DESCRIPTIONS,
		toSolfege
	} from '$lib/music';
	import { audioEngine } from '$lib/AudioEngine';
	import Piano from '$lib/components/Piano.svelte';

	// --- ÉTAT (Modifié pour une sélection plus fine) ---
	let selectedPitch = $state('C');
	let selectedAccidental = $state(''); // '' pour naturel, 'b' pour bémol, '#' pour dièse
	let selectedScale = $state('major');
	let selectedChord = $state('M');
	let notation = $state<'scientific' | 'solfege'>('scientific');

	// --- ÉTATS DÉRIVÉS (Le coeur de la réactivité) ---
	// La note de base est maintenant DÉRIVÉE des deux sélecteurs !
	const selectedRoot = $derived(`${selectedPitch}${selectedAccidental}`);
	
	const scale = $derived(Scale.get(`${selectedRoot} ${selectedScale}`));
	const chord = $derived(Chord.get(`${selectedRoot}${selectedChord}`));
</script>
<div class="container">
	<header>
		<h1>🎵 Explorateur de Gammes et Accords</h1>
		<p>Choisissez une note de base et une gamme ou un accord pour visualiser et écouter.</p>
	</header>

	<section class="controls">
		<div>
			<label for="notation">Notation</label>
			<select id="notation" bind:value={notation}>
				<option value="scientific">Scientifique (C, D, E)</option>
				<option value="solfege">Solfège (Do, Ré, Mi)</option>
			</select>
		</div>
		
		<div class="root-note-control">
			<label>Note de base</label>
			<div class="selectors-group">
				<select id="root-pitch" bind:value={selectedPitch}>
					{#each PITCH_CLASSES as pitch}
						<option value={pitch}>
							{notation === 'solfege' ? toSolfege(pitch) : pitch}
						</option>
					{/each}
				</select>
				<select id="root-accidental" bind:value={selectedAccidental}>
					{#each ACCIDENTALS as acc}
						<option value={acc.value}>{acc.symbol}</option>
					{/each}
				</select>
			</div>
		</div>
	</section>

	<section class="card">
		<h2>Gammes</h2>
		<div class="selection">
			<select bind:value={selectedScale}>
				{#each SCALES as scaleName}
					<option value={scaleName}>{scaleName}</option>
				{/each}
			</select>
			<button onclick={() => audioEngine.playArpeggio(scale.notes)}>Jouer (Arpège)</button>
		</div>
		<p class="note-list">
			{#if scale.notes.length > 0}
				{#each scale.notes as note, i}
					<span>{notation === 'solfege' ? toSolfege(note) : note}{i < scale.notes.length - 1 ? ' - ' : ''}</span>
				{/each}
			{:else}
				<span class="invalid">Gamme non valide pour cette tonique.</span>
			{/if}
		</p>
		<Piano notesToHighlight={scale.notes} {notation} />
	</section>

	<section class="card">
		<h2>Accords</h2>
		<div class="selection">
			<select bind:value={selectedChord}>
				{#each CHORDS as chordType}
					<option value={chordType}>
						{notation === 'solfege' ? toSolfege(selectedRoot) : selectedRoot}{chordType}
						({CHORD_DESCRIPTIONS[chordType] || chordType})
					</option>
				{/each}
			</select>
			<button onclick={() => audioEngine.playChord(chord.notes)}>Jouer (Accord)</button>
		</div>
		<p class="note-list">
			{#if chord.notes.length > 0}
				{#each chord.notes as note, i}
					<span>{notation === 'solfege' ? toSolfege(note) : note}{i < chord.notes.length - 1 ? ' - ' : ''}</span>
				{/each}
			{:else}
				<span class="invalid">Accord non valide pour cette tonique.</span>
			{/if}
		</p>
		<Piano notesToHighlight={chord.notes} {notation} />
	</section>

</div>

<style>
	/* ... Le CSS précédent ... */
	.container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif; }
	header { text-align: center; margin-bottom: 2rem; }
	h1 { color: #1e3a8a; }
	.controls { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; background-color: #f1f5f9; padding: 1rem; border-radius: 8px; }
	.controls > div { flex: 1; min-width: 180px; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
	select { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
	
	/* NOUVEAU STYLE pour grouper les sélecteurs de note */
	.selectors-group { display: flex; gap: 0.25rem; }
	.selectors-group select:first-child { flex-grow: 3; }
	.selectors-group select:last-child { flex-grow: 1; }

	.card { background-color: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
	.selection { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
	.selection select { flex-grow: 1; }
	button { padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
	button:hover { background-color: #2563eb; }
	.note-list { font-family: monospace; font-size: 1.1rem; margin-bottom: 1.5rem; min-height: 1.5rem; }
	.invalid { color: #dc2626; font-style: italic; }
</style>