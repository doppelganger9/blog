import fs from 'fs';
import path from 'path';
import marked from 'marked';
import parser from 'js-yaml';

import { computeMinutesToRead } from './_minutesToRead.js';

const WHERE_ALL_THE_MARKDOWN_BLOG_POSTS_ARE = './src/posts';

export function getPosts () {
  const slugs = fs.readdirSync(WHERE_ALL_THE_MARKDOWN_BLOG_POSTS_ARE)
    .filter(file => path.extname(file) === '.md')
    .map(file => file.slice(0, -3));

  return slugs.map(getPost).sort((a, b) => {
    return a.metadata.date < b.metadata.date ? 1 : -1;
  });
}

const renderHeadingWithAnchor = (slug) => (text, level) => {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `
    <h${level}>
      <a name="${escapedText}" aria-hidden="true" class="anchor" href="${slug}#${escapedText}">
        <span class="header-link"></span>
      </a>
      ${text}
    </h${level}>`;
};

export function getPost(slug) {

  const file = `${WHERE_ALL_THE_MARKDOWN_BLOG_POSTS_ARE}/${slug}.md`;
  if (!fs.existsSync(file)) return null;

  const markdown = fs.readFileSync(file, 'utf-8');

  const { content, metadata } = processMarkdown(markdown);

  const date = new Date(metadata.date);
  const lang = 'en';
  metadata.dateString = date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const renderer = new marked.Renderer();
  renderer.heading = renderHeadingWithAnchor(metadata.slug);

  const html = marked(content, {
    headerIds: true,
    smartypants: true,
    renderer: renderer,
  });

  const minutesToRead = computeMinutesToRead(content);

  const alternateSlug = metadata.slug;
  return {
    slug: alternateSlug || slug,
    metadata,
    html,
    minutesToRead,
  };
}

const removeStartingQuote = t => t.indexOf('"') === 0 ? t.slice(1) : t;
const removeEndingQuote = t => t.lastIndexOf('"') === t.length ? t.slice(0, t.length-1) : t;

function processMarkdown(markdown) {
  console.log('processing markdown...');
  const match = /---\n([\s\S]+?)\n---/.exec(markdown);
  const frontMatter = match[1];
  const content = markdown.slice(match[0].length);

  const metadata = {};
  frontMatter.split('\n').forEach(pair => {
    const colonIndex = pair.indexOf(':');
    const key = pair.slice(0, colonIndex).trim();
    let value = pair
      .slice(colonIndex + 1)
      .trim();
    console.log(parser.load(pair));
    metadata[key] = value;
  });

  return { metadata, content };
}
