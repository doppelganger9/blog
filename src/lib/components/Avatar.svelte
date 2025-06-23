<script lang="ts">
	/**
	 * Ce composant génère un avatar unique et symétrique (type "identicon")
	 * basé sur une chaîne de caractères (le nom).
	 */
	
	export let name: string;
	export let color: string = 'black'; // La couleur est passée en paramètre (prop)

	const GRID_SIZE = 5; // On utilise une grille de 5x5

	/**
	 * Génère un motif de booléens (vrai/faux) à partir du nom.
	 * @param input Le nom du participant.
	 * @returns Un tableau de 25 booléens (true = case colorée).
	 */
	function generatePattern(input: string): boolean[] {
		if (!input) {
			return Array(GRID_SIZE * GRID_SIZE).fill(false);
		}

		// 1. Créer une "graine" (seed) numérique à partir du nom.
		// C'est un algorithme de hash simple et déterministe.
		let seed = 0;
		for (let i = 0; i < input.length; i++) {
			seed = (seed << 5) - seed + input.charCodeAt(i);
			seed |= 0; // Convertit en entier 32-bit
		}

		// 2. Générer des valeurs pseudo-aléatoires basées sur la graine.
		// Math.sin() donne une séquence déterministe pour une même graine.
		const random = () => {
			const x = Math.sin(seed++) * 10000;
			return x - Math.floor(x);
		};

		// 3. On ne génère que la moitié gauche de la grille pour créer une symétrie.
		const halfWidth = Math.ceil(GRID_SIZE / 2);
		const template: boolean[] = [];
		for (let i = 0; i < GRID_SIZE * halfWidth; i++) {
			// On décide si la case est active ou non
			template.push(random() > 0.5);
		}

		// 4. On construit la grille complète en appliquant la symétrie.
		const pattern: boolean[] = [];
		for (let y = 0; y < GRID_SIZE; y++) {
			for (let x = 0; x < GRID_SIZE; x++) {
				// Si x est dans la moitié droite, on prend la valeur de son miroir à gauche.
				const mirroredX = x >= halfWidth ? GRID_SIZE - 1 - x : x;
				pattern.push(template[y * halfWidth + mirroredX]);
			}
		}

		return pattern;
	}

	// Calcule le motif une seule fois à la création du composant.
	const pattern = generatePattern(name);
</script>

<div class="avatar-grid" aria-label="Avatar pour {name}">
	{#each pattern as cellIsActive}
		<div class="cell" class:active={cellIsActive} style="--cell-color: {color};"></div>
	{/each}
</div>

<style>
	.avatar-grid {
		/* On utilise CSS Grid pour créer notre matrice de pixels */
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);

		/* Taille de l'avatar */
		width: 48px;
		height: 48px;
		
		background-color: rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		overflow: hidden; /* Assure que les coins sont bien arrondis */
		flex-shrink: 0; /* Empêche l'avatar de se rétrécir */
	}

	.cell {
		width: 100%;
		height: 100%;
		background-color: transparent;
	}

	/* La classe 'active' est ajoutée si la case doit être colorée */
	.cell.active {
		background-color: var(--cell-color);
	}
</style>