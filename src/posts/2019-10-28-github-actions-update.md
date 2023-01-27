---
title: Github Actions [Update]!
date: 2019-10-28T21:45:00
published: true
description: A post about migrating from the HCL to the YAML Github Actions workflow syntax.
tags: CI/CD, GitHub Actions, Netlify, git
lang: en
category: Dev
keywords: pipeline, build, automation, continuous integration, continuous deployment, github actions, github, netlify, git, ci/cd, github actions workflow, git push, git amend, github pages, hcl, yaml
slug: 2019/10/28
thumb: https://lacourt.dev/ghactions-update-cyrunning.jpg
---

*NOTE: Thanks [@HugoGresse](https://twitter.com/HugoGresse) for giving feedback on my first post, it eventually led to this one! I owe you one 🍻*

Well, since September 2019, the old Github Actions Workflow HCL syntax is not relevant anymore, so [my previous blog post is deprecated](/2019/03/06).

Here is how I migrated to the new richer YAML syntax.

## HCL to YAML

[There is documentation available](https://help.github.com/en/github/automating-your-workflow-with-github-actions/about-github-actions#migrating-github-actions-from-hcl-to-yaml-syntax). 

This is the current workflow for this blog:

```hcl
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

I created a new workflow directly from the Actions tab on Github. Things are even more easy than before, I choose a NodeJS starter workflow and adapted it to match my previous workflow.

Secrets are still accessible. Remember? they are defined in your *Settings* / *Secrets* section. You can then inject them in your Environment variables, f.ex.: `${{ secrets.API_KEY }}`.

It seems the Cypress action does not work anymore so I just used the default one.

Let's see if it'll work...

The new file will be:

```yaml
name: Node CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [8.x, 10.x, 12.x]

    steps:
    - uses: actions/checkout@v1
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: npm install, build, and test
      run: |
        npm ci
        npm run build --if-present
        npm test
      env:
        CI: true
    - name: Send Push Notification
      uses: techulus/push-github-action@master
      env:
        MESSAGE: "https://lacourt.dev/ updated by Github Actions pipeline!"
        API_KEY: ${{ secrets.API_KEY }}
```

I just pushed this on a Pull Request.

## Results

Wow, nice, now there are checks in the Pull Request:

![checks in the Pull Request](/ghactions-update-pr-checks.jpg)

And you can see in a dedicated *Checks* tab:

![Checks tab](/ghactions-update-checks-tab.jpg)

Now, it is running...

![Cypress tests running](/ghactions-update-cyrunning.jpg)

And, luckily, everything went green! No more need for a dedicated Cypress action, it works out of the box!

![Cypress tests green](/ghactions-update-cyrunok.jpg)

## Conclusion

This migration was quick!

> In this post we've seen quickly how I migrated my old workflow to the new Github YAML format.
>
> It was a short post because it was really easy to implement. I hope you found it interesting!
>
> If you have any questions or feedback, or just want to say hi or thank you, [my DMs are open on Twitter](https://twitter.com/doppelganger9)!
