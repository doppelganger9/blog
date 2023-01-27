---
title: using Svelte components inside Markdown... or not.
date: 2019-06-20T19:00:03
published: false
description: A post about how I tested using svelte components inside markdown content. And ended up doing something completely diffenrent!
tags: svelte, inception, markdown
category: Dev
lang: en
keywords: svelte, markdown, web-components, components, web audio, animations, eliza, timer, 7guis
slug: 2019/06/20
---

## Can we use Svelte components inside Markdown?

Nope..?

## Digging deeper into Svelte samples

I found a few gems again:

- [ELIZA](https://en.wikipedia.org/wiki/ELIZA): a NLP (Natural Language Processing) program. There is a JS implementation named [elizabot](https://www.masswerk.at/elizabot/).
- [7GUIS](https://eugenkiss.github.io/7guis/): another take on providing a way to compare thoroughfully GUI frameworks, because coding a "TODO" or "Hello World" app is not enough.

## Referencing non-markdown routes

I made `.svelte` pages from samples found from different sources, and adapted them.
I plan to mix them all to do something really fun.

- [Web Audio API test page](/playground/audio)
- [Chrono](/playground/chrono)
- [Text to speech](/playground/blabla)
- [ELIZA](/playground/eliza)
- [Big Editable Text](/playground/bigeditabletext)
- [falling money](/playground/falling-money)

They are Vanilla Svelte and I had to handle the `window` global object with `onMount`.

I don't know if it's the best way to do it, but it works. Please contact me if you have another idea to handle this.

## How does a .svelte page 'works' in Sapper?

You'll see from the Sapper template that `.svelte` pages are composed of different parts:

- the usual Svelte parts for `<script>`, `<style>` and HTML tags, as well as Svelte special markup such as `{#something}` or `<svelte:something></svelte:something>`.
- a `<script context="module">` part that will be executed at build time.

If you put a console.log inside this module script, you'll see:

```html
<script context="module">
console.log('Hello, simple-module-example.svelte script module.')
</script>

<script>
import { onMount } from 'svelte';
import TitleBar from '../components/TitleBar.svelte';
let b = a;

onMount(() => console.log('log from inside onMount.'));

console.log('plain script JS code');
</script>

<h1>Very simple example</h1>
```

```bash
$ npm run dev

> package-name@2.0.0 dev .../directory-name
> sapper dev

✔ server (72ms)
✔ client (59ms)
✔ service worker (7ms)
Hello, simple-module-example.svelte script module.
> Listening on http://localhost:3000
plain script JS code
```

But it is also executed inside the browser.

- It will fire first.
- then the code inside script tags. (A component can only have one instance-level `<script>` element)
- Then the onMount callback.

```text
Hello, simple-module-example.svelte script module.
simple-module-example.svelte:13 plain script JS code
simple-module-example.svelte:11 log from inside onMount.
```

When you run in dev mode, the server.js part is serving stuff and executing code.
That's why you'll also see the plain `<script>` tag code logs in the terminal.

## Build something amazing

I assembled all those little gems and made [The Time-Boxer](/playground/time-boxing).

I will work more on it to make it even more useful for other situations.
