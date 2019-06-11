---
title: Blog reboot
date: 2019-06-06T09:00:00
description: It has happened again, I switched the blog from Gatsby to Sapper...
published: false
lang: en
keywords: ["Sapper", "Svelte"]
slug: 2019/06/06
---

Okay, It's been a long time since I haven't posted something here, so here is I go.

Lately I've been spending some time trying Svelte.

## What is Svelte?

> Svelte: "Cybernetically enhanced web apps"

## What do I like about it?

It just is so *simple*.

It do all its things at compiler time, so the runtime is really lightweight!

I just 🧡 it!

I've done this little <a href='https://github.com/doppelganger9/cooking-contest'>Cooking Contest</a> project to iterate on learning by creating something that might be useful.

Animations are so easy!

Stores are so simple to use!

The learning curve is low, 3 days later I was really efficient at creating components, stores, etc.

## This blog runs now on Sapper

You might know that at the beginning [this blog was built using GatsbyJS](/2019/03/20/). It was a blast!

But I wanted to test my new Svelte powers to see where I could go. So I tried using Sapper to refactor this website.

## migrated Features

### TDD with Cypress

First, for each of my previous blog features, I added a Cypress test!

The cypress test would be green on the older blog, and red on the new one. This would allow me to TDD through the migration an ensure I would not forgot any of the expected features.

### Have a list of blog posts

### Show the date of publication for each blog post

### Print estimated reading time for each blog post

- reading time : gatsby-remark-reading-time --> simple code

### Write articles using Markdown

## What's next?

I need to port those features from the previous blog:

- autolink headers in markdown (adding href anchors ids + some CSS to show a linkable header)
- better code highlighting (gatsby-remark-prismjs) with PrismJS
- Twitter buttons (@weknow/gatsby-remark-twitter) & links (also the Twitter script should load every time)
- SEO (Gatsby had a plugin): twitter card for articles
- Google Analytics (gatsby-plugin-google-analytics), anonymized, respect DNT, UA-135533567-1
- PWA manifest (Gatsby had a plugin to automatically generate this)
- favicon (Gatsby had a plugin for that too)
- gatsby-remark-a11y-emoji : add alt + aria labels for emojis in markdown content.
- handling offline with gatsby-plugin-offline --> see service-worker.js

### RSS Feed

Look at `src/rss.js`, and the line in the `template.html` advertising the link for auto-discovery of the RSS feed:

```html
  <link rel='alternate' type='application/rss+xml' title="RSS Feed for David's Blog" href='/rss' />
```

It was adapted from Rich Harris' work for HN Svelte found here: [Sapper Issue 461: Add XML Generation/RSS XML feed](https://github.com/sveltejs/sapper/issues/461). Original source code is on GitHub:
 [https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js](https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js).

### Sitemap

I applied the same idea from the RSS Feed, and added a `sitemap.xml` endpoint in 10 minutes.

See `src/sitemap.xml.js`.

It generates the sitemap from the published posts, and a few hard-coded URLs (root URL and privacy-policy).

```html
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
```

### replacing gatsby-plugin-typography

Use [Google fonts](https://fonts.google.com/?query=merriweathe&selection.family=Merriweather:400,400i,700,900|Montserrat:900) directly:

```html
  <style>
  @import url('https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,900|Montserrat:900&display=swap');
  </style>
```

and then use:

```css
font-family: 'Merriweather', serif;
font-family: 'Montserrat', sans-serif;
```

I had an issue with the metadata date, for which I needed to remove the double-quote aroud the string date.
Also, marked extension seem to convert everything in text, even boolean values, so beware of that (published field).

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
