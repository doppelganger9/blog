<script>
import { i18n } from "$lib/stores/i18n";

// ---- JSON pretty-printing/formatting
export let json = JSON.stringify({ "a": { "b": "c" } })
export let jsonTabs = 2
let error = undefined

const prettyPrintJSON = () => {
  error = undefined
  try {
    json = JSON.stringify(JSON.parse(json), null, +jsonTabs)
  } catch (e) {
    error = e
  }
}
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
  <label for="jsontext">{$i18n`label.json.textarea`}</label>
  {#if error}<p class="error">{error}</p>{/if}
  <textarea id="jsontext"
    bind:value={json}></textarea>
  <label for="tabsize">{$i18n`label.tab.size`}&nbsp;</label><input id="tabsize" type="number" min="0" max="10" bind:value={jsonTabs} on:change={prettyPrintJSON}>
  <button on:click={prettyPrintJSON} name="prettyprintjson">{$i18n`button.format.json`}</button>
</div>