<script>
  import Post from '$lib/components/Post.svelte';

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<Post post={data}/>
