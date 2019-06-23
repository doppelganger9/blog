---
title: Test/Blog Driven Development for a Status indicator using Uptime Robot APIs and Svelte
date: 2019-10-27T23:00:00
description: I've been talking about Test Driven Development lately, and this time, I  committed to it to add a Status indicator Svelte component, using the Uptime Robot APIs. I kinda wrote the blog post while implementing it, so it is also a Blog Driven Development 🤓
published: true
lang: en
keywords: Sapper, Svelte, SEO, Twitter Cards, OpenGraph, GatsbyJS, Gatsby, React, svelte:head, head, robots.txt, sitemap.xml, Facebook, raect, gatsby, gabtsy, gastby, gabtsyjs, gastbyjs, sevlte, saper, sappr
slug: 2019/10/27
thumb: https://source.unsplash.com/DdVCpBoHlv0/640x480
---

*(NOTE: this is a post I started on the end of June, I kind of lost track of the time during summer holidays and then other things happened. Luckily I found 2 hours to finish it today... enjoy!)*

Once, I saw a nice little green dot on another fellow programmer's blog and sadly I was not able to find it back.

![red and green-leafed plants by @inika, unsplash](https://source.unsplash.com/DdVCpBoHlv0/640x480)

So today I'll try my best at explaining this feature and implementing it on this blog.

You can see the result at the bottom of this page, and it should look like this:

![status indicator UP](status-UP.png)

1. monitor my website with Uptime Robot (free!)
2. set up a public status page
3. change DNS config to add a CNAME to have a subdomain https://status.lacourt.dev that will show this page.
4. add a green indicator for status on the main site.

After writing this last one, it seems a little obvious that you will never see it red, because if it is red, it means the website is unreachable, so you cannot see it... ah, maybe with offline and service-workers and stuff you can still look at an offline version that will still query the uptime API and show you that you will not be able to refresh data because the main website is down.

## Unit testing this?

Well, here, I'm stuck. Points 1, 2 and 3 seem all too complicated to test.

I could just write a test that fetches status.lacourt.dev to see if it answers. But I will not make it go down to check that the status page shows it is down! And those things are configuration not code, so I might say that it does not require unit testing as there is no code involved.

*Please if you know better, reach me and enlighten me! I will be delighted!*

At least I can test first the "widget" part.

I first added a test that proves the feature is present in the blog's footer section.

```js
describe(`The Status component`, () => {
 it(`should be present in the footer`, () => {
 cy.visit('/');
 cy.get('footer')
 .get(`[data-cy="status-indicator"]`)
 .should('exist');
 });
});
```

*NOTE*: When you write E2E tests first, you want to target them via a `data-something` attribute, so that the selector is not coupled with the implementation details. Here, I don't yet know if I will use an Anchor `<A>` or a `<button>` or a clickable `<image>` or whatever.

See the [Cypress Best Practices section](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements) for more info on this.


Going back to our test, of course, It went red.

![red](status-tdd-red.png)

Then I added the anchor in the Footer.svelte component
```js
<!-- in Footer.svelte -->
<a data-cy="status-indicator" href='bleh'>
 Status: Not even tested
</a>
```
It went green but as you see, I only wrote what's needed to make it pass.

![green](status-tdd-green.png)

I went on and added red tests, then wrote code, and even refactored things to make it less messy: making a `Status.svelte` component, extracting functions in tests to make tests more readable using *Clean Code*.

At one time, I had a CORS issue.

![CORS red 1](status-CORS-1.png)
![CORS red 2](status-CORS-2.png)

Thank you Cypress for being helpful with this error message, I just added the option (`"chromeWebSecurity": false` in cypress.json settings file), and bam! Green.

![CORS green](status-CORS-green.png)

## Playground

![blue and yellow playground by @wildfirewilly, unsplash](https://source.unsplash.com/nrcpPfXwYBo/640x480)

[@MPJ already explained this in his videos about TDD](https://www.youtube.com/watch?v=Eu35xM76kKY), he uses a playground file to try calling APIs. 

The idea is: 
- read the documentation, for example in my case [The Uptime API documenation](https://uptimerobot.com/api), 
- write some quick and dirty code to call the real API. Of course, you need a valid api_key, parameters, etc.
- After this is working, you can refactor and move this code into your app
- Also, this way you will quickly discover if the API conforms to its documentation or... not.

I went a little further and wrote automated tests that would call the API just to have a way to automatically prove that the API is working in a way I want it to. And if it stops working this way, the test will break and it will tell me to rewrite things.

In other words, *external APIs should not be 100% tested on your side, but you should write tests that will express your expectations about the behavior of these APIs. This way, you can run these tests against the real API to detect any breaking changes.*

Also, after doing this, you get a clear understanding of how the API works, and you can either capture real response samples or write ones manually to create an API Stubs to use in other tests.

## API Stubs

So you see now that I know how the real API behaves, and I even have copy-pasted its response, I can use a **really neat** feature of Cypress.io which is `cy.server` to stub API calls.

What is an *API Stub*?

Well, instead of calling real APIs, you can short-circuit those calls and replace them with controlled and reliable responses. This, in turn, enable testing exactly what is expected given a specific response from the server.

Okay, for example, this status API currently returns "up". What if I want to test the "down" case? I won't stop my server for this, that would be insane! So I just read the API documentation.

In this case, it was the Uptime Robot API.

In the following Cypress test I configured an API Stub that would return status code `2` which means `WAITING` as far as the Uptime Robot API is concerned:

```js
 it(`should first show a waiting indicatorbefore the API returns its response`, () => {
    // configuring the API stub to return WAITING code value
    cy.server();
    cy.route({
        method: 'POST',
        url: `https://api.uptimerobot.com/v2/getMonitors`,
        response: {
            monitors: [
                {
                    url: 'https://lacourt.dev',
                    friendly_name: 'Lacourt.dev',
                    status: 2,
                }
            ]
        }
    }).as('mocked-uptime-getMonitors-API');

    // when rendering the page, the status should have the css class "waiting"
    cy.visit('/');
    footerStatusAnchor(cy).should('have.class', 'waiting');
    
    // and after the API is called, the class will remain.
    cy.wait('@mocked-uptime-getMonitors-API');
    footerStatusAnchor(cy).should('not.have.class', 'waiting');
 });
