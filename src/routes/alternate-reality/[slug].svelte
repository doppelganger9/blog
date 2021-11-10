<script context="module">
/**
 * @type {import('@sveltejs/kit').Load}
 */
export async function load({ page, fetch, session, stuff }) {
  // the `slug` parameter is available because
  // this file is called [slug].html
  const { params } = page;
  const url = `/alternate-reality/${params.slug}.json`;
  const res = await fetch(url);

  if (res.ok) {
    return { 
      props: {
        post: await res.json()
      }
    };
  }
  
  return {
    status: res.status,
    error: new Error(`No data found in an alternate reality at URL ${url}`)
  };
}
</script>

<script>
  import Post from '../../components/Post.svelte';

  export let post;
</script>

<Post {post} />
