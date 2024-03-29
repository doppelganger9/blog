---
title: migrating to Sapper part 2 bis - Netlify, GitHub Actions with Cypress.io
date: 2019-06-30T09:30:00
description: Going back to part 2 to add more depth to a tweet I made about using a GitHub Action to automate Cypress.io tests. And Netlify.
published: true
lang: en
category: Dev
keywords: Sapper, Svelte, Cypress.io, Cypress, Cyrpress,Cyrpess, End to end, unit test, tdd, ut, test driven, tst, dirven, test first, non regression testing, non regression, e2e, automation, ci, continuous, integration, continuous integration, cipres, cipress, cypres, sypress, sypres, sipres, sipress, saper, sevlte, sevtle, svetle, sappr, sapr, raect, gatsby, gabtsy, gastby, gabtsyjs, gastbyjs, Github, actions, workflow, pipeline, ci, cd, ci/cd, continuous testing, worflow, wokflow, worklflow, wokrflow
slug: 2019/06/30
thumb: https://lacourt.dev/WorkflowVisualOverviewWithCypressE2E.png
---

<script>
  import AddTwitterWidgetScript from '$lib/components/AddTwitterWidgetScript.svelte';
</script>

<AddTwitterWidgetScript />

This article is part of a series of posts about migrating from GatsbyJS/React to Sapper/Svelte. You can check the other posts: [part 1](/2019/06/16), [part 2](/2019/06/21), [part 3](/2019/06/29), and more to come!

> Hey there! This is a little interlude. I totally forgot in **part 2** to tell you about how I automated **Cypress.io** End-to-End tests within my Github Actions workflow, as part of my blog's *Continuous Integration* pipeline!

## I Promised

Y'all asked for this on twitter:

https://twitter.com/doppelganger9/status/1140384297813254144

So I will try to give more details below.

## before Cypress

I already in the past tried to do this kind of automation with Selenium, Appium, Protractor ([you know how I love those, right... NOT](/2019/06/21)) and tried too much time to make them work, somehow succeeding but it was very fragile and would break for some reasons every few days.

So we abandoned it.

Yeah, writing E2E tests were not only complicated and time costly, but also the Continuous Integration did not work.

Now, of course, Cypress.io fixed all of this.

They're the best -- Except they don't pay me to say this 🤪 ... well, they totally sent me swag since then, so they are **the bestest**!

## GitHub Actions Workflow

If you want more basic details about the GitHub Actions Workflow, take a look at [this previous post](/2019/03/06) explaining the core workflow when I first created this blog.

Of course, since then, the workflow has evolved, and now it looks like this:

![Workflow visual overview with Cypress.io E2E testing](/WorkflowVisualOverviewWithCypressE2E.png)

Here are the `main.workflow` file contents:

```text
workflow "Build, and Test on push" {
  on = "push"
  resolves = [
    "Send Push Notification",
    "Build Blog",
    "Cypress E2E Tests"
  ]
}

action "Clean Install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "Build Blog" {
  uses = "actions/npm@master"
  needs = ["Clean Install"]
  args = "run build"
}

action "Cypress E2E Tests" {
  uses = "bartlett705/npm-cy@master"
  needs = ["Clean Install"]
  args = "test"
}

action "Send Push Notification" {
  uses = "techulus/push-github-action@master"
  secrets = ["API_KEY"]
  needs = ["Build Blog"]
  env = {
    MESSAGE = "https://lacourt.dev/ updated by Github Actions pipeline!"
  }
}
```

## Wait! No deploy step?

As you can see, I removed some steps as I migrated from **GitHub Pages** to **Netlify** to publish & host my blog.

I [already talked briefly about it](/2019/03/06#removing-gh-page-and-reconfigure-all-the-things), but let's recap:

Compared to [GitHub Pages](https://pages.github.com/), I prefer [Netlify](https://www.netlify.com) because:

- it provides **HTTPS for free** with SSL/TLS certificates from [Let's Encrypt](https://letsencrypt.org/),
- I can **freely use my custom domain** "lacourt.dev",
- it takes care of **automatically publishing the master branch on each push** by connecting directly to GitHub, that's why I removed this step from my GitHub Actions Workflow above!
- The **"Deploy Previews"** feature enables publishing a temporary website linked to a Pull Request, which is great to check what a Pull-Request will make the blog look like!
- it has also other features that I did not enable in fear of "bill overflow" (like stack overflow but from billing...).

## The Cypress.io E2E Test Action

So I merely added this action:

![Cypress E2E step editing](/CypressE2EStepEditing.png)

![Cypress GitHub Action Configuration](/CypressGitHubActionConfig.png)

Frankly, I'm a command line guy, this time I just edited the `main.workflow` file to add text to it. Okay, it did not work out so well, as I had to `git commit --amend` and `push --force` to make it work because I had forgotten to had the step name in the `resolves` array.

```text
action "Cypress E2E Tests" {
  uses = "bartlett705/npm-cy@master"
  needs = ["Clean Install"]
  args = "test"
}
```

which references the Action `bartlett705/npm-cy`, for which you can check the [GitHub Repository](https://github.com/bartlett705/npm-cy), with a README full of instructions if you want to know more about how to use this Action.

## package.json test run script

Of course, my `package.json` has an npm script named `test`, that runs in parallel `npm run dev` (the dev server) and `npm run cy:run` the Cypress.io integration tests:

```json
"scripts": {
  ...
  "test": "run-p --race dev cy:run"
  ...
}
```

By the way, this script is provided by the **Sapper template**, I just reused it!

## Fast?

In my original tweet, I said the E2E step was fast, 1:31 for 36 tests.

I think you deserve an explanation because I might have said it too quickly.

The real gist of the tests as reported in the cypress logs took 42 seconds in this latest sample:

![Did Cypress run in 3 minutes or 42 seconds?](/cypress-run-3min-or-42seconds.png)

And we also see that the step took all in all 3 minutes and 13 seconds to complete.

This is confirmed in the GitHub Action UI:

![Cypress E2E Test step took 3 minutes](/cypress-github-action-3min.png)

Here is some details on the time spent:

- 19:40:14Z: action starts
- pulling docker image, building it, gcr.io/github-actions-images/action-runner:latest
- then it runs `npm run test` inside the docker image
- it is the first time Cypress runs, so it verifies it can run
- 19:41:33: verifying cypress can run
- then it starts cypress client, server, service worker: it takes ~ 16 seconds
- then it starts the test runner
- it ends 46 seconds laters
- 19:43:18Z : the action stops with success.

Now you know what happened between the 42 seconds and 3 minutes: Docker image pulling by GitHub actions, verifying and launching Cypress.

Still 3 minutes feels pretty fast to me.

## Conclusion

> Today we saw just one little step to make Cypress.io run on a GitHub Actions Workflow. It just works out of the box.
>
> I also explained why I chose Netlify over GitHub Pages to deploy this blog.
>
> I hope it will help you set up this in your own Workflow!
> If I can be of any help, or If you have any questions about Cypress, Svelte, Sapper, GitHub Actions, or just want to say hi or thank you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!
