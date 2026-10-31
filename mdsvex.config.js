import abbr from "remark-abbr"
import urls from "rehype-urls"
import slug from "rehype-slug"
import autoLinkHeadings from "rehype-autolink-headings"
import figure from "rehype-figure"
import twemoji from "remark-twemoji"
import plantuml from "@akebifiky/remark-simple-plantuml"
import remarkEmbedder from '@remark-embedder/core';
import oembedTransformer from '@remark-embedder/transformer-oembed'
import { visit } from "unist-util-visit";
import { createRequire } from "node:module";

// Syntax highlighting: mdsvex's default highlighter loads Prism languages lazily while posts are
// compiled in parallel, so CSS/JS nested in HTML blocks were highlighted or not depending on timing
// (Prism only nests them when their grammar is loaded after the HTML one). Load the languages
// upfront, HTML first, and highlight with the same output format as mdsvex.
const require = createRequire(import.meta.url)
const Prism = require("prismjs")
require("prismjs/components/index.js")(["markup", "css", "javascript", "typescript", "json", "markdown", "bash", "java", "yaml", "hcl"])
require("prism-svelte")

const escapeSvelty = (str) =>
  str.replace(/[{}`]/g, (c) => ({ "{": "&#123;", "}": "&#125;", "`": "&#96;" })[c]).replace(/\\([trn])/g, "&#92;$1")

function highlightCode(code, lang) {
  const language = lang?.toLowerCase()
  const grammar = language && Prism.languages[language]
  const html = escapeSvelty(grammar ? Prism.highlight(code, grammar, language) : escapeHtml(code))
  return `<pre class="language-${language}">{@html \`<code class="language-${language}">${html}</code>\`}</pre>`
}

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

// Adds the "list" class to <ul> and <ol> (replaces rehype-add-classes, whose dependencies are unmaintained)
function addListClass() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "ul" || node.tagName === "ol") {
        const classes = [].concat(node.properties.className ?? [])
        if (!classes.includes("list")) node.properties.className = [...classes, "list"]
      }
    })
  }
}

function addWordCountToFrontmatterData({
  attribute = "wordCount",
} = {}) {
  return function (info, file) {
    let text = "";

    visit(info, ["text", "code"], (node) => {
      text += node.value;
    });
      
    file.data.fm[attribute] = text.split(/\s+/).length;
  };
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
}

// When an oEmbed provider is down, blocked or the content was deleted (tweets, gfycat...),
// fall back to a plain link instead of failing the whole build.
function handleEmbedError({ error, url }) {
  console.warn(`[oembed] ${url}: ${error.message} -> fallback to a plain link`)
  const href = escapeHtml(url)
  return `<p><a href="${href}">${href}</a></p>` // class, target and rel are added by processUrl
}

// The oEmbed transformer downloads https://oembed.com/providers.json in `shouldTransform`,
// which `handleError` does not cover: if that download fails, treat the URL as embeddable
// so that `getHTML` fails too and `handleEmbedError` renders the plain link.
const resilientOembedTransformer = {
  ...oembedTransformer.default,
  shouldTransform: async (url) => {
    try {
      return await oembedTransformer.default.shouldTransform(url)
    } catch (error) {
      console.warn(`[oembed] providers list unavailable (${error.message})`)
      // remark-embedder also hands single words as https://word/: only real hostnames qualify
      return new URL(url).hostname.includes('.')
    }
  },
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
  extensions: [ '.md', '.svx' ],
  remarkPlugins: [
    addWordCountToFrontmatterData, // adds wordCount to frontmatter
    [remarkEmbedder.default, {transformers: [resilientOembedTransformer], handleError: handleEmbedError}],
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
    addListClass, // add the "list" class to lists
  ],
  highlight: { highlighter: highlightCode },
  smartypants: true,
};

export default mdsvexConfig;