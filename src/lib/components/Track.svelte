<script lang="ts">
  import * as Tone from 'tone';
  import { bufferToWav } from '$lib/wavEncoder';

	// --- ÉTAT & PROPS ---
	export interface TrackData {
		id: number;
		audioURL: string;
		audioBlob: Blob;
	}
	let { track, onDelete } = $props<{ track: TrackData; onDelete: () => void }>();
	
	let playbackRate = $state(1);
	let isPlaying = $state(false);
	let isLooping = $state(false);
	let trim = $state({ start: 0, end: 1 });
  let player = $state<'audioContext' | 'toneJS'>('audioContext'); // Choix du moteur de lecture

  let tonePlayer: Tone.Player | null = null;
  let pitchShift: Tone.PitchShift | null = null;
	
	// --- RÉFÉRENCES & AUDIO API ---
	let canvas: HTMLCanvasElement;
	// On n'utilise PAS $state pour des objets complexes comme AudioBuffer
	let audioBuffer: AudioBuffer | null = null;
	let audioContext: AudioContext | null = null;
	let sourceNode = $state<AudioBufferSourceNode | null>(null);
	let dragging = $state<'start' | 'end' | null>(null);

	// --- LOGIQUE DE DESSIN (FIABLE) ---
	function draw() {
		if (!canvas || !audioBuffer) return;
		
		const ctx = canvas.getContext('2d')!;
		const { width, height } = canvas;
		const amp = height / 2;

		// 1. Dessiner le fond
		ctx.fillStyle = '#f1f5f9';
		ctx.fillRect(0, 0, width, height);
		
		// 2. Dessiner la forme d'onde
		const data = audioBuffer.getChannelData(0);
		const step = Math.ceil(data.length / width);
		
		ctx.strokeStyle = '#64748b';
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let i = 0; i < width; i++) {
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

		// 3. Dessiner les poignées de découpage
		ctx.strokeStyle = '#dc2626';
		ctx.lineWidth = 3; // Un peu plus épaisses pour mieux les voir

		const startX = trim.start * width;
		ctx.beginPath();
		ctx.moveTo(startX, 0);
		ctx.lineTo(startX, height);
		ctx.stroke();

		const endX = trim.end * width;
		ctx.beginPath();
		ctx.moveTo(endX, 0);
		ctx.lineTo(endX, height);
		ctx.stroke();
	}
	
	// --- GESTION DU CYCLE DE VIE & DES ÉVÉNEMENTS ---
	
	// $effect pour l'initialisation (1 seule fois)
	$effect(() => {
		audioContext = new AudioContext();
		track.audioBlob.arrayBuffer().then(arrayBuffer => {
			audioContext?.decodeAudioData(arrayBuffer, (buffer) => {
				audioBuffer = buffer;
				draw(); // On fait le premier dessin ici, une fois les données prêtes.
			});
		});
	});

	$effect(() => {
		// On redessine uniquement si tout est prêt.
		if (audioBuffer && canvas) {
			draw();
		}
	});

	// Les fonctions de contrôle restent les mêmes
	function playWithAudioContext() {
		if (!audioContext || !audioBuffer) return;
		if (isPlaying) {
			sourceNode?.stop();
			isPlaying = false;
			return;
		}

		audioContext.resume();
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

  async function playWithToneJS() {
    if (isPlaying) {
      tonePlayer?.stop();
      isPlaying = false;
      return;
    }

    await Tone.start();

    // Create PitchShift effect
    if (!pitchShift) {
      pitchShift = new Tone.PitchShift().toDestination();
    }

    // Calculate pitch correction in semitones
    // If playbackRate < 1, pitch drops, so we need to raise it
    // Correction = -12 * log2(playbackRate)
    const correction = -12 * Math.log2(playbackRate);

    pitchShift.pitch = correction;

    // Create Player
    if (tonePlayer) {
      tonePlayer.dispose();
    }
    tonePlayer = new Tone.Player({
      url: track.audioURL,
      playbackRate,
      loop: isLooping,
      autostart: false,
      onstop: () => { isPlaying = false; }
    }).connect(pitchShift);

    // Wait for the player to load
    await tonePlayer.load(track.audioURL);

    // Calculate offset and duration for trimming
    const audioDuration = tonePlayer.buffer?.duration ?? 0;
    const offset = trim.start * audioDuration;
    const duration = (trim.end - trim.start) * audioDuration;

    tonePlayer.start(0, offset, duration);
    isPlaying = true;
  }

	function saveSample() {
		if (!audioBuffer || !audioContext) return;

		// 1. Calculer les caractéristiques de la portion découpée
		const startSample = Math.floor(trim.start * audioBuffer.length);
		const endSample = Math.floor(trim.end * audioBuffer.length);
		const trimmedLength = endSample - startSample;

		if (trimmedLength <= 0) return; // Ne rien faire si la sélection est vide

		// 2. Créer un nouveau AudioBuffer pour la partie découpée
		const trimmedBuffer = audioContext.createBuffer(
			audioBuffer.numberOfChannels,
			trimmedLength,
			audioBuffer.sampleRate
		);

		// 3. Copier les données de la portion sélectionnée dans le nouveau buffer
		for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
			const channelData = audioBuffer.getChannelData(i);
			const trimmedData = trimmedBuffer.getChannelData(i);
			trimmedData.set(channelData.subarray(startSample, endSample));
		}

		// 4. Utiliser notre encodeur pour créer un Blob WAV valide
		const wavBlob = bufferToWav(trimmedBuffer);
		
		// 5. Créer une URL temporaire pour ce Blob et déclencher le téléchargement
		const url = URL.createObjectURL(wavBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `sample-piste-${track.id}-trimmed.wav`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url); // Nettoyer l'URL temporaire
	}


	function handleMouseDown(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const startHandlePos = trim.start * rect.width;
		const endHandlePos = trim.end * rect.width;
		// Zone de clic un peu plus large
		if (Math.abs(x - startHandlePos) < 10) {
      dragging = 'start';
    } else if (Math.abs(x - endHandlePos) < 10) {
      dragging = 'end';
    } else {
      dragging = null; // Si on n'est pas sur une poignée, on ne fait rien
    }
    draw();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!dragging) return;
		const rect = canvas.getBoundingClientRect();
		let pos = (e.clientX - rect.left) / rect.width;
		pos = Math.max(0, Math.min(1, pos));

		if (dragging === 'start' && pos < trim.end - 0.01) { // Empêche de croiser
			trim.start = pos;
		}
		if (dragging === 'end' && pos > trim.start + 0.01) { // Empêche de croiser
			trim.end = pos;
		}
    draw();
	}

	function handleMouseUp() {
    console.log("handleMouseUp", dragging);
    //if (!dragging) return;
		dragging = null;
    draw();
	}
