<script>
  import ArticleFooter from "$lib/components/ArticleFooter.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import TitleBar from "$lib/components/TitleBar.svelte";
  import URIComponentsTool from "$lib/components/URIComponentsTool.svelte";
  import Base64Tool from "$lib/components/Base64Tool.svelte";
  import JSONFormatter from "$lib/components/JSONFormatter.svelte";
</script>

<svelte:head>
  <title>dev-tools</title>
  <meta name="description" content="developer tools" />
</svelte:head>

<TitleBar level='h3' />

<h1 data-cy='blog-post-heading'>Developer Tools</h1>

<div data-cy='blog-post-content' class='content'>
  <p>DISCLAIMER: We do not steal your data.
    Use at your own risk.
    The source code is available on github.
  </p>
  
  <div>
    <h3>Encode/Decode URI Components</h3>
    <URIComponentsTool />
  </div>

  <div>
    <h3>Encode/Decode Base64</h3>
    <Base64Tool />
  </div>

  <div>
    <h3>Pretty-print 💅 JSON data</h3>
    <JSONFormatter />
  </div>

</div>

<Separator />
<ArticleFooter />
