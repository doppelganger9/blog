---
title: Web Components/Custom Elements as Micro Front-Ends (MFE)
date: 2023-01-21T22:20:00
published: true
description: Initially in this post I reused an old QR Code webcomponent to show how to integrate it in a SvelteKit page. Later I edited to add apps based on Angular Element, Vue Custom Element and React Custom Element. All my orphaned side-projects re-united here!
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

## Custom Elements or Web Components?

What is the difference?

See this really good answer on StackExchange https://softwareengineering.stackexchange.com/a/289039

(I'll rewrite it in my own word later)

## Import Maps

I discovered this when migrating my Vue 2 app to Vue 3 to be able to expose it as a custome element.

See https://www.honeybadger.io/blog/import-maps/
https://html.spec.whatwg.org/multipage/webappapis.html#import-maps

_(EDIT 2023-02-06)_ Unfortunately, when writing this post, [importmaps were not yet supported on Safari and Firefox](https://caniuse.com/?search=import%20maps). There is an [existing polyfill for ES Modules including importmaps](https://github.com/guybedford/es-module-shims), So I added it after reading [this great post explaining how it works](https://guybedford.com/es-module-shims-production-import-maps).

I used `importShim` instead of `import` in the code above to allow dynamic imports to work as expected.

It should work on Safari, Safari Mobile, Chrome and Firefox, now.

## Interoperability

On https://custom-elements-everywhere.com/ you can check which frameworks works well with Custom Elements and as Custom Elements.

Also a quick check on https://caniuse.com/?search=web%20component 

In a nutshell, Custom Elements do not work on Internet Explorer 11 or Opera Mini, but almost everywhere else. There are [polyfills](https://www.webcomponents.org/polyfills/) if you want full support on these outdated browsers.

## Try it out

Below, there are:

- a [Svelte Web Component](#svelte-component-compiled-as-custom-element) compiled as a Custom Element;
- a [simple QR-Code Web Component](#stenciljs-component) with Svelte bindings to make it more reactive;
- an [Angular App](#and-now-an-angular-application-packaged-as-a-web-component-using-angular-elements) built with Angular Elements;
- an [Vue 3 + VueX 4 App](#also-vue-3--vuex-4) exposed as a Custom Element (only possible without a special library since Vue 3);
- a [React App](#aaaaaaand-react), also exposed as a Custom Element.

![Voltron](/voltron.gif)

<script lang="ts">
  import { onMount } from 'svelte';
  import SampleCustomElement from '/src/lib/components/SampleCustomElement.svelte';

  let qrCodeContents = "test";

  onMount(async () => {
    // this one is a StencilJS component
    await import("https://doppelganger9.github.io/stencil-qrcode-component/build/stqrcmp.esm.js");

    // this one is an Angular Element application
    await import("https://doppelganger9.github.io/tables-multiplications/main.js");

    // this one is a build-less Vue 3 Custom Element app.
    // I'm using an importmap for vue/vuex/vue devtools, I had to add it to my index.html
    // or else it would error.
    // the required Google Font Caveat is included below
    // On Safari and Firefox, importmaps are not yet supported, so we use ES Module Shim to polyfill it.
    // Furthermore, dynamic imports in this case need another tweak, 
    // we'll use importShim instead of import to make them work.
    await importShim("https://doppelganger9.github.io/hystoire-de-fou/vue-app.mjs");

    // For the React App, I did not manage yet to package Fonts inside the Web Component.
    // Adding a link rel="stylesheet" for Google Roboto Font
    const styleLinkForRobotoFont = document.createElement("link");
    styleLinkForRobotoFont.rel = 'stylesheet';
    styleLinkForRobotoFont.href = 'https://fonts.googleapis.com/css?family=Roboto|Caveat';
    document.head.appendChild(styleLinkForRobotoFont);
    // Adding a style tag to load FontAwesome
    const styleLinkForFontAwesome = document.createElement("link");
    styleLinkForFontAwesome.rel = 'stylesheet';
    styleLinkForFontAwesome.href = 'https://doppelganger9.github.io/react-cv-template/assets/index.css';
    document.head.appendChild(styleLinkForFontAwesome);
    await importShim("https://doppelganger9.github.io/react-cv-template/assets/index.mjs");
  });
</script>

## Svelte component compiled as Custom Element

- with `<svelte:options tag="sample-custom-element" />`
- only imported once to avoir errors
- `vite.config.js` adapted to only compile custom elements the Svelte components with the above option (see [this vite-plugin-svelte issue comment](https://github.com/sveltejs/vite-plugin-svelte/issues/270#issuecomment-1033190138))

<sample-custom-element></sample-custom-element>

## StencilJS component

<label for="qr-content">You can change the QR Code contents here:</label>
<input id="qr-content" type="text" bind:value={qrCodeContents} />

<div style="background-color: gray;">
<qr-code
  class="with-rounded-corners"
  contents={qrCodeContents}
  output-mode="SVG"
  style="width: 300px;height: 300px;">
</qr-code>
</div>

<style>
  qr-code {
    padding: 5px;
    margin: 0 auto;
  }
</style>

## And now an Angular Application (packaged as a Web Component using Angular Elements)

- I switched to a _Zone-Less_ on-push detection strategy.
- Styles are not yet correctly imported.

<div style="background-color: lightblue; color: #333; padding: 0 1em;">
  <tables-multiplications-app></tables-multiplications-app>
</div>

## Also Vue 3 + VueX 4

- from my side-project https://github.com/doppelganger9/hystoire-de-fou (in french)
- I had to handle `importmaps` to make it possible.
- Google Font Caveat is imported with a dynamic `<link rel='stylesheet'>` tag appended to the `<head>` of the document.

<div style="background-color: lightyellow; color: #333; padding: 0 1em;">
  <hdf-app-root></hdf-app-root>
</div>

## Aaaaaaand React

- my curriculum is a React App : https://github.com/doppelganger9/react-cv-template
- I had to dynamically create and import CSS to load Google Font Roboto and FontAwesome to make it work.

<cv-app-root style="display:block; margin-left: -150px; width: 800px;"></cv-app-root>

## The code

Seems simple, after having spent a few hours on trying to make it work 😂!

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import SampleCustomElement from '/src/lib/components/SampleCustomElement.svelte';

  let qrCodeContents = "test";

  onMount(async () => {
    // this one is a StencilJS component
    await import("https://doppelganger9.github.io/stencil-qrcode-component/build/stqrcmp.esm.js");

    // this one is an Angular Element application
    await import("https://doppelganger9.github.io/tables-multiplications/main.js");

    // this one is a build-less Vue 3 Custom Element app.
    // I'm using an importmap for vue/vuex/vue devtools, I need to import it before all other scripts (or else it will throw an error) 
    // Note: svelte:head is not allowed inside the markdown blog post content, 
    // so we have to find another way!
    // So I had to add it the HEAD tag of the index.html file.
    // the required Google Font Caveat is included below
    // On Safari and Firefox, importmaps are not yet supported, so we use ES Module Shim to polyfill it.
    // Furthermore, dynamic imports in this case need another tweak, 
    // we'll use importShim instead of import to make them work.
    await importShim("https://doppelganger9.github.io/hystoire-de-fou/vue-app.mjs");

    // For the React App, I did not manage yet to package Fonts inside the Web Component.
    // Adding a link rel="stylesheet" for Google Roboto Font
    const styleLinkForRobotoFont = document.createElement("link");
    styleLinkForRobotoFont.rel = 'stylesheet';
    styleLinkForRobotoFont.href = 'https://fonts.googleapis.com/css?family=Roboto|Caveat';
    document.head.appendChild(styleLinkForRobotoFont);
    // Adding a style tag to load FontAwesome
    const styleLinkForFontAwesome = document.createElement("link");
    styleLinkForFontAwesome.rel = 'stylesheet';
    styleLinkForFontAwesome.href = 'https://doppelganger9.github.io/react-cv-template/assets/index.css';
    document.head.appendChild(styleLinkForFontAwesome);
    await importShim("https://doppelganger9.github.io/react-cv-template/assets/index.mjs");
  });

</script>

<!-- A StencilJS QR Code component with some Svelte reactivity added -->
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

<!-- A Svelte compiled as a Custom Element -->
<sample-custom-element></sample-custom-element>

<!-- And the Angular App Custom Element:  -->
<tables-multiplications-app></tables-multiplications-app>

<!-- And the Vue 3 + VueX 4 Custom Element app:  -->
<hdf-app-root></hdf-app-root>

<!-- And the React Custom Element app: -->
<cv-app-root></cv-app-root>
```

## towards Micro-Frontends ?

This is an example to show how to mix 5 frameworks (Svelte, StencilJS, Angular, Vue 3, React) with SvelteKit as the Host, and Svelte / StencilJS / Angular / Vue 3 apps provided as web components. Some of these custom elements are complete apps!

My ultimate goal was to learn by experimenting on how to integrate/federate different apps built with different technologies (React, Angular, StencilJS, Svelte, Vue).

To do that, this blog is an interesting playground. Also I have other side projects in these technologies, that I could federate and later explain more in this blog.

- ✅ Svelte
- ✅ StencilJS
- ✅ Angular
- ✅ Vue 3
- ✅ React

![Power Ranger pyramid explosion](/power-rangers.gif)

Maybe this blog will become a hub for all my web app creations, we'll see...

See you in a few days!

_(EDIT: I integrated an Angular App a few days later. I will complete this post with more details.)_
_(EDIT2: I also integrated a Vue Custom Element app later.)_
_(EDIT3: I finished by migrating my React App to be able to package it as a Custom Element and included it here!)_

## Reference

- See my StencilJS QR-Code Web Component side-project: https://github.com/doppelganger9/stencil-qrcode-component
- See my Angular Elements side-project: https://github.com/doppelganger9/tables-multiplications
- See my Vue 3 + VueX 4 side-project: https://github.com/doppelganger9/hystoire-de-fou
- See my React CV side-project: https://github.com/doppelganger9/react-cv-template
- https://github.com/sveltejs/vite-plugin-svelte/issues/270#issuecomment-1033190138
- https://github.com/WICG/webcomponents
- https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements
- https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
- https://dom.spec.whatwg.org/#interface-shadowroot
- https://custom-elements-everywhere.com/
- https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue
- https://angular.io/guide/elements
- https://stenciljs.com/docs/introduction
- https://svelte.dev/docs#run-time-custom-element-api
- https://reactjs.org/docs/web-components.html
- [What is the difference between Web Components and Custom Elements?](https://softwareengineering.stackexchange.com/a/289039)

Image credit : _"Photo Boards" from Unsplash user [@createandbloom](https://unsplash.com/fr/@createandbloom)_

## Discussion

As always, feel free to reply to this post below 👇, also [my DMs are open on Twitter](https://twitter.com/doppelganger9) or you can find me on Mastodon: <a rel="me" href="https://mastodon.social/@david_lacourt@mamot.fr">@david_lacourt@mamot.fr</a>!
