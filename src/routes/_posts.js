import fs from 'fs';
import path from 'path';
import marked from 'marked';
import { computeMinutesToRead } from './_minutesToRead.js';

export function getPosts () {
  const slugs = fs.readdirSync('posts')
    .filter(file => path.extname(file) === '.md')
    .map(file => file.slice(0, -3));

  return slugs.map(getPost).sort((a, b) => {
    return a.metadata.date < b.metadata.date ? 1 : -1;
  });
}

export function getPost(slug) {

  const file = `posts/${slug}.md`;
  if (!fs.existsSync(file)) return null;

  const markdown = fs.readFileSync(file, 'utf-8');

  const { content, metadata } = process_markdown(markdown);

  const date = new Date(metadata.date);
  const lang = 'en';
  metadata.dateString = date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const html = marked(content);

  const minutesToRead = computeMinutesToRead(content);

  const alternateSlug = metadata.slug;
  return {
    slug: alternateSlug || slug,
    metadata,
    html,
    minutesToRead,
  };
}

function process_markdown(markdown) {
  const match = /---\n([\s\S]+?)\n---/.exec(markdown);
  const frontMatter = match[1];
  const content = markdown.slice(match[0].length);

  const metadata = {};
  frontMatter.split('\n').forEach(pair => {
    const colonIndex = pair.indexOf(':');
    metadata[pair.slice(0, colonIndex).trim()] = pair
      .slice(colonIndex + 1)
      .trim();
  });

  return { metadata, content };
}
