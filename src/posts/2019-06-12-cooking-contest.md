---
title: Cooking Contest 🎂!
date: 2019-06-12T09:00:00
description: I tried and learned how to use Svelte by making a small side-project for a team event. Also, I like the Orange color.
published: true
lang: en
tags: Svelte, cooking, contest, orange, car, fail, Sapper
keywords: Svelte, cooking, contest, orange, car, fail, Sapper
slug: 2019/05/20
thumb: https://source.unsplash.com/TYlR9NGFrPs/600x400
---

![unsplash photo by @jibarofoto](https://source.unsplash.com/TYlR9NGFrPs/600x400)

*After a few weeks of silence, I'm back with new content!
I'll show you my new side-project about a silly cooking contest, built with [Svelte](https://svelte.dev).
You'll see pictures of failed cakes, my broken **Orange** car, a talk by **Rich Harris**, leaked API Keys, and some other things for future posts.*

## Another side-project

In 2018, I discovered SvelteJS and gave it a try. I found it was okay, but not enough to really make me want to switch from other modern JS UI frameworks (or libs) like *Angular*, *VueJS* or *React*.

I was really fond of its disappearing capability, everything is done at compile time, there was almost nothing left at runtime. Thus, a very lightweight framework at runtime.

What I did not like at the time was the templating language. It felt like [old 2006 Apache Velocity templates](https://velocity.apache.org/engine/2.1/user-guide.html#what-is-velocity).

## 2019/04/22

On the 22nd of April 2019, [Rich Harris](https://twitter.com/Rich_Harris), creator of Svelte, published this article about Svelte V3 ['Rethinking Reactivity'](https://svelte.dev/blog/svelte-3-rethinking-reactivity) and an associated video from *You Gotta Love Frontend*:

<iframe width="560" height="315" src="https://www.youtube.com/embed/AdNJ3fydeao" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

It was mind-blowing 🤯. Go watch it. Now.

So, as you can imagine, it made me want to discover more of the new Svelte version 3.

In order to do this, I know that I need a practical and fun subject to explore.

## Enters the Cooking Contests

![Cake Battle 1 - before](cake-battle1-before.jpg)

We regularly have cooking contests between our feature teams at work.

Usually, I team up with my wife as we're the best cooking team *EVER*, and we create food.
Okay, we *NAILED IT* this time with the Pesto-Mozzarella cake and it got the worst ratings...

but, look! 👇 my coworkers ate almost all of it, which for me is the best heuristic to select a winner!

![Cake Battle 1 - after](cake-battle1-after.jpg)

## [cooking-contest.web.app](https://cooking-contest.web.app/)

So I thought that I could create something that might be useful for these events. No, I did not even think about fudging the future contests for me to win 😈🤭🤥.

At the moment of writing, I've spent around 22 cumulated hours on this little web app, starting from scratch (no prior knowledge).

I'm very impressed by the learning curve, simplicity of the framework and the resulting code is so lean and clean, compared to other UI frameworks.

- I only used SvelteV3, starting from [the REPL on the Svelte.dev website](https://svelte.dev/repl/).
- Then I tried [CodeSandbox](https://codesandbox.io/dashboard/recent) which also has a starter for Svelte.
- After using it as a playground, I downloaded the project as a ZIP file, unzipped it, and continued fiddling with it until it started to look like a real app. I frequently committed to git to save my progress.
- Adding i18n took me half an hour.
- Adding Routing and an animated side menu took me 2 hours, including reading the docs and using the Svelte REPL to understand how tweening and easing works.
- Integrating Firebase took me a little more than 8 hours.
- Playing with CSS, look & feel and design took me a few hours as it is not of my strength, to say the least 🙄.
- the last 2 hours were used to rebase interactively my local repo a few times to clean up a bit, removing sensitive API Keys, adding a license, providing a name and description in package.json.

You can take a look at the end result on [the GitHub repository](https://github.com/doppelganger9/cooking-contest).

You can play with the deployed version : [https://cooking-contest.web.app/](https://cooking-contest.web.app/), use "david" or any other username. *I might delete the contents or block access if there is any suspicious usage.*

---

### Animated Leaderboard

![Cooking-contest leaderboard screen](coco1.jpg)

### Home: my evaluations

![Cooking-contest my evaluations screen](coco2.jpg)

### Evaluating one meal

![Cooking-contest evaluation screen](coco3.jpg)

---

It's okay if your eyes are bleeding. Wipe the blood, and please continue reading.

<div style="width:100%;height:0;padding-bottom:51%;position:relative;"><iframe src="https://giphy.com/embed/YsOpzCbCfLJfO" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/someone-wiki-phobia-YsOpzCbCfLJfO">via GIPHY</a></p>

#### Firebase Hosting

By the way, it is deployed on Firebase Hosting. It helped me rank up the PWA points in the Lighthouse Audit scan.

![PWA ranking Lighthouse Audit](PWA-score-coco.png)

## Orange

Okay, as you'll see, my visual and color design skills are not the best around. I iterated until it looked fun and *orangey*.

Because Svelte is *Orange* and I like *Orange*. Did you know I had *an orange car*.

That is until someone smashed it to pieces:

![my orange car is broken](my-orange-car-is-broken.jpg)

_I work for an insurance company, don't worry, it took 2 months, but everything is back to normal. Except now I miss my Orange car_

In the end, It was not used because the rating rules changed at the last minute 🤷‍♂️.

## GitHub and leaked Firebase API Keys

![lost key from unsplash @iantuck](https://source.unsplash.com/OQxJd-eGuhg/600x400)

When I pushed the content on GitHub I paid extra attention not to push API Keys there.

*Guess what happened?*

my first set of API keys got pushed in an orphaned commit.

Thanks to [GitGuardian](https://www.gitguardian.com/), I received an _unsollicited_ email about this leak, which helped me fix it.

I tried removing the orphaned commit. I failed. As it was not a critical nor used repository, I simplified this by just deleting everything (Firebase project, Github repository), cleaning up, then sending it back.

I've just finished recreating the Firebase project.

## Next: Sapper

![unsplash photo by @brizmaker](https://source.unsplash.com/_ZfLlKxilpw/600x400)

So given my extremely positive experience so far with Svelte, I decided to go on, exploring [Sapper](https://sapper.svelte.dev), its [JAMStack](https://jamstack.org/) framework.

And, by the way, you are looking at the end result: *this blog is now powered by Sapper + Svelte*, instead of Gatsby + React.

*Gatsby is so 2018!* 🤣

Kidding aside, both are awesome, but Sapper feels more like native HTML + CSS + JS.

And if you've seen the video above, it even has a positive _spreadsheet-like simplicity_ to it.

By this, I mean I don't have to learn strange new abstractions or convoluted Functional Programming paradigms to represent things in the DOM.

Sometimes it's nice to do smart things, but it is even nicer to do dumb things.

## Conclusion

> Wow, in this post I showed you my new side-project [cooking-contest.web.app](https://cooking-contest.web.app) which is built with [Svelte](https://svelte.dev). You've seen pictures of failed cakes, my broken *Orange* car, a talk by *Rich Harris*, leaked API Keys, and spoilers about upcoming blog posts on using Sapper to rebuild this blog.
>
> I hope you liked it; if you have any questions, or just want to say hi or thanks you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!


Photo credit from [Unsplash](https://unsplash.com) by @jibarofoto, @brizmaker, @iantuck.
