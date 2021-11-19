<script>
  import ArticleFooter from "$lib/components/ArticleFooter.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import TitleBar from "$lib/components/TitleBar.svelte";
  import { onMount } from "svelte";

  // ---- URI component de/encoding
  let textToURLEncode = "some/url?with=query&parameters=to_encode";
  let textToURLDecode;

	const onInputDecodeURI = () => textToURLEncode = decodeURIComponent(textToURLDecode)
	const onInputEncodeURI = () => textToURLDecode = encodeURIComponent(textToURLEncode)
	
  // ---- Base64 de/encoding
  let textToEncodeBase64 = "Text to transform to Base64";
  let textToDecodeBase64;

  const onInputDecodeB64 = () => {
    textToEncodeBase64 = atob(textToDecodeBase64)
  }
	const onInputEncodeB64 = () => {
    textToDecodeBase64 = btoa(textToEncodeBase64)
  }

  onMount(() => {
    onInputEncodeURI();
    onInputEncodeB64();
  })

  let textToPrettyPrintJSON;
  let errorJSON;
  const prettyPrintJSON = () => {
    errorJSON = undefined;
    try {
      textToPrettyPrintJSON = JSON.stringify(JSON.parse(textToPrettyPrintJSON), null, jsonTabs)
    } catch (e) {
      errorJSON = e
    }
  }
  let jsonTabs = 2;

</script>

<style>
  	textarea {
		width: 100%;
		height: 100px;
	}
</style>

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
    <label for="urlencodedtext">Type here to encode URI Components</label>
    <textarea id="urlencodedtext" name="urlencodedtext"
      bind:value={textToURLEncode} 
      on:input={onInputEncodeURI}></textarea>
    <br/>
    <label for="urldecodedtext">Type here to decode URI Components</label>
    <textarea id="urldecodedtext" name="urldecodedtext"
      bind:value={textToURLDecode}
      on:input={onInputDecodeURI}></textarea>
  </div>

  <div>
    <h3>Encode/Decode Base64</h3>
    <label for="b64encodedtext">Type here to encode in Base64 (btoa)</label>
    <textarea id="b64encodedtext" name="b64encodedtext"
      bind:value={textToEncodeBase64} 
      on:input={onInputEncodeB64}></textarea>
    <br/>
    <label for="b64decodedtext">Type here to decode from Base64 (atob)</label>
    <textarea id="b64decodedtext" name="b64decodedtext"
      bind:value={textToDecodeBase64}
      on:input={onInputDecodeB64}></textarea>
  </div>

  <div>
    <h3>Pretty-print 💅 JSON data</h3>
    <label for="jsontext">Type here some JSON Data to pretty-print</label>
    {#if errorJSON}<p>{errorJSON}</p>{/if}
    
    <textarea id="jsontext" name="jsontext"
      bind:value={textToPrettyPrintJSON}></textarea>
    <button on:click={prettyPrintJSON} name="prettyprintjson">Pretty print JSON Data now!</button>
    <input bind:value={jsonTabs}>
  </div>


</div>

<Separator />
<ArticleFooter />
