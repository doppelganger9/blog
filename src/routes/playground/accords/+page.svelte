<script lang="ts">
import { Scale, Chord, Progression } from 'tonal';
	import {
		SCALES,
		CHORDS,
		PITCH_CLASSES,
		ACCIDENTALS,
		CHORD_DESCRIPTIONS,
		PROGRESSIONS,
		toSolfege,
    relativeScale,
	} from '$lib/music';
	import { audioEngine } from '$lib/AudioEngine';
	import Piano from '$lib/components/Piano.svelte';
  import Fretboard from "$lib/components/Fretboard.svelte"
  import Portee from "$lib/components/Portee.svelte"

	// --- ÉTAT (Modifié pour une sélection plus fine) ---
	let selectedPitch = $state('C');
	let selectedAccidental = $state(''); // '' pour naturel, 'b' pour bémol, '#' pour dièse
	let selectedScale = $state('major');
	let selectedChord = $state('M');
	let notation = $state<'scientific' | 'solfege'>('scientific');
	let selectedProgression = $state('IIm7 VMaj7 IMaj7');
	let inputChordProgression = $state('IIm7 VMaj7 IMaj7');
	let chordProgressionDuration = $state('1'); // durée en secondes

	// --- ÉTATS DÉRIVÉS (Le coeur de la réactivité) ---
	// La note de base est maintenant DÉRIVÉE des deux sélecteurs !
	const selectedRoot = $derived(`${selectedPitch}${selectedAccidental}`);
	//const selectedDegree = $derived(`${selectedPitch}${selectedAccidental}`);

	const chordProgression = $derived(Progression.fromRomanNumerals(selectedRoot, inputChordProgression.split(' ')));

	const scale = $derived(Scale.get(`${selectedRoot} ${selectedScale}`));
	const otherScale = $derived(Scale.get(relativeScale(`${selectedRoot} ${selectedScale}`)));
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
				<option value="scientific">Anglaise (C, D, E)</option>
				<option value="solfege">Solfège (Do, Ré, Mi)</option>
			</select>
		</div>
		
		<div class="root-note-control">
			<label for="root-pitch">Tonique/Fondamentale/Note de base</label>
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
			<label for="scale-select">Gamme {toSolfege(selectedRoot)} {selectedScale}</label>
			<select class="scale-select" id="scale-select" bind:value={selectedScale}>
				{#each SCALES as scaleName}
					<option value={scaleName}>{scaleName}</option>
				{/each}
			</select>
			<button onclick={() => audioEngine.playArpeggio(scale.notes)}>Jouer (Arpège)</button>
		</div>
		<p class="note-list">
			{#if scale.notes.length > 0}
				{#each scale.notes as note}
					<button class="note-button" onclick={() => audioEngine.playNote(note, 0.2)}>{notation === 'solfege' ? toSolfege(note) : note}</button>
				{/each}
			{:else}
				<span class="invalid">Gamme non valide pour cette tonique.</span>
			{/if}
		</p>
		<!-- les gammes relatives partagent les même notes donc pas besoin d'afficher 2 piano -->
		<Piano notesToHighlight={scale.notes} {notation} />
		<br/>

		{#if selectedScale === 'minor' || selectedScale === 'major'}
			<span>Gamme relative : {toSolfege(otherScale.name)}</span>
			<button onclick={() => audioEngine.playArpeggio(otherScale.notes)}>Jouer (Arpège)</button>
		{/if}
		<p class="note-list">
			{#if otherScale.notes.length > 0}
				{#each otherScale.notes as note}
					<button class="note-button" onclick={() => audioEngine.playNote(note, 0.2)}>{notation === 'solfege' ? toSolfege(note) : note}</button>
				{/each}
			{:else}
				<span class="invalid">Gamme non valide pour cette tonique.</span>
			{/if}
		</p>
		<Fretboard preferredAccidental={selectedAccidental == 'b' ? 'flat' : 'sharp'} specialNotesToHighlight={[selectedRoot]} notesToHighlight={scale.notes} onNote={(note) => audioEngine.playNote(note, 0.2)} fretCount={22} />
		<Portee notes={scale.notes.map(n => n + '2')} clef={'bass'} />
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
			<input type="text" bind:value={selectedChord} placeholder="Ou entrez un accord personnalisé" />
			<button onclick={() => audioEngine.playChord(chord.notes)}>Jouer (Accord)</button>
		</div>
		<!-- 
		Cet outil permet de visualiser les notes d'une gamme, d'un accord.
		Il me manque une visualisation sur manche de basse.
		Il me manque la gamme relative mineure/majeure.
		Pour les accords, afficher le degré correspondant vis-à-vis de la gamme, pas que les accords de la Fondamentale.
		Accords en degrés pour une tonique donnée, gamme majeure : (I, ii, iii, IV, V, vi, vii°) 
		pour une gamme mineure : (i, ii°, III, iv, v, VI, VII)

		Et aussi la possibilité de jouer des progressions d'accords, type I-IV-V ou ii-V-I.
		-->
		<p class="note-list">
			{#if chord.notes.length > 0}
				{#each chord.notes as note}<button class="note-button" onclick={() => audioEngine.playNote(note, 0.2)}>{notation === 'solfege' ? toSolfege(note) : note}</button>{/each}
			{:else}
				<span class="invalid">Accord non valide pour cette tonique.</span>
			{/if}
		</p>
		<Piano notesToHighlight={chord.notes} {notation} />
		<Fretboard preferredAccidental={selectedAccidental == 'b' ? 'flat' : 'sharp'} specialNotesToHighlight={[selectedRoot]} notesToHighlight={chord.notes} onNote={(note) => audioEngine.playNote(note, 0.2)} fretCount={22} />
		<Portee notes={chord.notes.map(n => n + '2')} clef={'bass'} />
	</section>

	<section class="card">
		<h2>Progression d'accords</h2>
		<div class="selection">
			<select bind:value={selectedProgression} onchange={() =>  inputChordProgression = selectedProgression}>
				{#each PROGRESSIONS as prog}
					<option value={prog}>{prog}</option>
				{/each}
			</select>
			<input type="text" bind:value={inputChordProgression} placeholder="Ou entrez une progression personnalisée" />
			<input class="duration-input" type="text" bind:value={chordProgressionDuration} placeholder="Entrez une durée (en secondes)" />
			<button onclick={() => audioEngine.playChordProgression(chordProgression, 0, 0, parseFloat(chordProgressionDuration) || 1)}>Jouer</button>
		</div>
		<!-- TODO : afficher chaque accord en chiffre romain + notes + montrer la composition de cet accord (notes) -->
		<div class="note-list">
			{#if chordProgression.length > 0}
				<ul>
				{#each chordProgression as chord, i}
					<li><button class="chord-button" onclick={() => audioEngine.playChord(Chord.notes(chord))}>{notation === 'solfege' ? toSolfege(chord) : chord}</button> = 
						{#each Chord.notes(chord) as note}<button class="note-button" onclick={() => audioEngine.playNote(note, 0.2)}>{notation === 'solfege' ? toSolfege(note) : note}</button>{/each}
					</li>
				{/each}
				</ul>
			{:else}
				<span class="invalid">Progression non valide.</span>
			{/if}
		</div>
	</section>

</div>

<style>
	h1, h2, h3 { margin: 0 0 2rem 0; }
	/* ... Le CSS précédent ... */
	.container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif; }
	header { text-align: center; margin-bottom: 2rem; }
	h1 { color: #1e3a8a; }
	.controls { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; background-color: #f1f5f9; padding: 1rem; border-radius: 8px; }
	.controls > div { flex: 1; min-width: 180px; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
	select { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
	.scale-select { width: 200px;}
	
	/* NOUVEAU STYLE pour grouper les sélecteurs de note */
	.selectors-group { display: flex; gap: 0.25rem; }
	.selectors-group select:first-child { flex-grow: 3; }
	.selectors-group select:last-child { flex-grow: 1; }

	.card { background-color: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
	.selection { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
	.selection select { flex-grow: 1; }


	.duration-input { width: 20px; }
	button { padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
	button:hover { background-color: #2563eb; }
	.note-button { color:#1e3a8a; margin: 0 0.25rem; padding: 0.2rem 0.5rem; background-color: #e0e7ff; border: none; border-radius: 4px; cursor: pointer; }
	.note-button:hover { background-color: #c7d2fe; }
	.note-list { font-family: monospace; font-size: 1.1rem; margin-bottom: 1.5rem; min-height: 1.5rem; }
	.note-list li { margin-bottom: 0.5rem; }
	.invalid { color: #dc2626; font-style: italic; }
</style>