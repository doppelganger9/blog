---
title: Here is a HUEseless side-project
date: "2019-03-26T22:00:00.000Z"
published: true
description: Here is my silly side-project as a geek dad with kids playing with their lights instead of sleeping.
tags: [ "NodeJS", "PhilipsHUE", "Google Home", "Side-project" ]
lang: en
---

![Like this one from ThinkGeek](https://www.thinkgeek.com/images/products/zoom/ivlq_useless_light_switch.gif)
(This is a physical one from [ThinkGeek](https://www.thinkgeek.com/product/ivlq/) *(not an affiliate link)*)

In this post, I will recount how I made a silly side-project playing with the [Philips HUE APIs](https://developers.meethue.com/develop/), NodeJS, Google Home, RaspberryPi Zero W, and my kids.

I made a tweet about this some time ago, and today I'd like to elaborate a little on the subject:

https://twitter.com/doppelganger9/status/1102260938810540037

## My genius evil plan

The story is:

In 2016, I installed a Philips HUE lightbulb in my kids' bedroom.
Unfortunately, the room switch turns it off, and when turned back on, the HUE lightbulb goes back to white and 100% intensity. So the kids quickly learned that If I turn off the lights remotely with an app or Google Home, they simply need to play with the room switch off then on and they "win".

So, as soon as I closed their door when time to sleep has had come, they would get up and turn it back on!

A war of turning on & off lights ensued.

<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/3ohzdFHDBEG32PmWJO" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/animation-cute-illustration-3ohzdFHDBEG32PmWJO">via GIPHY</a></p>

As a geek dad, I wanted to automate this into an evil AI, so that I can laugh madly while petting my cat, *mwahahahahah*!

<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/MgwVy8YxMqJ56" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/mrw-MgwVy8YxMqJ56">via GIPHY</a></p>

## Gitlab Repository

As a gift, here is a link to the repository where you'll find more details:
https://gitlab.com/davidlacourt/hueseless

### How does it work?

#### NodeJS

For this quick script thing of a project, I prefer JavaScript and NodeJS.
For once, I did not write tests, because my kids tested it for me directly on production.

#### PhillipsHUE

The APIs are really easy to "HUE"-se.

<div style="width:100%;height:0;padding-bottom:53%;position:relative;"><iframe src="https://giphy.com/embed/qs6ev2pm8g9dS" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/austin-powers-dr-evil-air-quotes-qs6ev2pm8g9dS">via GIPHY</a></p>

Just read the documentation and follow the tutorial, I did not meet any obstacle on the way. So I could hack an evil "AI" really quickly.

#### Evil AI (= 2 "IF"s)

Here is the evil AI pseudo-code:

```
IF you get data from API
   IF the light is on
   THEN turn it off
```

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/xl5QdxfNonh3q" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/mike-korea-north-xl5QdxfNonh3q">via GIPHY</a></p>

#### Google Home

Just for the fun of it, I added voice to my script, so that instead of using `console.log` I would hear messages from it.
When starting, it would say:

> Light status monitoring enabled!

or when turning off the lights:

> I turned off the lights.

I used [node-googlehome](https://www.npmjs.com/package/node-googlehome) repository/NPM library but had to tweak it a little to make it work, and ended up opening a PR.

#### RaspberryPi Zero W

The RaspberryPi Zero W is a mini version of the RaspberryPi which is already a really small computer.

<div style="width:100%;height:0;padding-bottom:41%;position:relative;"><iframe src="https://giphy.com/embed/8Q62oGruZu0BG" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/mini-8Q62oGruZu0BG">via GIPHY</a></p>

Once installed and built, I deployed this project on the RPi0W, which was really slow to `npm install` all the libs, but 10 minutes later, I could run the main loop.

I even added an auto-start to the Raspberry, which made it so that when powering up, it would automatically start my NodeJS script.
Really nice!

For more details, I just followed [this Medium article](https://medium.com/@andrew.nease.code/set-up-a-self-booting-node-js-eb56ebd05549).

## Results

<div style="width:100%;height:0;padding-bottom:83%;position:relative;"><iframe src="https://giphy.com/embed/l3vR6aasfs0Ae3qdG" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/80s-hannibal-the-a-team-l3vR6aasfs0Ae3qdG">via GIPHY</a></p>

Well, it worked perfectly.

Except kids learn more quickly than my evil "AI"!

They learned that switching on/off a few dozen times made my code break. And even, instead of simply putting the lights on, for them it became a new
game!

<div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/2iBsieTJ3eO1q" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/reaction-puns-pun-2iBsieTJ3eO1q">via GIPHY</a></p>

So I ended the experiment there.

Now they go to sleep without any need to have a light so I can say it's over.

🤷‍♂️

## Conclusion

In this short post, I wanted to show you a silly side-project mixing Google Home, NodeJS, Philips HUE, running on a RaspberryPI and evil AI in order to battle my smart kids. The result is working but they still outsmarted the whole contraption 🤣!

Anyway, I learned some things on the way.

I hope you too learned a few things or at least piqued your curiosity.

> Thanks for reading this blog, If you have any questions, please use the [Github Repository's Issues](https://github.com/doppelganger9/blog/issues) to start a conversation, or use [Twitter: my DMs are open](https://twitter.com/doppelganger9).

👋
