---
title: migrating to Sapper part 3 - RSS feed
date: 2019-06-24T19:00:00
description: part 3 of GatsbyJS/React to Sapper/Svelte blog migration. This one is about adding an unneeded feature that will help you follow this blog with Google Reader... wait... what?
published: false
lang: en
keywords: Sapper, Svelte, GatsbyJS, React, raect, gatsby, gabtsy, gastby, gabtsyjs, gastbyjs, sevlte, saper, sappr, rss, syndication, feed, endpoint, test after
slug: 2019/06/24
thumb: https://source.unsplash.com/o4-YyGi5JBc/600x400
---

This article is part of a series of posts about migrating from GatsbyJS/React to Sapper/Svelte. You can check the other posts: [part 1](/2019/06/16), [part 2](/2019/06/21), [part 2 bis](/2019/06/27), and more to come!

![Alley of books by @glennoble](https://source.unsplash.com/o4-YyGi5JBc/600x400)

## Sapper migration part 3

This will be a small post.

The only thing you want to subscribe to is the RSS feed. What? It's not 2009... [hmmm... I already made that joke, right 🤭](/2019/03/20).

Anyway, here is a feature that would please me from a decade ago when I was still using Google Reader or Feedly instead of Twitter or Medium or others to read blog post and articles online.

See https://en.wikipedia.org/wiki/RSS

This is the kind of business requirement that does not reflect the public's needs 😜.


## Simple RSS endpoint

It's almost too easy.

Look at [`src/rss.js`](https://github.com/doppelganger9/blog/blob/master/src/routes/rss.js), and the line in the [`template.html`](https://github.com/doppelganger9/blog/blob/master/src/template.html#L8) advertising the link for auto-discovery of the RSS feed:

```html
  <link rel='alternate' type='application/rss+xml' title="RSS Feed for David's Blog" href='/rss' />
```

It was adapted from Rich Harris' work for HN Svelte found here: [Sapper Issue 461: Add XML Generation/RSS XML feed](https://github.com/sveltejs/sapper/issues/461). Original source code is on GitHub:
 [https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js](https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js).

You can see it live at [https://lacourt.dev/rss](/rss).

## Test first?... or after

😳😱

Remember [TDD from part 2](/2019/06/21)? I wanted to do it. Except I failed. So while writing this article I put myself in a kind of "late code review" mode with my past self and asked me to add test. Such schizophrenia. 

This is "Test After" mode.

![Mailbox with books by @samuelzeller](https://source.unsplash.com/G_xJrvHN9nk/600x400)

### Using Cypress to test HTTP requests

So I would I test this?

Can **Cypress.io** help me here?

Of course, it can! With `cy.request` and some assertions about the HTTP response to check a few basic things:

```json
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

That's what happens when you test after. And right now, I don't feel the need to add them! This is the perfect example of why writing tests first is more motivating to write tests than writing them after the fact.

![Woman with a tattoo holding up a stack of books.@thoughtcatalog](https://source.unsplash.com/o0Qqw21-0NI/600x400)

## Conclusion

At least, for an unneeded feature, that was quick.

> In this third post about migrating my previous blog from GatsbyJS/React to Sapper/Svelte, we have seen how to add an RSS endpoint to the website, while failing to write tests first and thus showing why testing after kind of sucks.
>
> It was a short post because it was really easy to implement. I hope you found it interesting!
>
> If you have any questions about TDD, Cypress, Svelte, Sapper, or just want to say hi or thank you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!


Photo credit from [Unsplash](https://unsplash.com) by @glennoble, @samuelzeller, @thoughtcatalog.
