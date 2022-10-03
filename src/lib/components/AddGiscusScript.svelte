<script>
  import {onMount} from 'svelte';
  
  onMount(() => {
    const child = document.createElement('script');
    child.async = 'async';
    child.src = "https://giscus.app/client.js"
    child.setAttribute('data-repo', "doppelganger9/blog");
    child.setAttribute('data-repo-id', "MDEwOlJlcG9zaXRvcnkxNzM2MjMwNzU=");
    child.setAttribute('data-category', "Post comments");
    child.setAttribute('data-category-id', "DIC_kwDOCllHI84CAEI-");
    child.setAttribute('data-mapping', "pathname");
    child.setAttribute('data-reactions-enabled', "1");
    child.setAttribute('data-emit-metadata', "0");
    child.setAttribute('data-theme', "light");
    child.setAttribute('data-lang', "en");
    child.setAttribute('crossorigin', "anonymous");
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(child);
  });
</script>
