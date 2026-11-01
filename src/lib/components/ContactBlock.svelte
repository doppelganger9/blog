<script>
  // Shared "get in touch" block shown at the end of every post, in the post's language.
  // Each link is counted as a GoatCounter event (contact-*, share-*) to see what readers use.
  import { siteUrl } from '#lib/stores/config.js';
  import { twemoji } from '#lib/twemoji.svelte.ts';

  let { slug, title, lang = 'en' } = $props();

  const fr = $derived(lang === 'fr');
  const postUrl = $derived(`${siteUrl}/${slug}`);
  const blueskyShare = $derived(`https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${postUrl}`)}`);
  const linkedinShare = $derived(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`);

  function track(event) {
    window.goatcounter?.count?.({ path: event, title: `/${slug}`, event: true });
  }
</script>

<style>
  .contact {
    margin: 3rem 0 2rem;
    padding: 1rem 1.25rem;
    border-left: 0.32813rem solid hsl(280, 85%, 55%);
    border-radius: 4px;
    background: hsl(280, 60%, 97%);
    color: #333;
  }
  .contact p {
    margin: 0 0 0.75rem;
  }
  .contact p:last-child {
    margin-bottom: 0;
  }
  .lead {
    font-weight: 700;
    font-size: 1.1rem;
  }
  .share {
    font-size: 0.9rem;
  }
</style>

<aside class='contact' data-cy='blog-post-contact' aria-label={fr ? 'Me contacter' : 'Get in touch'}>
  {#if fr}
    <p class='lead' use:twemoji>Une question, une correction, ou une meilleure blague que les miennes&nbsp;? 👇</p>
    <p>
      Les <a href='#comments' onclick={() => track('contact-comments')}>commentaires</a> sont juste en dessous (un compte GitHub suffit).
      Sinon&nbsp;:
      <a href='https://bsky.app/profile/doppelganger9.bsky.social' target='_blank' rel='noopener' onclick={() => track('contact-bluesky')}>Bluesky</a> ·
      <a href='https://www.linkedin.com/in/davidlacourt/' target='_blank' rel='noopener' onclick={() => track('contact-linkedin')}>LinkedIn</a> ·
      <a href='mailto:david@lacourt.dev' onclick={() => track('contact-email')}>e-mail</a>.
    </p>
    <p class='share' use:twemoji>
      Si l'article vous a servi, le partager est le plus beau des mercis 🙏 ça me motive à en écrire d'autres (promis, plus d'un par an).
      Partager sur
      <a href={blueskyShare} target='_blank' rel='noopener' onclick={() => track('share-bluesky')}>Bluesky</a> ·
      <a href={linkedinShare} target='_blank' rel='noopener' onclick={() => track('share-linkedin')}>LinkedIn</a>
    </p>
  {:else}
    <p class='lead' use:twemoji>Got a question, a correction, or a better joke than mine? 👇</p>
    <p>
      <a href='#comments' onclick={() => track('contact-comments')}>Comments</a> are right below (a GitHub account is enough).
      Otherwise:
      <a href='https://bsky.app/profile/doppelganger9.bsky.social' target='_blank' rel='noopener' onclick={() => track('contact-bluesky')}>Bluesky</a> ·
      <a href='https://www.linkedin.com/in/davidlacourt/' target='_blank' rel='noopener' onclick={() => track('contact-linkedin')}>LinkedIn</a> ·
      <a href='mailto:david@lacourt.dev' onclick={() => track('contact-email')}>email</a>.
    </p>
    <p class='share' use:twemoji>
      If this post helped, sharing it is the nicest thank-you 🙏 it keeps me writing (more than once a year, promised).
      Share on
      <a href={blueskyShare} target='_blank' rel='noopener' onclick={() => track('share-bluesky')}>Bluesky</a> ·
      <a href={linkedinShare} target='_blank' rel='noopener' onclick={() => track('share-linkedin')}>LinkedIn</a>
    </p>
  {/if}
</aside>
