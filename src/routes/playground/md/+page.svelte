<script lang="ts">
	import { marked } from 'marked';
  import TabCounter from '../tab-counter/+page.svelte';
  import SampleCustomElement from '/src/lib/components/SampleCustomElement.svelte';

	// Clé pour le localStorage
	const CONTENT_STORAGE_KEY = 'svelte-markdown-editor-content';
  const EDITOR_VISIBILITY_KEY = 'svelte-markdown-editor-visibility';
	
  // Visibilité par défaut de l'éditeur
	const DEFAULT_EDITOR_VISIBLE = true;
	// Contenu par défaut
  const DEFAULT_CONTENT = `Editeur de Markdown
======

Notice d'utilisation
-----------

Vous pouvez effacer ce contenu par défaut, et il sera sauvegardé dans votre navigateur. 

Si vous revenez ici, le contenu précédemment sauvegardé sera rechargé.

Le bouton 🙈/👀 tout en haut à droite de cette page, permet de masquer ou afficher le panneau avec l'éditeur.

Ce que vous lisez actuellement est le rendu HTML du contenu Markdown saisi dans l'éditeur. 
Celui-ci se met à jour dynamiquement.

J'utilise la librairie [marked.js](https://marked.js.org/) pour calculer ce rendu, contrairement au reste de ce blog qui habituellement utilise une autre chaîne de transformation \`markdown -> HTML\`.

Donc pour le moment, on ne peut pas évaluer dynamiquement de code Svelte, on ne peut pas mettre de code PlantUML pour générer des diagrammes, les Emojis ne sont pas automatiquement transformés en Twemojis, il n'y a pas de liens générés pour les headers, etc.

On peut quand même s'amuser un peu malgré tout !

Ci-dessous des exemples de Markdown pour en apprécier le rendu.

# Titre alternatif

## Sous-titre alternatif

Les paragraphes sont séparés
par une ligne vide.

Deux espaces à la fin d'une ligne  
produisent un saut de ligne.

Liste à puces imbriquée dans une liste ordonnée:

  1. fruits
     * pomme
       * pomme caramélisée
         * miam
     * banane
       * banane fritte
       * banane chocolat
  2. légumes
     - carotte
     - brocoli

Liste à cocher:
 - [ ] Case non cochée
 - [x] Case cochée

texte tout seul; Les caractères _italiques_, **gras**, \`à taille fixe\`.

[un lien](https://lacourt.dev)

Une tête de vainqueur : ![favicon](/favicon.ico)

> Markdown utilise les caractères à la manière des emails pour faire des citations en bloc.
>
> Chaque paragraphe doit être précédé par ce caractère.

La plupart des balises <abbr title="Hypertext Markup Language">HTML</abbr> de type « en ligne » sont prises en compte.

| Titre 1       |     Titre 2     |        Titre 3 |
| :------------ | :-------------: | -------------: |
| Colonne       |     Colonne     |        Colonne |
| Alignée à     |   Alignée au    |      Alignée à |
| Gauche        |     Centre      |         Droite |

---
\`\`\`js
code
  if
   alors
\`\`\`
---

## Custom Web Element:

Voir [la doc de Svelte](https://svelte.dev/docs/svelte/custom-elements).

### un compteur :

\`<sample-custom-element></sample-custom-element>\`

<sample-custom-element></sample-custom-element>

## Wow, j'importe une autre page :

Et il y a même des attributs qui pilotent son comportement !

\`<tab-counter showHelp="false" updateTitleWithTimeElapsed="false" />\`

<tab-counter showHelp="false" updateTitleWithTimeElapsed="false" />

`;


	// Fonction pour charger le contenu initial depuis le localStorage ou utiliser le défaut
	function getInitialContent(): string {
		if (typeof window !== 'undefined' && window.localStorage) {
			const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
			return storedContent !== null ? storedContent : DEFAULT_CONTENT;
		}
		return DEFAULT_CONTENT; // Fallback pour SSR ou si localStorage n'est pas dispo
	}

	// 1. État pour le contenu brut du textarea
	// Initialisé avec la valeur du localStorage ou la valeur par défaut
	let rawContent = $state(getInitialContent());

	// 2. État dérivé pour le contenu HTML transformé par marked
	// Se met à jour automatiquement quand rawContent change
	let renderedHtml = $derived(marked(rawContent));

  // Pour gérer l'affichage/masquage de l'editeur Markdown.
  let showPanel = $state(true);

	// 3. Effet pour sauvegarder le contenu dans le localStorage
	// S'exécute chaque fois que rawContent change, après que l'état ait été mis à jour
	$effect(() => {
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.setItem(CONTENT_STORAGE_KEY, rawContent);
			console.log('Contenu sauvegardé dans localStorage:', rawContent);
		}
	});

	// Optionnel : une fonction pour réinitialiser au contenu par défaut explicite
	function resetToDefault() {
		rawContent = DEFAULT_CONTENT;
	}

	// Optionnel : une fonction pour vider le contenu
	function clearContent() {
		rawContent = '';
	}

  // --- Gestion de la visibilité de l'éditeur ---
	function getInitialEditorVisibility(): boolean {
		if (typeof window !== 'undefined' && window.localStorage) {
			const storedVisibility = localStorage.getItem(EDITOR_VISIBILITY_KEY);
			// localStorage stocke des chaînes, donc on compare à "true"
			return storedVisibility !== null ? storedVisibility === 'true' : DEFAULT_EDITOR_VISIBLE;
		}
		return DEFAULT_EDITOR_VISIBLE;
	}

	let isEditorVisible = $state(getInitialEditorVisibility());

	$effect(() => {
		if (typeof window !== 'undefined' && window.localStorage) {
			// Stocker comme une chaîne "true" ou "false"
			localStorage.setItem(EDITOR_VISIBILITY_KEY, String(isEditorVisible));
			// console.log('Visibilité éditeur sauvegardée:', isEditorVisible); // Décommenter pour debug
		}
	});

  function togglePanelVisibility() {
    showPanel = !showPanel;
  }

