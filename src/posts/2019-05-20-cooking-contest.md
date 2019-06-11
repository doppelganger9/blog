---
title: Cooking Contest 🎂!
date: 2019-05-20T09:00:00
description: I tried and learned how to use Svelte by making a small side-project for a team event.
published: false
lang: en
keywords: ["Svelte", "cooking", "contest"]
slug: 2019/05/20
---

## Another side-project

It's been some time since I had looked into Svelte V2 and found that it was interesting in its compile-time approach to reduce bundle size and make the framework disappear at runtime. But I was not quite yet pleased by the templating language. So I left it aside for some time.

On the 22nd of April 2019, Rich Harris published this article about Svelte V3 ['Rethinking Reactivity'](https://svelte.dev/blog/svelte-3-rethinking-reactivity) and an associated video from You Gotta Love Frontend:

<iframe width="560" height="315" src="https://www.youtube.com/embed/AdNJ3fydeao" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

It was mind-blowing.

So, as you can imagine, it made me want to discover more of this new Svelte version 3.

In order to do this, I know that I need a practical and fun subject to explore.

We regularly have cooking contests between our feature teams at work, and I thought I could creating something that might be useful for these events.

In the end, It was not used because the rating rules changed at the last minute 🤷‍♂️.

## GitHub and leaked Firebase API Keys

When I pushed the content on GitHub I paid extra attention not to push API Keys there.

Guess what happened? API keys got pushed in an orphan commit.

Thanks to [GitGuardian](https://www.gitguardian.com/), I received an unsollicited email about this leak, which helped me fix it.

I tried removing the orphan commit, but as it was not a critical nor used repository, I simplified this by just deleting everything (Firebase project, Github repository), cleaning up, then sending it back.

I have still to recreate the Firebase project.

## Next: Sapper

So given my extremely positive experience so far with Svelte, I decided to go on, exploring Sapper, its JAMStack framework.

And you are loking at the end result: this blog is now powered by Sapper + Svelte, instead of Gatsby + React

*Gatsby is so 2018!* 🤣

Kidding aside, both are awesome, but Sapper feels more like native HTML + CSS + JS, and if you've seen the video above, it even has a positive spreadsheet-like simplicity to it.

By this, I mean I don't have to learn new strange abstractions or convoluted Functional Programming paradigms to represent things in the DOM.

Sometimes it's nice to do smart things, but it is even nicer to do dumb things.
