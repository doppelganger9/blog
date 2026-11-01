<script>
  import TitleBar from '#lib/components/TitleBar.svelte';
  import ArticleFooter from '#lib/components/ArticleFooter.svelte';
  import Separator from '#lib/components/Separator.svelte';
</script>

<style>
  h1 { font-weight: bolder;}

  p.reading-time {
    margin: 0 0 4rem 0;
    font-size: 8pt;
  }

  p.date {
      margin: 0 0 .5rem 0;
      font-size: 10pt;
  }

</style>

<svelte:head>
  <title>Privacy Policy</title>
  <meta name='description' content="Privacy policy for David's Blog.">
</svelte:head>

<TitleBar level='h3' />

<h1>Privacy Policy</h1>
<p class='date'>November 01, 2026</p>
<p class='reading-time'>1 min read</p>

<figure>
  <img alt='Cookie Monster' src='cookiemonster.gif'>
</figure>

<p>Sorry, Cookie Monster: this blog sets no cookies.</p>
<p>To know which articles are read and where readers come from, page views are counted with <a href="https://www.goatcounter.com">GoatCounter</a>, an open source analytics service that does not use cookies and does not collect personal data. It records the page, its title, the referring page or campaign, the screen size, and a coarse location and browser derived from the request. Clicks on the contact and share links at the end of a post are counted the same way, as anonymous totals. Your IP address is not stored and you are not tracked across visits or websites. The statistics are only used to improve this blog and are never sold or shared.</p>
<p>Some pages embed third-party content (comments with Giscus, YouTube or Twitter embeds, fonts and libraries from CDNs): those services apply their own privacy policies when your browser loads them.</p>
<p>We are not responsible for republished content from this blog on other blogs or websites without our permission.</p>
<p>This privacy policy is subject to change without notice and was last updated on November, 1st, 2026. If you have any questions feel free to contact me directly here: <a href="mailto:david@lacourt.dev">david@lacourt.dev</a></p>

<Separator />
<ArticleFooter />

<a href="/hidden-links" style="visibility: hidden; position: absolute;">&nbsp;</a>
