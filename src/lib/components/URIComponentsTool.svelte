<script>
import { i18n } from "$lib/stores/i18n";
import { onMount } from "svelte";

// ---- URI component de/encoding
export let encode = "some/url?with=query&parameters=to_encode";
export let decode = undefined;
export let useComponents = true;
let error = undefined;

const onInputDecodeURI = () => {
  error = undefined;
  try {
    encode = useComponents ? decodeURIComponent(decode) : decodeURI(decode)
  } catch (e) {
    error = e
  }
}
const onInputEncodeURI = () => {
  error = undefined;
  try {
    decode = useComponents ? encodeURIComponent(encode) : decodeURI(encode)
  } catch (e) {
    error = e
  }
}

onMount(() => {
  onInputEncodeURI();
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
  <label for="urlencodedtext">{$i18n`label.encode.uricomponents`}</label>
  <textarea id="urlencodedtext" name="urlencodedtext"
    bind:value={encode} 
    on:input={onInputEncodeURI}></textarea>

  <br/>

  <label for="urldecodedtext">{$i18n`label.decode.uricomponents`}</label>
  <textarea id="urldecodedtext" name="urldecodedtext"
    bind:value={decode}
    on:input={onInputDecodeURI}></textarea>

</div>