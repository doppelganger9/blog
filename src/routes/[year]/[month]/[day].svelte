<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [day].html
    const res = await this.fetch(`${params.year}/${params.month}/${params.day}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {
        post: data,
      };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import Post from '../../../components/Post.svelte';

  export let post;
</script>

<Post {post} />
