<script lang="ts">
	import Track from '$lib/components/Track.svelte';

	interface TrackData {
		id: number;
		audioURL: string;
		audioBlob: Blob;
	}

	// --- Nos états avec les runes Svelte 5 ---
	let isRecording = $state(false);
	let tracks = $state<TrackData[]>([]);
  let nextId = $state(1); // Utilisons un ID qui ne dépend pas de la longueur du tableau


	// Variables pour gérer l'enregistrement
	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];

	async function startRecording() {
		try {
			// Demande la permission d'utiliser le micro
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			isRecording = true;

			mediaRecorder = new MediaRecorder(stream);
			
			// On vide les anciens morceaux
			audioChunks = [];
			
			// Quand des données sont disponibles, on les stocke
			mediaRecorder.ondataavailable = (event) => {
				audioChunks.push(event.data);
			};
			
			// Quand l'enregistrement s'arrête, on crée la piste
			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
				const audioURL = URL.createObjectURL(audioBlob);

				// Ajoute la nouvelle piste à notre état réactif
				tracks.push({
					id: nextId,
					audioURL,
					audioBlob
				});
        nextId += 1; // Incrémente l'ID pour la prochaine piste

				// On arrête les pistes du micro pour que le navigateur n'affiche plus l'icône "enregistrement"
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();

		} catch (err) {
			console.error("Erreur d'accès au microphone:", err);
			alert("Impossible d'accéder au microphone. Veuillez vérifier les permissions de votre navigateur.");
		}
	}

	function stopRecording() {
		if (mediaRecorder) {
			mediaRecorder.stop();
			isRecording = false;
		}
	}
  
	function deleteTrack(idToDelete: number) {
		tracks = tracks.filter(t => t.id !== idToDelete);
	}
</script>

<div class="container">
	<header>
		<h1>🎙️ Enregistreur Audio Multi-pistes</h1>
		<p>Cliquez pour enregistrer une nouvelle piste audio, puis jouez-la ou mettez-la en boucle.</p>
	</header>

	<section class="recorder-control">
		{#if isRecording}
			<button class="record-btn stop" onclick={stopRecording}>
				■ Arrêter l'enregistrement
			</button>
			<div class="recording-indicator">
				<span></span> Enregistrement en cours...
			</div>
		{:else}
			<button class="record-btn start" onclick={startRecording}>
				● Enregistrer une nouvelle piste
			</button>
		{/if}
	</section>

	<section class="track-list">
		{#if tracks.length > 0}
			<h2>Mes Pistes</h2>
			<div class="tracks-container">
				{#each tracks as track}
					<Track {track} onDelete={() => deleteTrack(track.id)} />
				{/each}
			</div>
		{:else}
			<p class="no-tracks">Aucune piste enregistrée. Cliquez sur le bouton ci-dessus pour commencer !</p>
		{/if}
	</section>

</div>

<style>
	.container {
		max-width: 900px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: sans-serif;
	}
	header {
		text-align: center;
		margin-bottom: 2rem;
	}
	h1 { color: #1e293b; }
	.recorder-control {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 3rem;
	}
	.record-btn {
		font-size: 1.2rem;
		padding: 1rem 2rem;
		border: none;
		border-radius: 50px;
		color: white;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.record-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 20px rgba(0,0,0,0.1);
	}
	.start { background-color: #dc2626; }
	.stop { background-color: #1d4ed8; }
	.recording-indicator {
		display: inline-flex;
		align-items: center;
		margin-top: 1rem;
		color: #475569;
	}
	.recording-indicator span {
		width: 10px;
		height: 10px;
		background-color: #dc2626;
		border-radius: 50%;
		margin-right: 0.5rem;
		animation: pulse 1.5s infinite;
	}
	@keyframes pulse {
		0% { opacity: 1; }
		50% { opacity: 0.2; }
		100% { opacity: 1; }
	}
	.track-list {
		margin-top: 2rem;
	}
	.tracks-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.no-tracks {
		text-align: center;
		color: #64748b;
		background-color: #f8fafc;
		padding: 2rem;
		border-radius: 8px;
	}
</style>