</script>

<div class="track">
	<div class="main-controls">
		<span class="track-id">Piste {track.id}</span>
    {player}
    <select bind:value={player} class="player-select" title="Sélectionner le moteur de lecture">
      <option value="audioContext" selected>AudioContext</option>
      <option value="toneJS">Tone.js</option>
    </select>
		<button onclick={player === 'audioContext' ? playWithAudioContext : playWithToneJS} class="play-btn" title={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? '❚❚' : '▶'}</button>
		<button onclick={() => isLooping = !isLooping} class="loop-btn" class:active={isLooping} title="Boucle">⥀</button>
		<button onclick={saveSample} title="Enregistrer le sample">💾</button>
		<button onclick={onDelete} title="Supprimer la piste" class="delete-btn">🗑️</button>
	</div>

	<div 
    role="waveform"
    aria-label="Forme d'onde de la piste audio"
		class="waveform-container"
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
	>
		<canvas bind:this={canvas} width="540" height="80"></canvas>
	</div>
	
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
	/* Le CSS ne change pas, il est déjà correct */
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
	button {
		font-size: 1rem;
		padding: 0.5rem;
		width: 44px;
		height: 44px;
		border: 1px solid #cbd5e1;
		background-color: white;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	button:hover { background-color: #f8fafc; }
	.loop-btn.active {
		background-color: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}
	.delete-btn { background: #fee2e2; color: #991b1b; border: none; }
	.waveform-container {
		cursor: col-resize;
		background-color: #f1f5f9;
		border-radius: 4px;
	}
	canvas { display: block; width: 100%; height: 80px; }
	.extra-controls { font-size: 0.9em; color: #475569; }
	.extra-controls input[type="range"] { flex-grow: 1; }
</style>