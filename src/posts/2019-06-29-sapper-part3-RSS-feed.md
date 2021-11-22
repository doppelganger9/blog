---
title: migrating to Sapper part 3 - RSS feed
date: 2019-06-29T22:00:00
description: part 3 of GatsbyJS/React to Sapper/Svelte blog migration. This one is about adding an unneeded feature that will help you follow this blog with Google Reader... wait... what?
published: true
lang: en
keywords: Sapper, Svelte, GatsbyJS, React, raect, gatsby, gabtsy, gastby, gabtsyjs, gastbyjs, sevlte, saper, sappr, rss, syndication, feed, endpoint, test after
slug: 2019/06/29
thumb: https://source.unsplash.com/o4-YyGi5JBc/600x400
---

This article is part of a series of posts about migrating from GatsbyJS/React to Sapper/Svelte. You can check the other posts: [part 1](/2019/06/16), [part 2](/2019/06/21), [part 2 bis](/2019/06/30), and more to come!

![Alley of books by unsplash user @glennoble](https://source.unsplash.com/o4-YyGi5JBc/600x400)

## Sapper migration: part 3

This will be a small post.

The only thing you want to subscribe to is the RSS feed. What? It's not 2009... [hmmm... I already made that joke, right 🤭](/2019/03/20).

Anyway, here is a feature that would please me from a decade ago when I was still using Google Reader or Feedly instead of Twitter or Medium or others to read blog posts and articles online.

See https://en.wikipedia.org/wiki/RSS

This is the kind of business requirements that do not reflect the public's needs 😜.

...Except, someone asked for it in my Twitter's DMs so I think it is still used?

## A simple RSS endpoint

Adding an RSS endpoint to this Sapper website was almost too easy.

Let's have a look at [`src/rss.js`](https://github.com/doppelganger9/blog/blob/master/src/routes/rss.js):

```javascript
import { getPosts } from './_posts.js';

const siteUrl = 'https://lacourt.dev';

const renderXmlRssFeed = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
    <title><![CDATA[David's Blog]]></title>
    <link>${siteUrl}</link>
  <description><![CDATA[A developer's blog. Might be useful. Maybe.]]></description>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
        <url>${siteUrl}/profile-pic-small.jpg</url>
        <title><![CDATA[David's Blog]]></title>
        <link>${siteUrl}</link>
    </image>
    ${posts.map(post => `
        <item>
            <title>${post.title}</title>
      <link>${siteUrl}/${post.slug}</link>
      <guid isPermaLink="false">${siteUrl}/${post.slug}</guid>
            <description><![CDATA[${post.description}]]></description>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>
    `).join('\n')}
</channel>
</rss>`;

export function get(req, res) {

  res.writeHead(200, {
    'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
    'Content-Type': 'application/rss+xml'
  });

  const posts = getPosts()
    .filter(it => it.metadata.published == 'true')
    .filter(p => p.slug.indexOf('future/') < 0 && p.slug.indexOf('alternate-reality/') < 0)
    .map(post => {
      return {
        title: post.metadata.title,
        date: post.metadata.date,
        description: post.metadata.description,
        slug: post.slug,
      };
    });
  const feed = renderXmlRssFeed(posts);
  res.end(feed);

}
```

As you see, with **Sapper**, we can [expose a "Server Route"](https://sapper.svelte.dev/docs#Server_routes) that will here render a `application/rss+xml` content.

When we will call `sapper export` this endpoint will be called during the build process and will generate a static XML file based on the current app contents at build time. [Remember this website is statically generated ("SSG")? JAMStack?](https://www.staticgen.com/sapperjs)

The RSS Server Route takes the list of posts with some filtering rules, written in a functional programming declarative style, and calls a rendering function that generates XML content with posts data.

Doesn't it look simple?

I did not apply clean code here (my functions could still be refactored into shorter ones)?

So now that we've got the Server Route set up, let's make the RSS better integrated and ready for syndication!

### RSS auto-discovery link in the header

Browsers or other tools usually look for a hint from the HTML page so as to know if an RSS feed exists for the current web page.

Check this line in the [`template.html`](https://github.com/doppelganger9/blog/blob/master/src/template.html#L8); it advertises the link for auto-discovery of the RSS feed:

```html
  <link rel='alternate' type='application/rss+xml' title="RSS Feed for David's Blog" href='/rss' />
```

### Thanks Again to Rich Harris

Just to be clear, I did not come up with 100% of this. I searched the Sapper and Svelte issues about RSS and found a corresponding issue and hints from Svelte/Sapper creator's himself, Rich Harris (for the **Svelte HN app**):

[Sapper Issue 461: Add XML Generation/RSS XML feed](https://github.com/sveltejs/sapper/issues/461)

You can check the original source code is on GitHub:
 [https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js](https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js).

### End result

You can check the RSS feed live at [https://lacourt.dev/rss](/rss).

## Test first?... or after

😳😱 Woopsies...

Remember [TDD from part 2](/2019/06/21)?

I wanted to do it.

Except I failed.

So while writing this article I put myself in a kind of "late code review" mode with my past self and asked me to add tests.

Such schizophrenia.

Dear reader, welcome to **"Test After" mode**.

![Mailbox with books by unsplash user @samuelzeller](https://source.unsplash.com/G_xJrvHN9nk/600x400)

### Using Cypress to test HTTP requests

So I would I test this?

Can **Cypress.io** help me here?

Of course, it can! With `cy.request` and some assertions about the HTTP response to check a few basic things:

```javascript
describe(`RSS feed endpoint`, () => {

  beforeEach(() => {
    cy.request('/rss').as('rss');
    // this is an alias.
    // Later below we can refer to the request with `cy.get('@rss')`
  });

  it(`should return HTTP 200 OK`, () => {
    cy.get('@rss').should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it(`should return application/rss+xml content type`, () => {
    cy.get('@rss').should((response) => {
      expect(response).to.have.property('headers');
      expect(response.headers['content-type']).to.eq('application/rss+xml');
    });
  });

  it(`should contain at least one <item>`, () => {
    cy.get('@rss').should((response) => {
      expect(response).to.have.property('body');
      expect(response.body).to.contain('<item>');
    });
  });
});
```

Now that we have tests *after*, we can still check they are useful by removing the code and starting over.

- From RED failing tests,
- adding some code back so that we pass some test (GREEN),
- until everything works again.
- then refactor

As you might have noticed, there are some tests missing, namely:

- I don't check the exact contents of each item,
- or the number of items,
- or if the items match the articles from the blog.

That's what happens when you test after. And right now, I don't feel the need to add them!

This is the perfect example of why writing tests first is more motivating to write tests than writing them after the fact.

![Woman with a tattoo holding up a stack of books. By unsplash user @thoughtcatalog](https://source.unsplash.com/o0Qqw21-0NI/600x400)

## Conclusion

At least, for an almost unneeded feature, that was quick.

> In this third post about migrating my previous blog from GatsbyJS/React to Sapper/Svelte, we have seen how to add an RSS endpoint to the website, while failing to write tests first and thus showing why testing after kind of sucks.
>
> It was a short post because it was really easy to implement. I hope you found it interesting!
>
> If you have any questions about TDD, Cypress, Svelte, Sapper, or just want to say hi or thank you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!


Photo credit from [Unsplash](https://unsplash.com) by @glennoble, @samuelzeller, @thoughtcatalog.
