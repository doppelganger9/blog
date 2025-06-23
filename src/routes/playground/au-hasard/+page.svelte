<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';

	// --- STATE MANAGEMENT ---
	let participants: string[] = [];
	let resultatTirage: string[] = [];
	let nouveauNom: string = '';

	// --- LOGIC ---
	/**
	 * Ajoute un participant à la liste.
	 */
	function ajouterParticipant(): void {
		if (nouveauNom.trim()) {
			participants = [...participants, nouveauNom.trim()];
			nouveauNom = '';
		}
	}

	/**
	 * Supprime un participant de la liste à un index donné.
	 * @param index L'index du participant à supprimer.
	 */
	function supprimerParticipant(index: number): void {
		participants = participants.filter((_, i) => i !== index);
        resultatTirage = [];
	}

	/**
	 * Mélange la liste des participants en utilisant l'algorithme de Fisher-Yates.
	 */
	function tirerAuSort(): void {
		let tableauAMelanger = [...participants];
		for (let i = tableauAMelanger.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[tableauAMelanger[i], tableauAMelanger[j]] = [tableauAMelanger[j], tableauAMelanger[i]];
		}
		resultatTirage = tableauAMelanger;
	}
</script>

<div class="container">
	<header>
		<h1>Tirage au sort</h1>
		<p>Ajoutez les noms des participants, puis cliquez sur "Tirer au sort" pour définir un ordre de passage aléatoire.</p>
	</header>

	<section class="section-ajout">
		<h2>Participants</h2>
		<form on:submit|preventDefault={ajouterParticipant}>
			<input
				type="text"
				bind:value={nouveauNom}
				placeholder="Entrez un nom..."
				aria-label="Nom du participant"
			/>
			<button type="submit">Ajouter</button>
		</form>

		{#if participants.length > 0}
			<ul class="liste-participants">
				{#each participants as participant, index}
					<li>
						<span>{participant}</span>
						<button on:click={() => supprimerParticipant(index)} class="delete-btn" title="Supprimer {participant}">
							&times;
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<div class="action-container">
		<button 
			class="tirage-btn" 
			on:click={tirerAuSort} 
			disabled={participants.length < 2}
		>
			Tirer au sort !
		</button>
	</div>

{#if resultatTirage.length > 0}
		<section class="section-resultat">
			<h2>Ordre de passage</h2>
			<ol class="liste-resultat">
				{#each resultatTirage as participant, index}
                    {@const colorVarName = `--color-${(index % 10) + 1}`}

					<li class="color-{(index % 10) + 1}">
                        <Avatar name={participant} color={`var(${colorVarName})`} />
						<span class="numero">{index + 1}.</span>
						<span class="nom">{participant}</span>
					</li>
				{/each}
			</ol>
		</section>
	{/if}
</div>

<style>
	:root {
		/* Palette de 10 couleurs vives et contrastées */
		--color-1: #d90429; /* Rouge vif */
		--color-2: #00b4d8; /* Cyan */
		--color-3: #fca311; /* Orange */
		--color-4: #588157; /* Vert */
		--color-5: #8e24aa; /* Violet */
		--color-6: #ff5d8f; /* Rose */
		--color-7: #007f5f; /* Vert Océan */
		--color-8: #e07a5f; /* Saumon */
		--color-9: #3d405b; /* Bleu Nuit */
		--color-10: #2ec4b6; /* Turquoise */
	}

	.container {
		max-width: 700px;
		margin: 2rem auto;
		padding: 1rem 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	header {
		text-align: center;
		border-bottom: 1px solid #e0e0e0;
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}
	
	h1 { color: #333; font-size: 2.5rem; }
    h2 { color: #444; margin-bottom: 1rem; }

	form { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
	input[type="text"] { flex-grow: 1; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
	button { padding: 0.75rem 1.25rem; border: none; border-radius: 4px; background-color: #007bff; color: white; font-size: 1rem; cursor: pointer; transition: background-color 0.2s; }
	button:hover { background-color: #0056b3; }
	button:disabled { background-color: #a0a0a0; cursor: not-allowed; }
	
	.action-container { text-align: center; margin: 2rem 0; }
	.tirage-btn { font-size: 1.2rem; padding: 0.8rem 2.5rem; background-color: #28a745; }
	.tirage-btn:hover:enabled { background-color: #218838; }

	ul, ol { list-style: none; padding: 0; }

	.liste-participants li { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 0.5rem; }
	.delete-btn { background-color: transparent; color: #dc3545; border: none; font-size: 1.5rem; font-weight: bold; line-height: 1; padding: 0 0.5rem; }
	.delete-btn:hover { color: #a71d2a; }

	.liste-resultat li {
		display: flex;
		align-items: center;
		gap: 1rem; /* AJOUT : Crée un espace entre l'avatar, le numéro et le nom */
		font-size: 1.2rem;
		margin-bottom: 0.75rem;
		padding: 0.75rem 1rem; /* J'ai légèrement ajusté le padding */
		border-radius: 6px;
		border-left: 5px solid var(--main-color);
		
		background-color: var(--bg-color);
		color: var(--main-color);
		transition: transform 0.2s ease-out;
	}

	.liste-resultat li:hover {
		transform: scale(1.02);
	}
	
	.liste-resultat .numero {
		font-weight: 900; /* Plus gras */
		font-size: 1.5rem;
	}
	
	.liste-resultat .nom {
		font-weight: 500;
	}

	/* Chaque classe définit les variables de couleur qui seront utilisées par le `li` */
	.color-1 { --main-color: var(--color-1); --bg-color: hsla(351, 96%, 43%, 0.1); }
	.color-2 { --main-color: var(--color-2); --bg-color: hsla(191, 100%, 42%, 0.1); }
	.color-3 { --main-color: var(--color-3); --bg-color: hsla(36, 96%, 52%, 0.15); }
	.color-4 { --main-color: var(--color-4); --bg-color: hsla(116, 21%, 42%, 0.15); }
	.color-5 { --main-color: var(--color-5); --bg-color: hsla(285, 62%, 40%, 0.1); }
	.color-6 { --main-color: var(--color-6); --bg-color: hsla(338, 100%, 68%, 0.15); }
	.color-7 { --main-color: var(--color-7); --bg-color: hsla(35, 100%, 49%, 0.15); }
	.color-8 { --main-color: var(--color-8); --bg-color: hsla(17, 71%, 62%, 0.15); }
	.color-9 { --main-color: var(--color-9); --bg-color: hsla(237, 18%, 30%, 0.15); }
	.color-10{ --main-color: var(--color-10); --bg-color: hsla(175, 60%, 48%, 0.15); }
</style>