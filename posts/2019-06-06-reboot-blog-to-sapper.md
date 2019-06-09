---
title: Blog reboot
date: 2019-06-06T09:00:00
description: It has happened again, I switched the blog from Gatsby to Sapper...
published: true
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

## What's next?

I need to port those features from the previous blog:

- Twitter buttons
- SEO
- Google Analytics

I had an issue with the metadata date, for which I needed to remove the double-quote aroud the string date.
Also, marked extension seem to convert everything in text, even boolean values, so beware of that (published field).

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
