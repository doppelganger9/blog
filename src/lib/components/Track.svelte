<script lang="ts">
	import { onDestroy } from 'svelte';

	interface TrackData {
		id: number;
		audioURL: string;
		audioBlob: Blob;
	}

	// On reçoit les données de la piste en props
	let { track } = $props<{ track: TrackData }>();
	
	// États locaux au composant
	let isLooping = $state(false);
	let isPlaying = $state(false);
	
	// Références aux éléments HTML
	let audioPlayer: HTMLAudioElement;
	let canvas: HTMLCanvasElement;
	
	let animationFrameId: number;

	function togglePlay() {
		if (audioPlayer.paused) {
			audioPlayer.play();
		} else {
			audioPlayer.pause();
		}
	}
	
	function toggleLoop() {
		isLooping = !isLooping;
	}

	// La magie de la visualisation !
	function drawWaveform() {
		// On crée le contexte audio uniquement pour la visualisation
		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 2048;
		
		const source = audioContext.createMediaElementSource(audioPlayer);
		source.connect(analyser);
		analyser.connect(audioContext.destination);
		
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		const ctx = canvas.getContext('2d')!;

		function draw() {
			animationFrameId = requestAnimationFrame(draw);
			
			analyser.getByteTimeDomainData(dataArray);

			ctx.fillStyle = 'rgb(241, 245, 249)'; // Couleur de fond du canvas
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#3b82f6'; // Couleur de la ligne
			ctx.beginPath();
			
			const sliceWidth = canvas.width * 1.0 / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0; // Normalise la valeur
				const y = v * canvas.height / 2;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				x += sliceWidth;
			}
			ctx.lineTo(canvas.width, canvas.height / 2);
			ctx.stroke();
		}
		draw();
	}
	
	// On s'assure de nettoyer l'animation quand le composant est détruit
	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
	});
</script>

<div class="track">
	<span class="track-id">Piste {track.id}</span>
	
	<div class="controls">
		<button onclick={togglePlay} class="play-btn">{isPlaying ? '❚❚' : '▶'}</button>
		<button onclick={toggleLoop} class="loop-btn" class:active={isLooping}>⥀ Boucle</button>
	</div>

	<div class="waveform-container">
		<canvas bind:this={canvas} width="600" height="80"></canvas>
	</div>

	<audio
		bind:this={audioPlayer}
		src={track.audioURL}
		loop={isLooping}
		onplay={() => isPlaying = true}
		onpause={() => isPlaying = false}
		onloadeddata={drawWaveform}
	></audio>
</div>

<style>
	.track {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		background-color: #fff;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}
	.track-id { font-weight: bold; font-family: monospace; }
	.controls { display: flex; gap: 0.5rem; }
	button {
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border: 1px solid #cbd5e1;
		background-color: white;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
	}
	button:hover { background-color: #f8fafc; }
	.play-btn { width: 50px; font-size: 1.2rem; }
	.loop-btn.active {
		background-color: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}
	.waveform-container {
		flex-grow: 1;
		background-color: #f1f5f9;
		border-radius: 4px;
	}
	canvas { display: block; width: 100%; height: 80px; }
</style>