---
title: Using reveal-md to create technical presentations
date: "2019-03-12T20:30:03.284Z"
published: true
description: "A post about how I discovered and now use reveal-md to create engaging technical presentations."
tags: [ "reveal-md", "technical presentations", "tools", "pdf", "static website" ]
---

*This post is a departure from [the](/2019/03/06/) [previous](/2019/03/07/) [ones](/2019/03/10/) as it is describing a tool unrelated to the construction of this blog.*
*But please, read on, as it might be useful if you're in search of a developer tool to create quality technical presentations.*

## An unprepared presentation

2 years ago, I went to an international event for my company and heard that I was supposed to present some slides about technical updates concerning our team's project.
Except... I did not have prepared anything.

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/NTur7XlVDUdqM" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/trump-consequences-NTur7XlVDUdqM">via GIPHY</a></p>

So I bet on a cool tool I had previously tried out of a professional context: ✨*reveal-md*✨.

It totally helped me **focus on the slides' content** using great presentation and animation defaults.
During the morning boring managers meeting, I managed (sic) to put up a nice set of slides with code samples, emojis, images. On the plus side, it kept me awake 🤣, or else I would have fallen asleep! 2 hours later I said "Sure, I can show you my slides!" and I delivered a solid presentation given the constraints.

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/7F5RBG1GX8dP2" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/sweet-7F5RBG1GX8dP2">via GIPHY</a></p>

Since that time, all my presentations are made with *reveal-md*:
- I can *quickly* write in Markdown using any text editor
- I can animate with fragments
- I can embed GIFs, videos, images
- I can embed code snippets
- I can embed HTML, like real code or IFRAME showing live running examples
- ...and I can use emojis

On that last point, *and that will be the focus of [another post](/2019/03/14/)*, I had an issue as emoji support depends on the OS and browser. So, when I exported to PDF, the emojis were broken, and the same thing for my Windows 7 co-workers.

## What is *reveal-md*?

