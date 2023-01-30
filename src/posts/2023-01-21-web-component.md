---
title: Re-using my sample QR Code StencilJS Web Component
date: 2023-01-21T22:20:00
published: true
description: Sample QR Code component usage in a SvelteKit page.
tags: blog
category: Dev
lang: en
keywords: StencilJS, webcomponent, web-component, web component, custom element, sveltekit, svelte
slug: 2023/01/21
thumb: https://source.unsplash.com/KZNTEn2r6tw/640x480
---

![Photo Boards](https://source.unsplash.com/KZNTEn2r6tw/640x480)

## A quick post showing how to integrate a StencilJS Web Component

A few years back (_October 2017_), I made a [sample QR Code](https://doppelganger9.github.io/stencil-qrcode-component) [web component/Custom Element](https://html.spec.whatwg.org/multipage/custom-elements.html) using [StencilJS](https://stenciljs.com/).

Last year I tried to show this off on this blog, and only succeeded today 😅. 

Better late than never!

The hard part was finding how to import an ES Module built by StencilJS and published on a Github Page.

[This Stackoverflow post](https://stackoverflow.com/a/73035753) showed me how to use async imports to load an [ES Module](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/).

You can find the page on the github repository, try it in the [playground web-component page](/playground/web-components); I also combined Markdown parsing + Svelte to integrate it in this post below.

## Try it out

Here is a QR Code Custom Element with Svelte bindings to make it more reactive.

<script lang="ts">
  import { onMount } from 'svelte';

  let qrCodeContents = "test";

  onMount(async () => {
    // this one is a StencilJS component
    await import("https://doppelganger9.github.io/stencil-qrcode-component/build/stqrcmp.esm.js");
    // this one is an Angular Element application and needs Zone.js
    await import("https://cdnjs.cloudflare.com/ajax/libs/zone.js/0.8.26/zone.min.js");
    await import("https://doppelganger9.github.io/tables-multiplications/table-multiplication-app.js");
  });

</script>
<label for="qr-content">You can change the QR Code contents here:</label>
<input id="qr-content" type="text" bind:value={qrCodeContents} />

<qr-code
  class="with-rounded-corners"
  contents={qrCodeContents}
  output-mode="SVG"
  style="width: 300px;height: 300px;">
</qr-code>

<style>
  qr-code {
    padding: 5px;
    margin: 0 auto;
  }
</style>

## And now an Angular Application (packaged as a Web Component using Angular Elements)

Maybe I'll need to import `zone.js`...

<tables-multiplications-app></tables-multiplications-app>

## The code

Seems simple, after having spent a few hours on trying to make it work 😂!

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let qrCodeContents = "test";

  onMount(async () => {
    // this one is a StencilJS component
    await import("https://doppelganger9.github.io/stencil-qrcode-component/build/stqrcmp.esm.js");
    // this one is an Angular Element application and needs Zone.js
    await import("https://cdnjs.cloudflare.com/ajax/libs/zone.js/0.8.26/zone.min.js");
    await import("https://doppelganger9.github.io/tables-multiplications/table-multiplication-app.js");
  });

</script>
<label for="qr-content">You can change the QR Code contents here:</label>
<input id="qr-content" type="text" bind:value={qrCodeContents} />

<qr-code
  class="with-rounded-corners"
  contents={qrCodeContents}
  output-mode="SVG"
  style="width: 300px;height: 300px;">
</qr-code>

<style>
  qr-code {
    padding: 5px;
    margin: 0 auto;
  }
</style>

<!-- And the Angular App Custom Element:  -->
<tables-multiplications-app></tables-multiplications-app>

```

## towards Micro-Frontends ?

This is an example to show how to mix 3 frameworks (Svelte, StencilJS, Angular) with SvelteKit as the Host, and StencilJS or Angular providing custom web components. One of these custom elements is an entire app (albeit small)!

My ultimate goal is to learn by experimenting on how to integrate/federate different apps built with different technologies (React, Angular, StencilJS, Svelte, Vue).

To do that, this blog is an interesting playground. Also I have other side projects in these technologies, that I could federate and explain more in this blog.

- a Vue app : https://github.com/doppelganger9/hystoire-de-fou 
- a React app : https://github.com/doppelganger9/react-cv-template

So, my next goal is to try integrating one of those 2 apps.

Maybe this blog will become a complete website, we'll see...

See you in a year! ...well, just kidding, I hope not, we'll see 🤞!

_(EDIT: I integrated an Angular App a few days later. I will complete this post with more details.)_

## Reference

See https://github.com/doppelganger9/stencil-qrcode-component

Image credit : _"Photo Boards" from Unsplash user [@createandbloom](https://unsplash.com/fr/@createandbloom)_

## Discussion

As always, feel free to reply to this post below 👇, also [my DMs are open on Twitter](https://twitter.com/doppelganger9) or you can find me on Mastodon: <a rel="me" href="https://mastodon.social/@david_lacourt@mamot.fr">@david_lacourt@mamot.fr</a>!
