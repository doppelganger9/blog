<script>
  import ArticleFooter from "$lib/components/ArticleFooter.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import TitleBar from "$lib/components/TitleBar.svelte";
  import { onMount } from "svelte";

  let jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  let body = "", header = "", signature = "";

  const read = (text) => {
    try {
      return JSON.stringify(JSON.parse(atob(text)), null, 2);
    } catch(e) {
      console.error(e)
    }

  }

  const jwtChanged = () => {
    const [_header, _body, _signature] = jwt.split('.');
    header = read(_header);
    body = read(_body);
    signature = _signature;
  }

  const recreateJwt = () => {
    // TODO real signature    
    jwt = `${btoa(JSON.stringify(JSON.parse(header)))}.${btoa(JSON.stringify(JSON.parse(body)))}.${signature}`;
  }

  onMount(() => {
    jwtChanged();
  });

</script>

<style>
  textarea {
    width: 100%;
    height: 100px;
  }

  .flexed {
    display: inline-flex;
    width: 100%;
    height: 400px;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: stretch;
  }

  .arrow {
    margin: auto 0;
  }

  h4 {
    margin: 0;
    padding: 0;
  }
  div#jwt {
    color: blue;
    margin-right: 10px;
    width: 363px;    
    border: 1px solid gray;
    background-color: azure;
    padding: 20px;
    height: 100%;
  }
  div#jwt-parts {
    border: 1px solid gray;
    background-color: honeydew;
    padding: 20px;
    height: 100%;
  }
  div#jwt textarea {
    color: blue;
    height: 367px;
  }
  div#jwt-header {
    color: blueviolet;
  }
  div#jwt-header textarea {
    color: blueviolet;
  }
  div#jwt-body {
    color: darkorange;
  }
  div#jwt-body textarea {
    color: darkorange;
  }
  div#jwt-signature {
    color: green;
  }
  div#jwt-signature textarea {
    color: green;
  }
</style>

<svelte:head>
  <title>JSON Web Token tool</title>
  <meta name="description" content="JWT tool" />
</svelte:head>

<TitleBar level='h3' />

<h1 data-cy='blog-post-heading'>JWT Tool 🛠</h1>

<div data-cy='blog-post-content' class='content'>
  <p style="font-style: italic;">DISCLAIMER: We do not steal your data.
    Use at your own risk.
    The source code is available on github.
  </p>
  <p>This is a very basic JWT tool that splits a JWT into its header, body and signature. Then we read the Base64 and format the resulting JSON data for header and body. At the moment we do not do anything with the signature.</p>

  <div class="flexed">
    <div id="jwt">
      <h4>JWT</h4>
      <textarea bind:value={jwt} on:input={jwtChanged}></textarea>
    </div>

    <div class="arrow">↔</div>
  
    <div id="jwt-parts">
      <div id="jwt-header">
        <h4>Header</h4>
        <textarea bind:value={header} on:input={recreateJwt}></textarea>
      </div>
      <div id="jwt-body">
        <h4>Body</h4>
        <textarea bind:value={body} on:input={recreateJwt}></textarea>
      </div>
      <div id="jwt-signature">
        <h4>Signature</h4>
        <textarea bind:value={signature} on:input={recreateJwt}></textarea>
      </div>
    </div>
  </div>

</div>

<Separator />
<ArticleFooter />
