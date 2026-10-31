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
import { visit } from "unist-util-visit";
import { compile } from "mdsvex";

// mdsvex loads Prism languages lazily, the first time a code block needs one, and CSS/JS nested
// in an HTML block are only highlighted if those languages are already loaded. Load them upfront
// so the result does not depend on the order in which posts are compiled.
await compile("```css\na{}\n```\n\n```js\nx\n```\n\n```ts\nx\n```")

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
    [addClasses, { "ul,ol": "list" }] // add classes to these elements
  ],
  smartypants: true,
};

export default mdsvexConfig;