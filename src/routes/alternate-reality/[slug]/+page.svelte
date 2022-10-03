<script context="module">
/**
 * @type {import('@sveltejs/kit').Load}
 */
export function load({ params }) {
  return loadPostForSlug(`alternate-reality/${params.slug}`);
}
</script>

<script>
  import Post from '$lib/components/Post.svelte';
import { loadPostForSlug } from '$lib/posts';

  export let post;
</script>

<Post {post} />
