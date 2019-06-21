---
title: migrating to Sapper part 1 - SEO, Twitter Cards, OpenGraph
date: 2019-06-16T20:00:00
description: part 1 of my series on describing how I migrated from a GatsbyJS/React blog to Sapper/Svelte. This one is about SEO; Twitter Cards, Facebook/OpenGraph, Google Search, sitemap.xml and robots.txt.
published: true
lang: en
keywords: Sapper, Svelte, SEO, Twitter Cards, OpenGraph, GatsbyJS, Gatsby, React, svelte:head, head, robots.txt, sitemap.xml, Facebook
slug: 2019/06/16
thumb: https://lacourt.dev/thumb-seo-svelte.png
---

![SEO code for svelte](thumb-seo-svelte.png)

Today, we will look into how I migrated the SEO features of my previous GatsbyJS/React blog stack to Sapper/Svelte.
As you'll see, like a lot of feature, it was really easy and straightforward to do, and made me better understand what was the purpose of this feature, and how to make it work; better than just using a plugin.

## Why SEO?

First things first, the acronym means **"Search Engine Optimization"**.

In this article I will mainly focus on the following:

- providing title and keywords for Google Search algorithm
- further customizing Google Search entry
- providing a Twitter Card
- providing a Facebook card / Open Graph data
- robots.txt
- sitemap.xml

That's the current extent of my SEO knowledge, which is a fulltime job in itself!

### Google Search entries & ranking

Last time I tried this Google Search: https://www.google.com/search?q=sapper+svelte+david+lacourt, I got this:

![example Google Result](example-google-result.png)

As you see,

- the first part is the page's Title, from the HTML's `<head><title>` tag.
- The second part is the URL.
- the third shows "Sapper webpack template website.... " + some cropped content of the page. I failed this one, as it would use the `<head><meta name="description" content="..." />` tag. In fact, I have 2 meta tags, so I'll remove the first, and let the second one fix it all.

Don't worry, we'll see later how to do it with Svelte.

### Twitter Card

You can add meta tags to help Twitter create a card preview of a linked URL in a tweet.

Here is an example:

![sample twitter card](cooking-contest-twitter-card.jpg)

As you see, there is a title, a description, an image, an origin website name.

More details on the [Twitter for developers documentation](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards).

Again, a Svelte example will come further down.

### OpenGraph protocol

It is more or less the same idea than the Twitter Card, but for Facebook and others.

See http://ogp.me/

> enables any web page to become a rich object in a social graph

Here is a sample rendering in a Facebook preview:

![facebook integration](ogp-facebook-preview.png)

Again, a title, the name of the originating website, a description.

There is a Svelte sample below.

## GatsbyJS

Gatsby had a plugin to handle SEO for twitter card and OpenGraph stuff for articles.

I mainly looked it up on internet, Google Search, OpenGraph and Twitter for developers documentation, and found a few [website](http://debug.iframely.com/?uri=https%3A%2F%2Flacourt.dev%2F2019%2F05%2F20) that can help you set up the correct `<head>` tags.

## Enters `<svelte:head>`

As promised, here we'll see how to do all of this in Svelte!

In GatsbyJS, inserting data in the `<head>` is done with [Helmet](https://github.com/nfl/react-helmet).

Luckily with Svelte we have the `<svelte:head>` tag that does a similar job.

Give a look at the [tutorial on the Svelte site](https://svelte.dev/tutorial/svelte-head).

### Sample

In the [`src/template.html`](https://github.com/doppelganger9/blog/blob/master/src/template.html#L27) there is a `%sapper.head%` placeholder that will insert all the `<svelte.head>` components.

Then in the article template file [`src/routes/[slug].svelte`](https://github.com/doppelganger9/blog/blob/master/src/routes/%5Bslug%5D.svelte#L85-L107), there is a `<svelte:head>` section.

```html
<svelte:head>
  <title>{post.metadata.title}</title>
  <meta name="description" content="{post.metadata.description}" />
  <meta name="keywords" content="{post.metadata.keywords}"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://lacourt.dev/{post.slug}">
  <meta property="og:title" content="{post.metadata.title}">
  <meta property="og:description" content="{post.metadata.description}">
  {#if post.metadata.thumb}
  <meta property="og:image" content="{post.metadata.thumb}">
  {/if}

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://lacourt.dev/{post.slug}">
  <meta property="twitter:title" content="{post.metadata.title}">
  <meta property="twitter:description" content="{post.metadata.description}">
  {#if post.metadata.thumb}
  <meta property="twitter:image" content="{post.metadata.thumb}">
  {/if}
</svelte:head>
```

That's it.

Of course, you have to provide the metadata (description, keywords, title, thumb) for each page, but the above code will ensure it is inserted and used for SEO.

There are only 2 things left: `robots.txt` and `sitemap.xml`.

Let's dive into that next.

## robots.txt

We want Search engine robot crawlers to index and follow all the links on the website they'll find. And to help them out, we need to provide where is located the sitemap file which lists all URLs.

I copied the one I had from my GatsbyJS stack as Sapper does not provide this in its templates.

I also added a line for the `sitemap.xml` (might be redundant 🤷‍♂️).

```txt
User-agent: *
Disallow:
Sitemap: https://lacourt.dev/sitemap.xml
```

## sitemap.xml

Look at [`src/sitemap.xml.js`](https://github.com/doppelganger9/blog/blob/master/src/routes/sitemap.xml.js), and the line in the [`template.html`](https://github.com/doppelganger9/blog/blob/master/src/template.html#L9).

```html
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
```

The `src/sitemap.xml.js` endpoint generates the sitemap from all published posts, and a few hard-coded URLs: all non blog posts like the root URL, privacy-policy, etc.

It was adapted from Rich Harris' work for HN Svelte found here: [Sapper Issue 461: Add XML Generation/RSS XML feed](https://github.com/sveltejs/sapper/issues/461).

The original [source code is on GitHub](https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js).

I just reused the idea to provide a route for the `sitemap.xml` file.

You can see it live at [https://lacourt.dev/sitemap.xml](/sitemap.xml).

*Wow, it took me 10 minutes, really. Just as a reminder of how quick things are with Sapper/Svelte!*

## Conclusion

> In this post we looked at how to provide the expected tags for Google Search, Twitter Cards, Facebook URL previews (OpenGraph). This participate in "Search Engine Optimization" and helps make your content shine on the Internet!
>
> Again, it was quite easy to port this feature, and I learned a lot along the way, more than I did previously because everything was already set up!

👋