```

Then I wrote the code to make it pass.
I wrote a lot of other tests to triangulate the implementation and to write the specification of every expected status returned by the API.

![all the tests are green](status-all-the-tests-are-green.png)

## Refactor

![person holding tool during daytime by @christopher__burns](https://source.unsplash.com/8KfCR12oeUM/640x480)

When it was done, I looked at my tests which were showing a lot of duplicated code and proceeded to refactor them.

Yes, you can and *you should* refactor both the tested code and the test code!

Then when I found that the test code was more compact and readable, I started refactoring the Sapper/Svelte code.

I had put everything inside the `Footer.svelte` file, but clearly, I could make a dedicated component that I would import into Footer to decouple things.

## Decoupling

This is a good time to tell you why I also love TDD: it helps you take a step back once everything works and try to improve things without fear of breaking things.

> Make it work, make it right, make it fast.
> -- Kent Beck

You end up with some code that does something business-wise and some code that ensures that what is done is what you expect. And writing the last one first, and making it fail first, ensures that this code is really testing what it is supposed to test.

The end result is `src/components/Status.svelte`, open sourced on [this blog's GitHub repository](https://github.com/doppelganger9/blog/tree/master/src/components/Status.svelte).

The integration test is also there: [`cypress/integration/status.js`](https://github.com/doppelganger9/blog/tree/master/cypress/integration/status.js)

## "Blog-Post Driven Development"

Clearly, I used TDD to develop this feature, but I added a step that transforms it into *Blog-post Driven Development*:

- ❤️ *RED*: write a failing test
- 💚 *GREEN*: write just enough code so the test passes
- 💙 *BLUE*: refactor test and code
- 🖤 *BLACK*: ink it in a blog post to capture minute details about the TDD process, thoughts, etc. contrary to other articles that explain the end result which gives a false view about my expertise and process (even if I try to demonstrate how I bump into errors until it finally works).

## Not perfect

![Brown and black wooden handle by @viktortalashuk](https://source.unsplash.com/zeDFAi3MtuQ/640x480)

Right now, I'm still thinking about separating more my tests between the tests that rely on the real API, and the ones that just test the Status component behavior. Also writing the last sentence, I recognize that the Status component is tightly coupled with the fetch request and the Uptime API, maybe I should refactor this and extract it in another file.

What do you think? What should I do? I tend to think that it is already good enough, for this feature and this blog. But I know from experience that when I will revisit this in the future, I might wonder what did I think at this time 😂.

## Conclusion

> In this post I've shown you the process of writing a new feature using Test Driven Development using End to End tests with Cypress.io
>
> If you have any questions about TDD, Cypress, Svelte, Sapper, or just want to say hi or thank you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!


Photo credit from [Unsplash](https://unsplash.com) by @inika, @wildfirewilly, @christopher__burns, and @viktortalashuk.
