---
title: GitHub Discussions as Comments Section
date: 2021-11-28T22:58:00
published: true
description: A quick post explaining how we added GitHub Discussions to this blog's repository and will use it as an interactive comment section for each blog post using Giscus.
tags: blog
lang: en
keywords: Discussions, Giscus, GitHub Discussions, utteranc.es
slug: 2021/11/28
thumb: https://lacourt.dev/IMG_3474.jpeg
---

![very ugly watercolor painting rendering I made from my 2005 work notes which kind of relates to the concept of comments](/IMG_3474.jpeg)

## Adding a comment section powered by GitHub Discussions

In this blog's original TODO list of features, there was:

> TODO: Add a comment section using Github issues

In fact, from the beginning, I wanted a nice and nerdy way to interact with you; to give you some way to give feedback to this blog. 

### Utterances

I first found [Utterances](https://utteranc.es/) which is a GitHub App that will map Github Issues into a comment section for each blog post or webpage.

### Giscus

After looking at existing blogs, and learning about Github Discussions, there seemed to be even better thant using GitHub Issues!

Indeed, [Giscus](https://giscus.app/) is like *utteranc.es* but uses Github Discussions.

I also wanted to add Emoji reactions à la Github, and I'll get exactly that using this awesome App!

### Enable GitHub Discussions

So, I enabled Discussions on [this blog's GitHub repository](https://github.com/doppelganger9/blog/discussions), then I followed the instructions on https://giscus.app/ .

### localhost?

Well... it did not work first time on my development setup: I had to `git push` a commit to enable `localhost:*` origins.

I found in the Advanced Giscus documentation, that you can add a `giscus.json` file in your repository to add more customised options:

```json giscus.json
{
  "origins": ["https://lacourt.dev"],
  "originsRegex": ["http://localhost:[0-9]+"]
}
```

### Topics

In my case, I configured on the Giscus App page to match a blog post with a GH Discussion using `pathname` , so I think Giscus will create topics for each origin, be it http://localhost:3000 or https://lacourt.dev

### @giscus/svelte?

Oh, yeah I tried using [`@giscus/svelte`](https://github.com/giscus/giscus-component/tree/main/packages/svelte) component, but it did not work.

### Svelte onMount

To make the script work, I had to re-use a technique last used for Twitter integration, using Svelte's `onMount` to inject a `<script>` tag.

The contents come from the Giscus App web page script: just change the values to match your repo, repo-id, etc.

```svelte
<script>
	import {onMount} from 'svelte';
	
	onMount(() => {
		const child = document.createElement('script');
    child.async = 'async';
    child.src = "https://giscus.app/client.js"
    child.setAttribute('data-repo', "doppelganger9/blog");
    child.setAttribute('data-repo-id', "xxxxxxxx");
    child.setAttribute('data-category', "Post comments");
    child.setAttribute('data-category-id', "xxxxxxxxx");
    child.setAttribute('data-mapping', "pathname");
    child.setAttribute('data-reactions-enabled', "1");
    child.setAttribute('data-emit-metadata', "0");
    child.setAttribute('data-theme', "light");
    child.setAttribute('data-lang', "en");
    child.setAttribute('crossorigin', "anonymous");
    const body = document.getElementsByTagName('body')[0];
		body.appendChild(child);
	});
</script>
```

### Playground

Try it below 👇 (I hope it will work this time 🤞)
