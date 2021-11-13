<script context="module">
/**
 * @type {import('@sveltejs/kit').Load}
 */
export function load({ page }) {
  const { params } = page;
  return loadPostForSlug(`${params.year}/${params.month}/${params.day}`);
}
</script>

<script>
  import Post from '$lib/components/Post.svelte';
  import { loadPostForSlug } from '$lib/posts';

  export let post;
</script>

<Post {post} />
