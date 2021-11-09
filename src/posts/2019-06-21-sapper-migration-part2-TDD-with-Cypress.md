---
title: migrating to Sapper part 2 - TDD with Cypress.io
date: 2019-06-21T20:00:00
description: part 2 of my series on describing how I migrated from a GatsbyJS/React blog to Sapper/Svelte. This one is about non-regression testing and test-driven development with End-to-End browser tests using Cypress.io
published: true
lang: en
keywords: Sapper, Svelte, Cypress.io, Cypress, End to end, unit test, tdd, ut, test driven, tst, dirven, test first, non regression testing, non regression, e2e, automation, ci, continuous, integration, continuous integration, cipres, cipress, cypres, sypress, sypres, sipres, sipress, saper, sevlte, sevtle, svetle, sappr, sapr
slug: 2019/06/21
thumb: https://source.unsplash.com/T8nwEwiM90k/600x400
---

Today, we will look into how I migrated from the previous GatsbyJS/React blog stack to the new Sapper/Svelte one.
It will be the perfect time for me to talk about *Test Driven Development* (TDD).

This article is part of a series of posts about migrating from GatsbyJS/React to Sapper/Svelte. You can check the other posts: [part 1](/2019/06/16), [part 3](/2019/06/29), [part 2 bis](/2019/06/30), and more to come!