</script>

<button id="toggle-visibility" aria-label={showPanel ? 'masquer editeur':'afficher editeur'} onclick={togglePanelVisibility}>{showPanel ? '🙈':'👀'}</button>

<div class="markdown-editor-container">
  {#if showPanel}
	<div class="editor-pane">
		<textarea bind:value={rawContent} rows="10" placeholder="Écrivez votre Markdown ici..."></textarea>
		<div class="controls">
			<button onclick={resetToDefault}>Réinitialiser à "coucou"</button>
			<button onclick={clearContent}>Vider</button>
		</div>
	</div>
  {/if}

	<div class="preview-pane">
		<div class="preview-content">
			{@html renderedHtml}
		</div>
	</div>
</div>

<style>

  #toggle-visibility {
    width: 30px;
    float: right;
    position: absolute;
    top: 50px;
    right: 30px;
  }
	.markdown-editor-container {
		display: flex;
    flex-direction: column;
		gap: 20px;
		font-family: sans-serif;
	}
	.editor-pane {
		flex: 1;
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 15px;
		background-color: #f9f9f9;
	}
  h1 {
    margin: 0 0 2rem 0;
  }
	h3 {
		margin-top: 0;
		color: #333;
	}
	textarea {
		width: 100%;
		min-height: 200px; /* Hauteur minimale */
		box-sizing: border-box; /* Inclut padding et bordure dans la largeur/hauteur totale */
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 10px;
		font-family: monospace;
		font-size: 14px;
		margin-bottom: 10px;
		resize: vertical; /* Permet le redimensionnement vertical */
	}
  .preview-content {
    padding: 2rem;
    border-radius: 4px;
  }
  .preview-content :global(h1),
  .preview-content :global(h2),
  .preview-content :global(h3),
  .preview-content :global(h4),
  .preview-content :global(h5),
  .preview-content :global(h6) {
      margin-top: 0.5em;
      margin-bottom: 0.25em;
  }
  .preview-content :global(p) {
      margin-top: 0;
      margin-bottom: 0.5em;
  }
  .preview-content :global(pre) {
      background-color: #2d2d2d;
      color: #f0f0f0;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
  }
  .preview-content :global(code) {
      font-family: monospace;
      background-color: #eee;
      padding: 0.2em 0.4em;
      border-radius: 3px;
  }
  .preview-content :global(pre) > :global(code) {
      background-color: transparent;
      padding: 0;
  }


	:global(body) {
		padding: 0;
	}

  .preview-content h1 {
    padding: 4rem 0 2rem 0;
  }
  .preview-content :global(ul) {
    list-style-type: disc;
  }

  .preview-content :global(li) {
    margin: 0;
    margin-left: 1em;
  }

  .preview-content :global(ul ul) {
    list-style-type: circle;
  }

  .preview-content :global(ul ul ul) {
    list-style-type: square;
  }

  .preview-content :global(table) {
    width: 100%;
    border: 1px solid lightgrey;
  }
  .preview-content :global(thead) {
    background-color: #e1e1e1;
  }
  .preview-content :global(td) {
    border: 1px solid lightgrey;
  }
  .preview-content :global(tr:nth-child(2n)) {
    background-color: #f1f1f1;
  }

	.controls {
		margin-top: 10px;
		display: flex;
		gap: 10px;
	}
	.controls button {
		padding: 8px 15px;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: white;
		cursor: pointer;
		font-size: 14px;
	}
	.controls button:hover {
		background-color: #0056b3;
	}
</style>