---
title: Netlify CMS with Sapper export
date: 2019-07-05T22:00:00
description: >-
  A dedicated post to explore adding a CMS from Netlify called "Netlify CMS".
  The idea is to provide a simpler way to contribute to this blog while still relying on git, GitHub, CI/CD and SSG Static Site Generator via `sapper export`.
published: true
lang: 'en'
keywords: [Sapper, Svelte, GatsbyJS, React, raect, gatsby, gabtsy, gastby, gabtsyjs, gastbyjs, sevlte, saper, sappr, cms, content management system, netlify, netfily, neltify]
slug: "2019/07/05"
thumb: "https://source.unsplash.com/o4-YyGi5JBc/600x400"
---

## Raw logs

- I started looking at https://www.netlifycms.org/
- I tried the video because it is easier to explain things to me at 22:13 in the evening I don't want to read...
- Git Gateway
- clicked "Get Started"
- I did not search for Sapper... **TODO** and fill a PR to [add it to the documentation](https://github.com/netlify/netlify-cms/blob/master/CONTRIBUTING.md#pull-requests)

I need to create an `admin` directory with two files in it:
`index.html` and `config.yml`.

This directory needs to be in a directory where **Sapper** stores static files. So I can put it in `/static` or I could generate it with routes? we'll see later if that has any value. 
**TODO**

So the website will have a `/admin` route, so maybe I need to put it inside `/src/routes/admin`.

Cypress test:
- route `/admin` should return HTTP 200, and contain 'netlify-cms' inside a script src tag.

I added the tests, they were RED.
Then I added the `index.html` file with correct content and the tests went green.

I added some tests to specify the `static/uploads` directory.

The next part will be tricky to spec: the collection part in the `config.yml` is highly correlated to my frontmatter usage.

I had to look at the widget docs:

- ✅ my "date" has a specific format: YYYY-MM-DDTHH:mm:ss
- ✅ my strings are not enclosed in double quotes
- my "description" field could benefit from a limit of 200 characters...

All this because of the `marked` library.

I changed the `_posts.js` markdown processing function to handle starting and ending quotes inside the string frontmatter values.

Also, the Netlify CMS was loading the `config.yml` from the root path, not `/admin` so I had to move it inside `static/` from `static/admin/`

Now it works!

Next step: authentication!

I don't want Netlify Authentication (because it can lead to costs), I will restrict to my GitHub account.

Now it works, I authenticated with my GitHub account and I can see the content interface

There is a preview button, an auto-scroll for preview content.

The image widget does not work, I'll need to look at its configuration further.

![screenshot before saving](netlify-cms-test-article.png)

What happens when you hit "save"?

I tried uploading an image. It worked?

Yes, it generated a commit `Upload /static/uploads/...` on my `master` branch!

![screenshot of commit in github](netlify-cms-commit-uploaded-image.png)

so it works, indeed, it was showing an empty `/static/uploads` directory.

Now I can see it contains an image:

![image widget showing uploaded image](netlify-cms-images-widget-UI.png)

When saving or uploading, there is a small blue line showing that it is working...

## Workflow

Now my post is in the Draft state.

![Netlify UI for content workflow](netlify-cms-workflow-UI.png)

Looking inside GitHub shows a new branch named `cms/2019-06-29-testing-netlify-cms` which is the name of the post I created.

![new branch](netlify-cms-saved-new-branch.png)

![Screenshot of new cms branch with new commit](netlify-cms-saved-new-branch-with-commit.png)

You can also see another commit representing the saved new draft article: `Create Blog "2019-06-29-testing-netlify-cms"`.

And the associated Pull-Request:

![PR for draft article](netlify-cms-saved-new-pr.png)

Then I can go back to the draft page and click on "preview".
Netlify built a temporary website where I can peek at the future result. And thanks to this, I'm able to see that the new post is not correctly integrated:

![errored date and description in list](netlify-cms-saved-preview-list.png)

Also an error when opening the blog post:

![error date in blog post](netlify-cms-saved-preview-post.png)

So as you can see, the date and description were not correctly interpreted, so let's see the commited data:

![commit contents](netlify-cms-saved-commit-contents.png)

https://github.com/doppelganger9/blog/commit/907745eec94866768d88582581194b2e43a568c1

we see a few issues:

- the date contains simple quotes
- the description is multi-line which breaks the simple JS code processing the frontmatter in `_posts.js`
- the thumb is missing the full URL (it is relative)
- keywords have simple quotes too

Maybe I need a lib to handle the YAML in the frontmatter...

like js-yaml

It kinda works... except for the multiline description. And I would have to migrate again all contents to put back Arrays `[a,b,c]` for keywords, etc.