![colorful trees at night by @winstonchen, unsplash](https://source.unsplash.com/l7y4Z8s1sNk/600x400)

## Test Driven Development

So, what is *TDD*?

It is the process of writing tests first, before your code.

- <span style="color:red">this test will fail (RED)</span>
- <span style="color:green">write only the code needed to make it succeed (GREEN)</span>
- <span style="color:blue">then look at all the tests and the all the code, and refactor.</span>

Of course, refactoring does not introduce new features, it is merely moving things around, renaming variables, methods, functions, classes to make them more readable, etc.

Red-Green-Refactor: It's like a mini-quest with a small mission. It is addictive in its nature.

Also, it is a discipline that forces you to not write unneeded code. And if you think about testing first, your code will be tested and designed to be tested.

It is a discipline and a practice, I recommend you to find a mentor to learn it faster.

If you want some solid (SOLID 😜) book ideas, go read **Test Driven Development: By Example by Kent Beck**.

...And I'm not a real master, merely trying to follow this discipline. Next, we'll see how I tried to.

## non-regression testing

My aim with non-regression tests would be to ensure the new blog would be as good as the old one, feature-wise.

Well, it is not really TDD, it is a little bit different. You see, I had not written tests first because I used a template for the first blog. My tests were not automated, they were me checking how it works by opening the browser and clicking and looking around.

For the next iteration of the blog, I would need to do this manual testing and I thought that I could automate things to shave a few hours of manually verifying features.

So the process was:

- I have an existing website. I suppose it is 100% working.
- I create a test expressing its features after the fact (non-regression or retro-testing)
- I iterate until this test is green on the existing website.
- then I run the exact same test on the new website, it turns red.
- I then iterate by adding code to make it pass (green).
- I refactor the tests and the code.

So as you see, the last part is test-driven. The first part is the exact opposite. But the whole process enabled me to quickly reproduce the existing features I wrote as tests into the new website.

![trees with fog from below by @randytarampi, unsplash](https://source.unsplash.com/T8nwEwiM90k/600x400)

## Writing tests with Cypress

As you've seen, for each of my previous blog features, I added a [Cypress.io](https://www.cypress.io/) test!

If you don't know Cypress.io, go check it.

It's an awesome end-to-end (a.k.a. "E2E") testing solution.

The user experience is really great, and the tool is fast!

Writing tests is also really simple compared to other E2E tools.

*NOTE: I am not affiliated with them in any way.*

## What came before: 💩

[WebDriver](https://www.seleniumhq.org/projects/webdriver) or [Selenium](https://www.seleniumhq.org/) (they are both more or less the same thing), [Appium (WebDriver based for mobile)](http://appium.io/), [Protractor(Angular tooling over Appium over WebDriver.. you get it)](https://www.protractortest.org/): you have failed to be reliable and simple to me.

Why? The moment you see a tool abstracting a tool abstracting a tool abstracting user interaction, you know you will have a hard time identifying issues when something breaks in one of those layers...even more, when they are asynchronous.

## What Cypress fixes

Now Cypress tests are:

- fast to execute,
- simple to write,
- easy to debug with good developer tooling,
- quick to add to you Continuous integration pipeline,
- and reliable.

So I wrote Cypress E2E tests as a non-regression layer, expressing "business" rules about blog features that would be green on the older blog, and red on the new one.

You can check them [on the GitHub repository in `/cypress/integration`](https://github.com/doppelganger9/blog/tree/master/cypress/integration).

Here is a sample log of the output (edited to shorten it):

```bash
 npm run cy:run
> cypress run
====================================================================================================
  (Run Starting)
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:    3.3.1                                                                              │
  │ Browser:    Electron 61 (headless)                                                             │
  │ Specs:      6 found (404.js, article-footer.js, blog-post.js, footer.js, home.js, privacy-pol… │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running: 404.js...                                                                       (1 of 6) 
  The 404 page
    ✓ should show up for unknown URLs (2586ms)
    ✓ should show have a TUMBLR TARDIS lost in space GIF (152ms)
    ✓ should have the "built with" footer (95ms)
    ✓ should have the "David's Blog" Title Bar (306ms)
    ✓ should have a back link to home (216ms)
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running: article-footer.js...                                                            (2 of 6) 
  The "Article Footer"
    ✓ has David's name in it (740ms)
    ✓ has a link to Senlis Wikipedia page (187ms)
    ✓ has a link to David's Twitter profile page (188ms)
    ✓ has a link to David's GitHub profile page (181ms)
    ✓ has a link to David's Codepen profile page (147ms)
    ✓ has a link to David's DEV profile page (216ms)
    ✓ has a link to David's LinkedIn profile page (276ms)
    ✓ has a link to StackOverflow profile page (210ms)
    ✓ has a link to David's GitLab profile page (204ms)
    ✓ has a link to David's Facebook profile page (154ms)
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running: blog-post.js...                                                                 (3 of 6) 
  a blog post
    ✓ should show the title bar in h3 (2123ms)
    ✓ should have a back link to blog post list/home (333ms)
    ✓ should show the published date in the first <p> following the <h1> article title (309ms)
    ✓ should show the time to read in a second <p> following the <h1> article title (349ms)
    ✓ should show the "written by" footer (293ms)
    ✓ should show the "built with" footer (254ms)
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running: footer.js...                                                                    (4 of 6) 
  has a footer
    ✓ shows a copyright year (650ms)
    ✓ shows a link to Svelte (272ms)
    ✓ shows a link to Sapper (149ms)
    ✓ shows a link to Privacy Policy (162ms)
    ✓ can link to Privacy Policy (266ms)
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running: home.js...                                                                      (5 of 6) 
  David's Blog app
    ✓ has the correct <h1> (655ms)
    ✓ show blog posts list as home with at least 4 posts (287ms)
    ✓ shows the Article Footer (189ms)
    ✓ shows the built with footer (203ms)
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running: privacy-policy.js...                                                            (6 of 6) 
  Privacy Policy page
    ✓ should have the proper title (732ms)
    ✓ should have the cookie monster gif (167ms)
    ✓ should have a maitlo link (154ms)
    ✓ should have a back link (177ms)
    ✓ should show the Article Footer (556ms)
    ✓ should show Built-by footer (801ms)
====================================================================================================
  (Run Finished)
      Spec                                                Tests  Passing  Failing  Pending  Skipped 
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔ 404.js                                    00:03        5        5        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔ article-footer.js                         00:02       10       10        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔ blog-post.js                              00:03        6        6        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔ footer.js                                 00:01        5        5        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔ home.js                                   00:01        4        4        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔ privacy-policy.js                         00:02        6        6        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    All specs passed!                           00:15       36       36        -        -        -  
```

As you see the tests are like an executable specification of the expected features of my blog.

And this specification can be checked by executing the tests.

![landscape with cypress trees by Chris Barbalis @cbarbalis, unsplash](https://source.unsplash.com/dyVHwbWcu6g/600x400)

## Sample test

I will not go too far into details, I urge you to go check [Cypress.io Get Started](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements) and [Writing your first test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html).

There will be a sample test below, though what I will share is something I found useful during my process of targeting one dev server and the other.

## Targeting old or new website

There is one thing that I will detail, it is using an environment var so that I could quickly target either the old blog or the new one.

I used the following Cypress config file:

`cypress.json` file:

```json
{
  "baseUrl": "http://localhost:3000",
  "video": false,
  "env": {
    "BLOG_JAMSTACK": "sapper"
  }
}
```

Which can later be used in JavaScript files to reference environment variables with (sample from `cypress/common.js`):

```js
const configuredJamStack = Cypress.env('BLOG_JAMSTACK');
```

So the value will be the one from the `BLOG_JAMSTACK` environment variable. As Cypress picks up the `cypress.json` file above, its default value will be `sapper`.

On the terminal, I created and ran two different **NPM Run Scripts**, defined in `package.json`:

```json
"scripts": {
  ...
  "cy:open": "cypress open",
  "cy:open-legacy": "cypress open --config baseUrl=http://localhost:8000 --env BLOG_JAMSTACK=gatsby",
  ...
}
```

The first one `npm run cy:open`, would use the `cypress.json` file above and thus target Sapper (new blog).
The second one `npm run cy:open-legacy` would target the Gatsby version (old blog) that can even run concurrently on another port (dev mode).

In tests I can then use variables that depend on the target website, like this:

```js
import { mainFrameworkName, mainFrameworkURL } from '../common';

describe('has a footer', () => { // main section = website component or feature
  beforeEach(() => {
    cy.visit('/') // tells Cypress to go to the root URL each time it starts a test in this describe section.
  });

  it('shows a copyright year', () => {
    cy.get('footer') // we select the <footer> tag
      .should('contain', new Date().getFullYear()) // the current year (dynamic)
  });

  it('shows a link to ' + mainFrameworkName, () => {
    cy.get('footer')
      .get(`a[href*='${mainFrameworkURL}']`) // here we use the mainFrameworkURL from common.js which depends on target website (Gatsby or Sapper urls)
      .should('contain', mainFrameworkName)
  });

  it('can link to Privacy Policy', () => {
    cy.get('footer')
      .get(`a[href*='privacy-policy']`)
      .click() // we also check navigation by clicking here to see if some links does indeed redirect to an expected URL.
    cy.location('pathname').should('contain', '/privacy-policy')
    cy.get('h1').should('contain', 'Privacy Policy')
  });

});
```

[Go check in the repository](https://github.com/doppelganger9/blog/) the full code for more details or examples.

## The tooling

Here are what you can see when you run the `cypress open commands`, which will help you see and pinpoint what happened and how to improve or write selectors and test them inside the context of the browser.

You start with all your tests in a list:

![Cypress all the tests](/cypress-tests.png)

You can run a test collection and see them unfold to the right pane:

![Cypress test details](/cypress-test-detail.png)

You can check each instructions' effects on the browser, going back each step to visually see what happened:

![Cypress test step details](/cypress-test-step-detail.png)

Using it to test CSS selectors for your `cy.get('...')` instructions:

![Cypress CSS Selector](/cypress-selector.png)

## Conclusion

> In this second installment about how I migrated my previous blog from GatsbyJS/React to Sapper/Svelte, we have talked about TDD, non-regression testing, End to End tests and Cypress.io
>
> It was less funky than my previous post, lacking emojis, animated GIFs and pictures of 💩 from my kids, but I hope it was still enjoyable!
>
> If you have any questions about TDD, Cypress, Svelte, Sapper, or just want to say hi or thank you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!


Photo credit from [Unsplash](https://unsplash.com) by @winstonchen, @cbarbalis, @randytarampi.
