---
title: Blog reboot
date: 2019-06-18T20:00:00
description: It has happened again, I switched the blog from Gatsby to Sapper...
published: false
lang: en
keywords: Sapper, Svelte
slug: 2019/06/18
---

Okay, It's been a long time since I haven't posted something here, so here is I go.

Lately I've been spending some time trying Svelte.

## What is Svelte?

![svelte logo](https://svelte.dev/svelte-logo-horizontal.svg)

> Svelte: "Cybernetically enhanced web apps"

## What do I like about it?

- It just is so *simple*.
- The learning curve is low, 3 days later I was really efficient at creating components, stores, etc.
- It does all its things at compiler time, so the runtime is really lightweight!
- In a [previous post](/2019/06/12), I told you about this little <a href='https://github.com/doppelganger9/cooking-contest'>Cooking Contest</a> project to iterate on learning by creating something that might be useful.
- Animations are so easy! There will be [a future post about this](/future/svelte-animations)
- Stores are so simple to use! I will [dedicate a future post about this](/future/svelte-stores).
- I just 🧡 it!

## This blog runs now on Sapper

You might know that at the beginning [this blog was built using GatsbyJS](/2019/03/20). It was a blast!

But I wanted to test my *new Svelte powers* to see where I could go.

So I tried using Sapper to refactor this website.

You are currently looking at it. I will explain how I did it below.

## migrated Features

### TDD with Cypress

See [previous article about that](/2019/06/21).

#### Print estimated reading time for each blog post

- reading time : gatsby-remark-reading-time --> simple code

except for code blocks...

#### Write articles using Markdown

used a branch and adapted from there.

#### What next

I need to port those features from the previous blog:

- better code highlighting (gatsby-remark-prismjs) with PrismJS
- Twitter buttons (@weknow/gatsby-remark-twitter) & links (also the Twitter script should load every time)

- gatsby-remark-a11y-emoji : add alt + aria labels for emojis in markdown content.
- handling offline with gatsby-plugin-offline --> see service-worker.js

### Favicons

Gatsby has a plugin for that too.

I resorted to generate all favicons beforehand.
I created a `Favicons.svelte` component to include all those links in the`<head>` part using `<svelte:head>`.

Look at commit 952b83a6cf2022c34846b5685538c510e0a1e14f.


### PWA Manifest

Gatsby has a plugin to automatically generate this.

Here, again, it is made beforehand.
It uses the Favicons.

### SEO, analytics

I already [wrote an article about that](/2019/06/16).

### RSS Feed

Also [wrote an article about that](/2019/06/24).


### replacing gatsby-plugin-typography

I used [Google fonts](https://fonts.google.com/?query=merriweathe&selection.family=Merriweather:400,400i,700,900|Montserrat:900) directly:

```html
  <style>
  @import url('https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,900|Montserrat:900&display=swap');
  </style>
```

and then changed the fonts in the [`global.css`](https://github.com/doppelganger9/blog/blob/master/static/global.css#L2), like so:

```css
font-family: 'Merriweather', serif;
font-family: 'Montserrat', sans-serif;
```

### migrating markdown content

This Sapper markdown blog template used [`marked`]() library

I had an issue with the metadata date, for which I needed to remove the double-quote aroud the string date.
Also, marked extension seem to convert everything in text, even boolean values, so beware of that (published field).

####  autolink headers in markdown

adding href anchors ids + some CSS to show a linkable header.

I have written Cypress Tests for that, but you will see that they are tests showing how to configure the `marked` library.
They have a playground/exploratory feel to them.
They do not test directly the blog site, and thus, are even quicker because there is no need to run a browser to run them.

I followed the `marked` documentation to add a special `renderer` based on their sample which I adapted and provided CSS for.

Look at commit d756b50db77e7484b9213ee75bd3dc5ee797e5a0 in the commit log.

### Twitter Buttons

Put this in the svelte:head part:

```html
  <script type="text/javascript">
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }(document, "script", "twitter-wjs"));
  </script>
```

Put this in the layout:

```html

<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>

<a href="https://twitter.com/doppelganger9?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-show-count="false">Follow @doppelganger9</a>

```

At the moment, it breaks the back link with this error:

```error
Uncaught (in promise) TypeError: Cannot read property 'removeChild' of null
    at detach (internal.mjs:122)
    at Object.destroy [as d] ([day].svelte:118)
    at destroy (internal.mjs:1132)
    at Day.$destroy (internal.mjs:1236)
    at Day.$destroy (internal.mjs:1260)
    at App.svelte:22
    at run (internal.mjs:17)
    at Array.forEach (<anonymous>)
    at run_all (internal.mjs:23)
    at check_outros (internal.mjs:595)
```

So I'm not adding them for now, as I have to investigate further into this error.

## How to map URLs

My old blog's URL where like this:

- YEAR/MONTH/DAY -> article

By default, the [Sapper starter](https://github.com/sveltejs/sapper-template) exposes in the `src/routes` directory a subdirectory called `blog` which contains an index (the list og blog posts) and the blog post detail `[slug].svelte`.

So, how whould In reproduce my old URL structure with Sapper?
Sapper simply uses folder and filenames to create routes.
In order to recreate the `https://lacourt.dev/YEAR/MONTH/DAY/` URL, I would simply create a `2019/06/06` directory with an `index.svelte` inside it, or simply `2019/06` directory with a `06.svelte` in it, which is equivalent.

TODO: make a tag in a sample repo for it

### Using URL placeholders

Digging into Sapper test samples, I found out the [layout app test](https://github.com/sveltejs/sapper/tree/master/test/apps/layout) which has a `src/routes/[x]/[y]/[z].svelte` which makes it possible inside [z].svelte to lookup the values of the URL placeholder parameters (x, y and z). So I just applied this to my structure to create URL placeholder parameters for YEAR, MONTH and DAY: easy!

TODO: make a tag in a sample repo for this.

In the svelte template, I changed the preload function into this:

```html
<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [day].html
    const res = await this.fetch(`2019/${params.month}/${params.day}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {
        post: data,
        year: 2019,
        month: params.month,
        day: params.day,
      };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>
```

## What seems to be missing from Sapper

### Sapper Export crawling

in order to export your pages, you have to link to them from the App, because of the way the export feature works by crawling your content.

So, it explains why in this meta-post I linked to `rss` and `sitemap.xml` endpoints.

In the Sapper GitHub Issues, I found a tips that revolves around providing an invisible link and then having more links inside.

See https://github.com/sveltejs/sapper/issues/749

Look commit f108e3184b5760a394d22ea254170e3034c3eb62.

### Service Worker and JSON data

Also, the service-worker is currently not indexing all the exported `.json` files.

### Sapper routing

Another useful stuff would be to include another page without duplicating, for example a markdown post in another directory. Currently, I have opted for duplication, but it is not fully satisfying (see `routes/future`, `routes/[slug]`, `routes/2019`, `routes/alternate-reality`: they all have the same template except of course for imports with relative paths).

I resolved this by extracting the duplicated part in a shared `Post.svelte` component. This has reduced the duplication.

### npm run dev watch

The watch part in `npm run dev` does not detect changes to Markdown files.
