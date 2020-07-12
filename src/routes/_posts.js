import fs from 'fs';
import path from 'path';
import { computeMinutesToRead } from './_minutesToRead.js';
import { siteUrl } from '../stores/_config.js';
import { transform } from 'mdsvex';
import { processDate } from './_date.js';

export const onlyPublishedPosts = it => it.published === true;
export const onlyRealPosts = p => p.slug.indexOf('future/') < 0 && p.slug.indexOf('alternate-reality/') < 0;

const WHERE_TO_RECURSIVELY_SEARCH_FOR_SVX_BLOG_POSTS = './src/routes'; // pour le moment je teste juste en pointant directement sur le seul article svx

let memo = undefined; // to keep already parsed posts to avoid doing it mutliple times.

export async function getPosts () {
  if (!memo) {
    const root = WHERE_TO_RECURSIVELY_SEARCH_FOR_SVX_BLOG_POSTS;
    const directoriesToExplore = [ root + '/' ];
    const filesFound = [];
  
    while(directoriesToExplore.length > 0) {
      const dir = directoriesToExplore.pop();
      fs.readdirSync(dir).forEach(file => {
        const fileWithPath = path.join(dir, file);
        const stat = fs.statSync(fileWithPath);
        if (stat.isDirectory()) {
          directoriesToExplore.push(fileWithPath);
        } else if (stat.isFile()) {
          if (path.extname(file) === '.svx') {
            filesFound.push(fileWithPath);
          }
        }
      });
    }
  
    const slugs = filesFound.map(file => {
      const [,slug] = file.split('src/routes/');
      const slug2 = slug.slice(0, -4);
      if (slug2.indexOf('/index')) {
        return slug2.split('/index')[0];
      } else {
        return slug2;
      }
    });

    // memo = [await getPost(slugs[0])]; // DEBUG 1 seule route
    memo = (await Promise.all(slugs.map(getPost)))
      .sort((a, b) => {
        return a.date < b.date ? 1 : -1;
      });
  }

  // we memoize this function's return value, as we export the data with Sapper, no need to re-evaluate it each time.
  return [...memo];
}

async function getPost(slug) {

  let file;
  if (fs.existsSync(`${WHERE_TO_RECURSIVELY_SEARCH_FOR_SVX_BLOG_POSTS}/${slug}.svx`)) {
    // un fichier nommé, de la forme /x/y/z/slug.svx
    file = `${WHERE_TO_RECURSIVELY_SEARCH_FOR_SVX_BLOG_POSTS}/${slug}.svx`;
  } else if (fs.existsSync(`${WHERE_TO_RECURSIVELY_SEARCH_FOR_SVX_BLOG_POSTS}/${slug}/index.svx`)) {
    // un fichier qui mappe sq route sur une date de la forme /yyyy/mm/dd/index.svx
    file = `${WHERE_TO_RECURSIVELY_SEARCH_FOR_SVX_BLOG_POSTS}/${slug}/index.svx`;
  }

  const parser = transform();
  const contents = fs.readFileSync(file, 'utf-8');
  const parsed = await parser.process({contents, file});
  const metadata = parsed.data.fm || {};
  const content = parsed.contents || '';

  metadata.dateString = processDate(metadata);
  metadata.thumb = processThumb(metadata.thumb);

  const post = {
    ...metadata,
    slug: metadata.slug || slug,
    minutesToRead: computeMinutesToRead(content),
  };

  return post;
}

function processThumb(thumb) {
  return (thumb && thumb.indexOf(siteUrl) < 0) ? (siteUrl + '/' + thumb) : thumb;
}
