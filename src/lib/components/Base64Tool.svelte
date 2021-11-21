<script>
  import { onMount } from "svelte";
  import { i18n } from '$lib/stores/i18n.js';

  // ---- Base64 de/encoding
  export let encode = `Text to transform to Base64; never trust online tools; don't put sensitive data here`;
  export let decode = undefined;
  let decodeUsesBase64URLFormat = false;
  let encodeUsesBase64URLFormat = false;
  let error = undefined;

  function detectBase64URLFormat(input) {
    return ((input.indexOf('-') >= 0) || (input.indexOf('_') >= 0))
          && (input.indexOf('/') < 0)
          && (input.indexOf('+') < 0)
          && (input.indexOf('=') < 0)
  }

  // thanks to https://stackoverflow.com/a/51838635/526660
  function formatBase64URLToBase64(input) {
      // Replace non-url compatible chars with base64 standard chars
      input = input
          .replace(/-/g, '+')
          .replace(/_/g, '/');

      // Pad out with standard base64 required padding characters
      let pad = input.length % 4;
      if (pad) {
        if (pad === 1) {
          throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        input += new Array(5-pad).join('=');
      }
      return input;
  }

  function formatBase64ToBase64URL(input) {
      return input
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/\=/g, '');      
  }

  const onInputDecodeB64 = () => {
    error = undefined;
    try {
      decodeUsesBase64URLFormat = detectBase64URLFormat(decode)
      console.log(decodeUsesBase64URLFormat)
      encode = atob(formatBase64URLToBase64(decode))
    } catch (e) {
      error = e
    }
  }
  const onInputEncodeB64 = () => {
    error = undefined;
    try {
      decode = encodeUsesBase64URLFormat ? formatBase64ToBase64URL(btoa(encode)) : btoa(encode)
      decodeUsesBase64URLFormat = detectBase64URLFormat(decode)
    } catch (e) {
      error = e
    }
  }
  const handleClickCheckboxEncodeUsesB64URL = () => {
    console.log(encodeUsesBase64URLFormat)
    encodeUsesBase64URLFormat = !encodeUsesBase64URLFormat
    onInputEncodeB64();
  }
  
  onMount(() => {
    onInputEncodeB64();
  })
  </script>
  
  <style>
    textarea {
      width: 100%;
      height: 100px;
    }
    p.error {
      color: red;
    }
  </style>
  
  <div>
    {#if error}<p class="error">{error}</p>{/if}
    <label for="b64encodedtext">{$i18n`label.encode.base64`}</label>
    <textarea id="b64encodedtext"
      bind:value={encode} 
      on:input={onInputEncodeB64}></textarea>
    <input id="encodeuseb64url" type="checkbox" 
      on:click={handleClickCheckboxEncodeUsesB64URL}
      checked={encodeUsesBase64URLFormat}>
    <label for="encodeuseb64url">{$i18n`encode.using.base64url`}</label>
    <br/>
    <label for="b64decodedtext">{$i18n`label.decode.base64`}</label>
    <textarea id="b64decodedtext"
      bind:value={decode}
      on:input={onInputDecodeB64}></textarea>
    <input id="decodeuseb64url" type="checkbox" disabled="disabled"
      bind:checked={decodeUsesBase64URLFormat}>
    <label for="decodeuseb64url">{$i18n`decoded.text.base64url`}</label>
  </div>