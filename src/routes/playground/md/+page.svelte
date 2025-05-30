<script lang="ts">
  // pour transformer du text en HTML via la syntaxe markdown
	import { marked } from 'marked';
  // pour transformer les blocs Markdown code plantuml en diagramme:
  import { encode } from 'plantuml-encoder';
  // pour rendre les emojis accessibles et cross-platform via Twemojis:
  import twemoji from 'twemoji';
  // Import des Custom Elements :
  import TabCounter from '../tab-counter/+page.svelte';
  import SampleCustomElement from '/src/lib/components/SampleCustomElement.svelte';

  // Fonction utilitaire pour "slugifier" une chaîne de caractères
  function slugify(text: string) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }

	// Clé pour le localStorage
	const CONTENT_STORAGE_KEY = 'svelte-markdown-editor-content';
	
	// Contenu par défaut
  const SSR_CONTENT = `# Chargement en cours ⏳ ...`;
  const DEFAULT_CONTENT = `Editeur de Markdown 🥳
======

Notice d'utilisation
-----------

Vous pouvez effacer ce contenu par défaut, et il sera sauvegardé dans votre navigateur. 

Si vous revenez ici, le contenu précédemment sauvegardé sera rechargé.

Le bouton 🙈/👀 tout en haut à droite de cette page, permet de masquer ou afficher le panneau avec l'éditeur.

Ce que vous lisez actuellement est le rendu HTML du contenu Markdown saisi dans l'éditeur. 
Celui-ci se met à jour dynamiquement.

J'utilise la librairie [marked.js](https://marked.js.org/) pour calculer ce rendu, contrairement au reste de ce blog qui habituellement utilise une autre chaîne de transformation \`markdown -> HTML\`.

J'ai adapté ce que j'ai mis en place sur le blog pour qu'on retrouve ici sur \`marked.js\`:

- Les Emojis présent un peu partout sont transformés pour être plus accessibles et cross-platform en utilisant Twemojis (j'en parlais [dans un ancien article](/2019/03/14) sur une technique similaire pour les articles du blog, ici c'est adapté pour \`marked.js\`).
- des ancres et liens sont générés pour les titres (on voit un 📎 à gauche)
- les blocs de code avec lang=plantuml sont transformés en diagrammes, similaire à ce que j'expliquais dans [cet ancien article](/2021/11/13).

Ci-dessous des exemples de Markdown pour en apprécier le rendu.

# Titre alternatif

## Sous-titre alternatif 🐓

Les paragraphes sont séparés
par une ligne vide.

Deux espaces à la fin d'une ligne  
produisent un saut de ligne.

Liste à puces imbriquée dans une liste ordonnée:

  1. fruits
     * pomme 🍏
         * pomme 🍎 caramélisée
         * miam
         * [un lien](/playground/md)
         * \`du code\`
     * banane
       * banane 🍌 fritte 
       * banane chocolat 🍫
  2. légumes
     - carotte 🥕
     - brocoli 🥦

Liste à cocher:
 - [ ] Case non cochée ❌
 - [x] Case cochée ✅

texte tout seul; Les caractères _italiques_, **gras**, \`à taille fixe\`.

[un lien](https://lacourt.dev)

Une tête de vainqueur : ![favicon 🙃](/favicon.ico)

> Markdown utilise les caractères à la manière des emails pour faire des citations en bloc.
> 🤷🏼‍♂️
> Chaque paragraphe doit être précédé par ce caractère.

La plupart des balises <abbr title="Hypertext Markup Language">HTML</abbr> de type « en ligne » sont prises en compte.

| Titre 1 1️⃣    |    Titre 2 2️⃣    |     Titre 3 3️⃣ |
| :------------ | :-------------: | -------------: |
| Colonne       |     Colonne     |        Colonne |
| Alignée à     |   Alignée au    |      Alignée à |
| Gauche        |     Centre      |         Droite |

---
\`\`\`js
code
  if 🤷🏼‍♂️
   alors 🙈
\`\`\`
---


## Diagramme Séquence Simple

\`\`\`plantuml
@startuml
Alice -> Bob: Salut Bob ! 👋
Bob --> Alice: Salut Alice ! 😊
@enduml
\`\`\`

C'est un diagramme de séquence. Maintenant, un diagramme de cas d'utilisation.

## Diagramme Cas d'Utilisation

\`\`\`plantuml
@startuml
left to right direction
actor "Client" as cl

rectangle "Gestion Commande" {
  usecase "Passer commande" as uc1
  usecase "Annuler commande" as uc2
  usecase "Suivre commande" as uc3
}

cl --> uc1
cl --> uc2
cl --> uc3
@endumll
\`\`\`

J'espère que c'est clair ! 👍

## Diagramme de Classe

\`\`\`plantuml
@startuml
class Person {
  + String name
  + int age
  + void sayHello()
}

class Student extends Person {
  + String studentId
}

class Professor extends Person {
  + String department
}

Person <|-- Student
Person <|-- Professor
@enduml
\`\`\`

Voici un [lien interne](/about) et un [lien externe vers Google](https://www.google.com).
Un [lien vers Diagramme de Classe](#diagramme-de-classe)

## Custom Web Element:

Voir [la doc 📃 de Svelte](https://svelte.dev/docs/svelte/custom-elements). 

Attention a bien utiliser une balise ouvrante et fermante \`<mon-composant></mon-composant>\` 
car la notation auto-fermante ne fonctionnera pas ! (\`<mon-composant />\`)

### un compteur 🛎️ :

\`<sample-custom-element></sample-custom-element>\`

Et de 1:
<sample-custom-element></sample-custom-element>
Et de 2:
<sample-custom-element></sample-custom-element>
Et de 3:
<sample-custom-element></sample-custom-element>

## Wow, j'importe une autre page :

Et il y a même des attributs qui pilotent son comportement !

\`<tab-counter showHelp="false" updateTitleWithTimeElapsed="false" ></tab-counter>\`

<tab-counter showHelp="false" updateTitleWithTimeElapsed="false"></tab-counter>

## Et voilà

C'est tout, et c'est déjà pas mal, non ?

`;

  const generatedIds = $state(new Map<string, number>());

  const tranformEmojis = (text) => twemoji.parse(text, {
    folder: 'svg',
    ext: '.svg',
    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    attributes: (iconId, variant) => ({
        title: twemoji.convert.fromCodePoint(iconId),
        role: 'img',
        'aria-label': twemoji.convert.fromCodePoint(iconId)
    }),
    callback: (icon, options: any, variant) => {
        return `${options.base}${options.size}/${icon}${options.ext}`;
    }
  });

  function setupMarked(generatedIds: Map<string, number>): void {
    marked.use({
      renderer: {
        code({ text, lang }) {
          if (lang === 'plantuml') {
            try {
              const encodedPlantUML = encode(text);
              const plantUmlServerUrl = 'https://www.plantuml.com/plantuml/svg/';
              const svgUrl = `${plantUmlServerUrl}${encodedPlantUML}`;
              return `<img src="${svgUrl}" alt="PlantUML Diagram" style="max-width:100%; display: block; margin: 0 auto;">`;
            } catch (error: any) {
              console.error('Erreur lors de l\'encodage PlantUML:', error);
              return `<pre style="color: red;">Erreur de génération du diagramme PlantUML: ${error.message}</pre>`;
            }
          }
          return `<pre><code class="language-${lang || ''}">${text}</code></pre>`;
        },
        link({ href, title, text, tokens }) {
          let attributes = `class="text-link"`;

          if (!href.startsWith('/') && !href.startsWith('#')) {
            attributes += ` target="_blank"`;
            attributes += ` rel="noopener"`;
          }

          if (title) {
            attributes += ` title="${title}"`;
          }

          return `<a href="${href}" ${attributes}>${tokens[0].raw}</a>`;
        },
        heading({text, depth, raw}) {
          let id = slugify(raw);

          if (generatedIds.has(id)) {
            const count = generatedIds.get(id)! + 1;
            generatedIds.set(id, count);
            id = `${id}-${count}`;
          } else {
            generatedIds.set(id, 1);
          }

          return `
            <h${depth} id="${id}">
              <a aria-hidden="true" tabindex="-1" href="#${id}" class="heading-anchor">
                <span class="icon icon-link"></span>
              </a>
              ${text}
            </h${depth}>
          `;
        }
      }
    });
  }

  setupMarked(generatedIds);

	// Fonction pour charger le contenu initial depuis le localStorage ou utiliser le défaut
	function getInitialContent(): string {
		if (typeof window !== 'undefined' && window.localStorage) {
			const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
			const initialContent = storedContent !== null ? storedContent : DEFAULT_CONTENT;
      return initialContent;
		}
		return DEFAULT_CONTENT; // Fallback pour SSR ou si localStorage n'est pas dispo
	}

	// 1. État pour le contenu brut du textarea
	// Initialisé avec la valeur côté serveur, et plus tard on chargera localstorage 
  // ou bien un contenu par défaut final.
  let rawContent = $state(SSR_CONTENT);

	// 2. État dérivé pour le contenu HTML transformé par marked
	// Se met à jour automatiquement quand rawContent change
	let renderedHtml = $derived(tranformEmojis(marked(rawContent)));

  // Pour gérer l'affichage/masquage de l'editeur Markdown.
  let showPanel = $state(true);

  let alreadyRanThis = $state(false);

	// 3. Effet pour sauvegarder le contenu dans le localStorage
	// S'exécute chaque fois que rawContent change, après que l'état ait été mis à jour
	$effect(() => {
		if (typeof window !== 'undefined' && window.localStorage) {
      if (alreadyRanThis === false) {
        console.log('on reinit le contenu');
        // si on est dans un contexte d'éxécution de la page = navigateur (pas SSR donc serveur), on reinitialise le contenu.
        rawContent = getInitialContent();
        alreadyRanThis = true;
      }
			localStorage.setItem(CONTENT_STORAGE_KEY, rawContent);
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
      <button onclick={resetToDefault}>Réinitialiser au contenu par défaut</button>
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

  .emoji {
    height: 1em;
    width: 1em;
    margin: 0 .05em 0 .1em;
    vertical-align: -0.1em;
  }

  .text-link {
    color: #007bff;
    text-decoration: underline;
  }

  .heading-anchor {
    text-decoration: none;
    color: #888;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 0.5em;
  }

  h1:hover .heading-anchor,
  h2:hover .heading-anchor,
  h3:hover .heading-anchor,
  h4:hover .heading-anchor,
  h5:hover .heading-anchor,
  h6:hover .heading-anchor {
    opacity: 1;
  }

  .heading-anchor span.icon-link::before {
    content: "📎";
    font-size: 1em;
    line-height: 1;
  }

  .oembed-placeholder {
    min-height: 50px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
    color: #666;
    margin-bottom: 1em;
    /* Optionnel: pour afficher un petit message pendant le chargement */
    &::before {
      content: "Chargement de l'OEmbed...";
    }
  }

  .oembed-content {
    max-width: 100%;
    overflow: hidden;
    margin-bottom: 1em;
  }

  .oembed-content iframe {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    display: block;
    border: none;
  }
</style>