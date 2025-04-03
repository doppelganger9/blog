<script>
	// Import markdown conversion library
  import { marked } from 'marked'
  
	// Declare a variable to store the markdown data
  let markdown = `Titre
======

Sous-titre
-----------

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

![favicon](/favicon.ico)

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
`
</script>


<h1>Markdown Editor</h1>

<!-- Declare a textarea where the user can enter markdown, and bind it to the variable `markdown` -->
<textarea bind:value={markdown} placeholder="Enter markdown here"></textarea>

<!-- Convert the markdown to HTML and display it -->
<div class="preview">{@html marked(markdown)}</div>

<!-- Make it look (slightly) nicer ;) -->
<style>
	textarea, .preview {
		box-sizing: border-box;
		display: block;
		width: 100%;
	}
	
	textarea {
		font-family: monospace, Roboto;
		height: 25%;
		border: none;
		margin: 0;
		padding: 1rem;
	}
	
	.preview {
		height: 75%;
		padding: 2rem;
		border-top: solid 2px #888;
	}
	
	h1 {
		background: #e1e1e1;
		margin: 0px;
		padding: 0.8rem;
		font-size: 1.2rem;
	}
	
	:global(body) {
		padding: 0;
	}

  :global(ul) {
    list-style-type: disc;
  }

  :global(li) {
    margin: 0;
    margin-left: 1em;
  }

  :global(ul ul) {
    list-style-type: circle;
  }

  :global(ul ul ul) {
    list-style-type: square;
  }

  :global(table) {
    width: 100%;
    border: 1px solid lightgrey;
  }
  :global(thead) {
    background-color: #e1e1e1;
  }
  :global(td) {
    border: 1px solid lightgrey;
  }
  :global(tr:nth-child(2n)) {
    background-color: #f1f1f1;
  }

</style>