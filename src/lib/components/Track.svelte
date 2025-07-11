<script lang="ts">
	import { onDestroy } from 'svelte';

	interface TrackData {
		id: number;
		audioURL: string;
		audioBlob: Blob;
	}
	
	// --- PROPS ---
	let { track, onDelete } = $props<{ track: TrackData; onDelete: () => void }>();
	
	// --- ÉTATS LOCAUX ---
	let playbackRate = $state(1);
	let isPlaying = $state(false);
	let isLooping = $state(false);
	
	// --- RÉFÉRENCES & AUDIO API ---
	let canvas: HTMLCanvasElement;
	let audioBuffer: AudioBuffer | null = null;
	let audioContext: AudioContext | null = null;
	let sourceNode: AudioBufferSourceNode | null = null;
	
	// --- DÉCOUPAGE (TRIMMING) ---
	let trim = $state({ start: 0, end: 1 });
	let dragging: 'start' | 'end' | null = null;

	// --- SETUP AUDIO ---
	$effect(() => {
		// On ne crée le contexte qu'une seule fois
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		
		track.audioBlob.arrayBuffer().then(arrayBuffer => {
			audioContext?.decodeAudioData(arrayBuffer, (buffer) => {
				audioBuffer = buffer;
			});
		});
	});

  /*
	// --- LOGIQUE DE DESSIN ---
	function drawFullWaveform(buffer: AudioBuffer) {
		if (!canvas) return;
		const ctx = canvas.getContext('2d')!;
		const data = buffer.getChannelData(0);
		const step = Math.ceil(data.length / canvas.width);
		const amp = canvas.height / 2;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#f1f5f9';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#64748b';
		ctx.lineWidth = 1;
		ctx.beginPath();
		
		for (let i = 0; i < canvas.width; i++) {
			let min = 1.0;
			let max = -1.0;
			for (let j = 0; j < step; j++) {
				const datum = data[(i * step) + j];
				if (datum < min) min = datum;
				if (datum > max) max = datum;
			}
			ctx.moveTo(i, (1 + min) * amp);
			ctx.lineTo(i, (1 + max) * amp);
		}
		ctx.stroke();
		
		// Dessin des poignées de découpage
		ctx.strokeStyle = '#dc2626';
		ctx.lineWidth = 2;

		const startX = trim.start * canvas.width;
		ctx.beginPath();
		ctx.moveTo(startX, 0);
		ctx.lineTo(startX, canvas.height);
		ctx.stroke();

		const endX = trim.end * canvas.width;
		ctx.beginPath();
		ctx.moveTo(endX, 0);
		ctx.lineTo(endX, canvas.height);
		ctx.stroke();
	}

	// --- L'EFFET RÉACTIF CORRIGÉ ---
	$effect(() => {
		// Cet effet dépend maintenant de `audioBuffer` ET de `trim`.
		// Si l'un des deux change, le canvas sera redessiné.
		if (audioBuffer) {
			drawFullWaveform(audioBuffer);
		}
	});*/

	// --- CONTRÔLES DE LECTURE ---
	function play() {
		if (!audioContext || !audioBuffer) return;
		if (isPlaying) {
			sourceNode?.stop();
			isPlaying = false;
			return;
		}

		audioContext.resume(); // Bonne pratique pour s'assurer que le contexte est actif
		sourceNode = audioContext.createBufferSource();
		sourceNode.buffer = audioBuffer;
		sourceNode.playbackRate.value = playbackRate;
		sourceNode.loop = isLooping;
		sourceNode.connect(audioContext.destination);

		const offset = trim.start * audioBuffer.duration;
		const duration = (trim.end - trim.start) * audioBuffer.duration;
		
		sourceNode.start(0, offset, isLooping ? undefined : duration);
		isPlaying = true;
		sourceNode.onended = () => { isPlaying = false; };
	}

	function saveSample() {
		const link = document.createElement('a');
		link.href = track.audioURL;
		link.download = `sample-piste-${track.id}.wav`;
		link.click();
	}

	// --- GESTION DU DRAG & DROP POUR LE DÉCOUPAGE ---
	function handleMouseDown(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const startHandlePos = trim.start * canvas.width;
		const endHandlePos = trim.end * canvas.width;
		if (Math.abs(x - startHandlePos) < 10) dragging = 'start';
		else if (Math.abs(x - endHandlePos) < 10) dragging = 'end';
	}
	function handleMouseMove(e: MouseEvent) {
		if (!dragging) return;
		const rect = canvas.getBoundingClientRect();
		let pos = (e.clientX - rect.left) / canvas.width;
		pos = Math.max(0, Math.min(1, pos));

		// On met simplement à jour l'état. Svelte s'occupe du reste.
		if (dragging === 'start' && pos < trim.end) {
			trim.start = pos;
		}
		if (dragging === 'end' && pos > trim.start) {
			trim.end = pos;
		}
	}
	
	function handleMouseUp() {
		dragging = null;
	}
</script>

<div class="track">
	<div class="main-controls">
		<span class="track-id">Piste {track.id}</span>
		<button onclick={play} class="play-btn">{isPlaying ? '❚❚' : '▶'}</button>
		<button onclick={() => isLooping = !isLooping} class="loop-btn" class:active={isLooping}>⥀</button>
		<button onclick={saveSample} title="Enregistrer le sample">💾</button>
		<button onclick={onDelete} title="Supprimer la piste" class="delete-btn">🗑️</button>
	</div>

  <!--
	<div 
		class="waveform-container"
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
	>
		<canvas bind:this={canvas} width="600" height="80"></canvas>
	</div>
-->
	<div class="extra-controls">
		<label for="speed-{track.id}">Vitesse</label>
		<input 
			id="speed-{track.id}"
			type="range" 
			bind:value={playbackRate} 
			min="0.5" max="2" step="0.05" 
		/>
		<span>{playbackRate.toFixed(2)}x</span>
	</div>
</div>


<style>
	/* Styles un peu plus denses pour accueillir les nouvelles fonctions */
	.track {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: #fff;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}
	.main-controls, .extra-controls { display: flex; align-items: center; gap: 0.75rem; }
	.track-id { font-weight: bold; font-family: monospace; margin-right: auto; }
	button { /* ... styles de bouton ... */ }
	.waveform-container {
		cursor: grab;
		background-color: #f1f5f9;
		border-radius: 4px;
	}
	.waveform-container:active { cursor: grabbing; }
	canvas { display: block; width: 100%; height: 80px; }
	.extra-controls { font-size: 0.9em; color: #475569; }
	.extra-controls input[type="range"] { flex-grow: 1; }
	.delete-btn { background: #fee2e2; color: #991b1b; border: none; }
</style>