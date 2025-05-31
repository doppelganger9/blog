<script>
  import { favicon } from "$lib/stores/favicon";

/**
 * This component just insert all favicon links in the <head> part of a page.
 * - different sizes (16,32,96)
 * - different devices/browsers requirements (iOS, etc.)
 * - it can be coupled to the routes/favicon-[size1]x[size2].[format].svelte to
 *    take a unique picture file in, and generate multiple files out with an
 *    endpoint using SvelteKit pre-load.
 */

</script>

<svelte:head>

  {#if $favicon !== 'favicon'}
  <link rel='icon' href='{$favicon}'>
  {/if}

  {#if $favicon === 'favicon'}
  <link rel="shortcut icon" href="/favicon.ico">

  <link rel="icon" sizes="16x16 32x32 64x64" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="196x196" href="/favicon-192.png">
  <link rel="icon" type="image/png" sizes="160x160" href="/favicon-160.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png">
  <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">

  <link rel="apple-touch-icon" href="/favicon-57.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/favicon-114.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/favicon-144.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/favicon-60.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/favicon-120.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/favicon-76.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/favicon-152.png">
  <link rel="apple-touch-icon" sizes="167x167" href="/favicon-167.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">

  <meta name="msapplication-TileColor" content="#FF3E00">
  <meta name="msapplication-TileImage" content="/favicon-144.png">
  <meta name="msapplication-config" content="/browserconfig.xml">
  {/if}

</svelte:head>
