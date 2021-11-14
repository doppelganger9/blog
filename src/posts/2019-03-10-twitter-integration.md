---
title: Setting up Twitter integration
date: 2019-03-10T22:30:03
published: true
description: A post about how I added Twitter integration, based from a vague memory of an old tweet.
tags: Twitter, Gatsby
lang: en
keywords: twitter, gastby, gatsbyjs, integration, gatsby-remark-twitter, gatsby-source-twitter
slug: 2019/03/10
---
<script>
  import AddTwitterWidgetScript from '$lib/components/AddTwitterWidgetScript.svelte';
</script>

<AddTwitterWidgetScript />

## Remembering things

One day, in a tweet, I said "For future recall, here is.." and... I don't remember what I wanted to remember nor why 🤷‍♂️🤦‍♂️.

But I do recall **@Patric2k** saying:
> "are you sure this is the right medium to recall things? Maybe you should start a blog on March the 5th of 2019".

Such [selective memory and history rewriting](/future/bias-of-using-too-much-biases)!

Let me try to search Twitter for that tweet... wow, that was quicker than I thought: 3 minutes later only!

<blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">So, do you expect to find it here first next time you search? 😀</p>&mdash; Patrick Decat (@patric2k) <a href="https://twitter.com/patric2k/status/1000078979209056256?ref_src=twsrc%5Etfw">25 mai 2018</a></blockquote>

My memories were indeed deeply flawed!

## 💡Twitter interaction

Anyway, in this post, I just want to explain how I went from an idea about integrating twitter in this blog, to what you can see right now live, because I already pushed to master.
The idea was that I wanted to fetch my twitter timeline and use the mighty powers of *GraphQL* in order to inject it here somewhere in this blog, for you to see, and for me to expand upon because 280 characters are not enough, and I really think some old tweet could be the start of some weird & useful content.

## Gatsby Plugins

### embedding Twitter cards

So, *of course*, **there is a Gatsby plugin for that** -- quick, click ⭐️star repo! done? go on:

https://github.com/weknowinc/gatsby-remark-twitter

This is the one I used on this page -- remember I like ["mise en abyme"](https://en.wikipedia.org/wiki/Mise_en_abyme) too much -- to style the tweeter card above 👆.

### Twitter Search API

This is just part of the solution, I need a more capable plugin that goes deeper into Twitter data and APIs... Maybe this one:

https://www.gatsbyjs.org/packages/gatsby-source-twitter/

I followed the plugin's instructions to get started: I created a developer Account on Twitter, explaining how and why I want to use their API.
I read all the license, yes, I did. I'm one of those people 🕵️‍♂️. Besides, I work in an insurance company 🧐so I know that there might be some interesting stuff hidden in the small long boring legal text.

I then created a Twitter Application for this blog. Damn "David's blog" is already taken as a name... 🤦‍♂️ so "lacourt.dev" will it be!

So now I can install & configure the plugin and begin playing with it to see what are the possibilities.

... it looked promising, but it relies on the *Twitter Search API* which in itself is *limited to 7 days of history*. So I won't be able to list all my tweets.

## Twitter Embedded Timeline

Let's try to include an *embedded Timeline*, it will be sufficient for starters.
I went to https://publish.twitter.com and copy-pasted the code in a new JS page. This feels dirty and hacky, but let's see if it works before cleaning it up.

### React errors

Being new to React ⚛︎ means I do all the basic errors. Fortunately, the framework and developer tooling give you understandable and actionable errors.

> Warning: Invalid DOM property `class`. Did you mean `className`?
> Warning: Invalid DOM property `charset`. Did you mean `charSet`?

For example, having copy-pasted the twitter embed timeline code results in an error because in JSX, "class" must be replaced by "className". JSX is based on XML and is just sugar to avoid typing a lot of boilerplate code in JavaScript. So "class" is a reserved word in JS, which explains why in JSX we have to use className instead.

What I do not really understand is:
if the tooling is capable of telling me I should write `className` instead of `class` or `charSet` instead of `charset`, why doesn't it accept it in the first place?
➡️*If you are a React ⚛️ expert, please enlighten me!*

## Twitter Widget JS

I found an article which explains how to do this better:
https://www.stevenmercatante.com/how-to-add-twitter-buttons-to-a-gatsby-site/

I need to [include at only one place the Twitter Widget](https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites).

## Refactorings

All in all, it worked. But then, looking at this page, a tiny voice in my head said **"You don't need this page, linking to your Twitter profile page is sufficient and even better. No code = no maintenance, no bugs"**.

So I did not push this page 🤷‍♂️, you won't be able to see it. Well, you could see [the commit in the Pull Request on GitHub before I push-forced them](https://github.com/doppelganger9/blog/commit/b7af093350cbc4a880584c1307626ab0aba863f0) out of the final merge.

Yes, being an engineer means you sometimes need to try things and scratch it all and throw it away. You'll always learn some things along the way so time was not wasted. The functionality is here. I even added share/follow buttons (see below 👇). My business requirement voice is happy, my maintainer side also.

## One more thing

After pushing these changes to production, I noticed that the links did not change to buttons without a forced reload of the browser.

Surely, I remembered the part I has skipped over about `componentDidMount` -- my short term memory seems OK

```javascript
 componentDidMount() {
    if (window.twttr) {
      if (typeof window.twttr.widgets !== 'undefined') {
        window.twttr.widgets.load()
      }
    }
  }
```

I don't quite understand why this works yet, but eventually, I will.

## Conclusion

As always, I learned a ton on the way and ended up with a simpler solution to my initial functional requirement.

I hope you too learned a few things or at least witnessed how I bump against issues and go on 🤣.

> Thanks for reading this blog, If you have any questions, please use the Github Repository's Issues to start a conversation, or use Twitter: my DMs are open.

👋
