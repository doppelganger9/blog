<script lang="ts">
  import { onMount } from 'svelte';

  let qrCodeContents = "test";

  onMount(async () => {
    await import("https://doppelganger9.github.io/stencil-qrcode-component/build/stqrcmp.esm.js");
  });

</script>

<h2>Importing my QR Code StencilJS web-component</h2>
<p>
  This is an experiment to include in SvelteKit a WebComponent made using StencilJS and published in a GitHub Page.
  See <a href="https://doppelganger9.github.io/stencil-qrcode-component">https://doppelganger9.github.io/stencil-qrcode-component</a>
</p>
<label for="qr-content">You can change the QR Code contents here:</label><input id="qr-content" type="text" bind:value={qrCodeContents} />

<qr-code
  class="with-rounded-corners"
  contents={qrCodeContents}
  output-mode="SVG"
  style="width: 300px;height: 300px;">
</qr-code>

<p>
  And then use your QR Code scanner to check that it is ok.
</p>

<style>
  qr-code {
    padding: 5px;
    margin: 0 auto;
  }
</style>
