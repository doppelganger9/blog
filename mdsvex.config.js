import abbr from "remark-abbr"
import urls from "rehype-urls"
import slug from "rehype-slug"
import autoLinkHeadings from "rehype-autolink-headings"
import addClasses from "rehype-add-classes"
import figure from "rehype-figure"
import twemoji from "remark-twemoji"
import plantuml from "@akebifiky/remark-simple-plantuml"
import remarkEmbedder from '@remark-embedder/core';
import oembedTransformer from '@remark-embedder/transformer-oembed'

function processUrl(url, node) {
	if (node.tagName === "a") {
		node.properties.class = "text-link"

		if (!url.href.startsWith("/")) {
			// Open external links in new tab
			node.properties.target = "_blank"
			// Fix a security concern with offsite links
			// See: https://web.dev/external-anchors-use-rel-noopener/
			node.properties.rel = "noopener"
		}
	}
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
  extensions: [ '.md', '.svx' ],
  remarkPlugins: [
    [remarkEmbedder.default, {transformers: [oembedTransformer.default]}],
    abbr, // adds support for footnote-like abbreviations
    [twemoji, {
      ext: '.svg',
      folder: 'svg',
    }],
    [plantuml, { baseUrl: "https://www.plantuml.com/plantuml/svg" }],
  ],
  rehypePlugins:[
    figure, // convert images into <figure> elements
    [urls, processUrl], // adds rel and target to <a> elements
    slug, // adds slug to <h1>-<h6> elements
    [autoLinkHeadings, { behavior: "prepend" }], // prepends slugged <h1>-<h6> elements with an <a>
    [addClasses, { "ul,ol": "list" }] // add classes to these elements
  ],
  smartypants: true,
};

export default mdsvexConfig;