[Reveal-md](https://github.com/webpro/reveal-md) tagline is:
> reveal.js on steroids! Get beautiful reveal.js presentations from any Markdown file

#### Damn, what is reveal.js?

Just [experience it yourself](https://revealjs.com) to feel it better than reading about it 😎

Have you clicked the link above? No? [click it](https://revealjs.com). Navigate the slides. How smooth.

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/5xtDarqlsEW6F7F14Fq" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/editingandlayout-smile-beach-drink-5xtDarqlsEW6F7F14Fq">via GIPHY</a></p>

So **reveal-md** is a special assembly of [RevealJS](https://github.com/hakimel/reveal.js) with lots of useful plugins, which is readily usable and expects usage of Markdown to create presentations, instead of HTML.

---

## Why I ❤️ it

Here is a non-exhaustive list of the things I found practical and easy to use to deliver impactful presentations with **reveal-md**:

1. 💙 fragments to slowly make pieces of a slide appear.
2. 💚 vertical and horizontal navigation
3. 💜 keyboard and mouse shortcuts
4. 💛 iframes, to embed live sites
5. 🧡 code snippets
6. ❤️ themes
7. 🖤 exporting to PDF
8. 💗 exporting to a static website

---

### 💙 fragments

To -- wait for it... -- **reveal** the content piece by piece, for example, if you want to avoid showing all your slide content in one go, you can use fragments:

```markdown
![My awesome image](lame_image.gif)
<!-- .element: class="fragment" -->
```

<div style="width:100%;height:0;padding-bottom:64%;position:relative;"><iframe src="https://giphy.com/embed/CV61LRKyQf6P6" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/love-sheldon-bazinga-CV61LRKyQf6P6">via GIPHY</a></p>

### 💚 Slide navigation

Slides left-right and up-down navigation with '---' or '----'

<div style="width:100%;height:0;padding-bottom:42%;position:relative;"><iframe src="https://giphy.com/embed/13ki5hgynlBaFy" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/nintendo-retro-13ki5hgynlBaFy">via GIPHY</a></p>

### 💜 useful shortcuts

There are some keyboard shortcuts, of which I particularly appreciate:
- _Overview mode_: "O" to see a birds-eye view of your presentation, "ESC" to return to the highlighted slide (you can quickly navigate with arrows)
- _Fullscreen_: "F", "ESC" to exit [fullscreen mode](https://github.com/hakimel/reveal.js#fullscreen-mode)
- _[Speaker mode](https://github.com/hakimel/reveal.js#speaker-notes)_: "S" it synchronizes 2 windows: one with the presentation, and another with a timer and all [speaker notes](https://github.com/webpro/reveal-md/#speaker-notes)!
- _Zoom-in_: `ALT+click` make the view zoom at the position of your mouse's pointer; very useful to look closely at a picture or chart surrounded by too much bullet points.

### 💛 iframes

I use embedded iframes to show other websites, like [caniuse.com](https://caniuse.com/):

```markdown
---

## Can I Use CORS?

<iframe frameborder="0" width="100%" height="500pt" src="https://caniuse.com/cors/embed/description&links"></iframe>

---
```

Want to make it even better?

<div style="width:100%;height:0;padding-bottom:73%;position:relative;"><iframe src="https://giphy.com/embed/AWv3UAFkgz39u" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/hoppip-how-i-met-your-mother-barney-stinson-AWv3UAFkgz39u">via GIPHY</a></p>

You can add lazy-loading to the iframe just by using `data-src` instead of `src`. This way *reveal*  will load the iframe's content only when you will show the slide during your presentation.

### 🧡 Code snippets

You can embed code snippets really easily with a block and the language:

````markdown
```javascript
console.log('great!');
```
````

or

````markdown
```java
System.out.println("never use System.out.println at home");
```
````

Sometimes, I have to add some styles for the code to be displayed nicely:

````markdown
```java
System.out.println("never use System.out.println at home");
```
<!-- .element: class="fragment" style="font-size: 0.30em !important;" -->
````

### ❤️ Themes

You can use a lot of different [built-in themes](https://github.com/hakimel/reveal.js#theming). See the link for the complete list;
I tend to use the **white** theme for my presentations.
But I can quickly switch theme at any time with the `--theme [theme]` command line option.

### 🖤 exporting to PDF

Exporting the PDF?

Yep, *reveal-md* can do that!

<div style="width:100%;height:0;padding-bottom:84%;position:relative;"><iframe src="https://giphy.com/embed/DgLsbUL7SG3kI" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/reaction-video-morty-DgLsbUL7SG3kI">via GIPHY</a></p>

I use these NPM scripts in the `package.json` of the presentation's repository:
```json
  ...
  "scripts": {
    ...
    "preexport:pdf": "cp presentation.md 2print.md && replace-in-file '/class=\"fragment\"/g' ' ' 2print.md --isRegex",
    "export:pdf": "reveal-md 2print.md -w --css local.css --theme white --print presentation.pdf",
    "postexport:pdf": "rm 2print.md"
  },
 ...
```

As you can see, I use `replace-in-file` dependency to remove all fragments in order to only print one page per slide, or else, each fragment will be printed on a new page, simulating a page-by-page animation.

### 💗 exporting to an HTML static website

You can also export your presentation to a statically rendered HTML  snapshot of it.

<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/IwTWTsUzmIicM" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/internet-surfing-IwTWTsUzmIicM">via GIPHY</a></p>

I use these NPM scripts in the `package.json` of the presentation's repository:
```json
  ...
  "scripts": {
    ...
    "export:site": "reveal-md presentation.md --css local.css --theme white --static _site",
    "postexport:site": "cp *.svg _site/ && cp *.png _site/ && cp *.jpg _site/ && cp *.mp4 _site/ && cp robots.txt _site/ && cp *.svg _site/_assets/ && cp *.png _site/_assets/ && cp *.jpg _site/_assets/",
 ...
```

Again, some post-processing to copy all images, videos as they were not copied by the export static option of reveal-md -- I might have missed some option, tell me how can I do this more cleanly if you know how; I will really appreciate the help!

---

## Conclusion

You've seen that **reveal-md** is a powerful tool to create technical presentations with code, iframes, animations, and emojis. It comes with useful shortcuts and commands to export to a static website and PDF to share after a meeting.

> I hope you enjoyed this post, or if you have any feedback, drop me a message on Twitter!

👋
