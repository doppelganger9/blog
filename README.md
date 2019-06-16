# David's Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/72137791-898b-46be-ac68-9e1a5a37a29b/deploy-status)](https://app.netlify.com/sites/infallible-shannon-2d54c6/deploys) [![Actions Status](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/doppelganger9/blog)](https://github.com/doppelganger9/blog/actions)

See it live here: https://lacourt.dev/

This is a [Sapper](https://github.com/sveltejs/sapper) backed blog with webpack. To clone it and get started:

```bash
git clone https://github.com/doppelganger9/blog.git
cd david-blog
npm install
npm run dev
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.

Consult [sapper.svelte.dev](https://sapper.svelte.dev) for help getting started.

## Open source

You can follow in the commit history how I migrated from the [Gastby-starter-blog](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-blog/) to grow my own thing.

I encourage your curiosity and will be delighted if you can fix my poor English grammar or whatever deeper in the content I will post.

## Structure

Sapper expects to find two directories in the root of your project —  `src` and `static`.

### src

The [src](src) directory contains the entry points for your app — `client.js`, `server.js` and (optionally) a `service-worker.js` — along with a `template.html` file and a `routes` directory.

#### src/routes

This is the heart of your Sapper app. There are two kinds of routes — *pages*, and *server routes*.

**Pages** are Svelte components written in `.svelte` files. When a user first visits the application, they will be served a server-rendered version of the route in question, plus some JavaScript that 'hydrates' the page and initialises a client-side router. From that point forward, navigating to other pages is handled entirely on the client for a fast, app-like feel. (Sapper will preload and cache the code for these subsequent pages, so that navigation is instantaneous.)

**Server routes** are modules written in `.js` files, that export functions corresponding to HTTP methods. Each function receives Express `request` and `response` objects as arguments, plus a `next` function. This is useful for creating a JSON API, for example.

There are three simple rules for naming the files that define your routes:

* A file called `src/routes/about.svelte` corresponds to the `/about` route. A file called `src/routes/blog/[slug].svelte` corresponds to the `/blog/:slug` route, in which case `params.slug` is available to the route
* The file `src/routes/index.svelte` (or `src/routes/index.js`) corresponds to the root of your app. `src/routes/about/index.svelte` is treated the same as `src/routes/about.svelte`.
* Files and directories with a leading underscore do *not* create routes. This allows you to colocate helper modules and components with the routes that depend on them — for example you could have a file called `src/routes/_helpers/datetime.js` and it would *not* create a `/_helpers/datetime` route

### static

The [static](static) directory contains any static assets that should be available. These are served using [sirv](https://github.com/lukeed/sirv).

In your [service-worker.js](app/service-worker.js) file, you can import these as `files` from the generated manifest...

```js
import { files } from '@sapper/service-worker';
```

...so that you can cache them (though you can choose not to, for example if you don't want to cache very large files).

## Bundler config

Sapper uses Rollup or webpack to provide code-splitting and dynamic imports, as well as compiling your Svelte components. With webpack, it also provides hot module reloading. As long as you don't do anything daft, you can edit the configuration files to add whatever plugins you'd like.

## CI/CD

I'm an automation advocate, I [wrote a post](https://lacourt.dev/2019/03/06) about setting up the Github Actions Workflow for this blog.

The website is deployed to [Netlify](https://www.netlify.com).

## License

MIT
