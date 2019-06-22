<script>
  import TitleBar from '../components/TitleBar.svelte';
  import ArticleFooter from '../components/ArticleFooter.svelte';
  import Separator from '../components/Separator.svelte';
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
<p class='date'>March 06, 2019</p>
<p class='reading-time'>1 min read</p>

<figure>
  <img alt='Cookie Monster' src='cookiemonster.gif'>
</figure>

<p>This blog does not share personal information with third parties nor do we store any information about your visit to this blog other than to analyze and optimize your content and reading experience through the use of cookies.</p>
<p>You can turn off the use of cookies at any time by changing your specific browser settings.</p>
<p>We are not responsible for republished content from this blog on other blogs or websites without our permission.</p>
<p>This privacy policy is subject to change without notice and was last updated on March, 6th, 2019. If you have any questions feel free to contact me directly here: <a href="mailto:david@lacourt.dev">david@lacourt.dev</a></p>

<Separator />
<ArticleFooter />

<a href="hidden-links" style="visibility: hidden; position: absolute;">&nbsp;</a>
