<script>
  import { onMount } from 'svelte';

  export let characters = ['💎', '💵', '💶', '💰', '💷', '💴'];
  export let numberOfFallingItems = 50;
  export let rainingTimes = 1; // infinite or number of times the same emoji will fall.

  let confetti = new Array(numberOfFallingItems).fill()
    .map((_, i) => {
      return {
        character: characters[i % characters.length],
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        r: 0.1 + Math.random() * 1,
        t: +rainingTimes,
      };
    })
    .sort((a, b) => a.r - b.r);

  onMount(() => {
    let frame;

    function loop() {
      confetti = confetti.map(emoji => {
        emoji.y += 0.7 * emoji.r;
        if (emoji.y > 120) {
          emoji.y = -20;
          if (emoji.t>0) emoji.t -= 1;
        }
        return emoji;
      }).filter(emoji => emoji.t !== 0);
      if (confetti.length > 0) {
        frame = requestAnimationFrame(loop);
      } else {
        // animation ends. all emojis have fallen.
      }
    }

    loop();

    return () => cancelAnimationFrame(frame);
  });
</script>

<style>
  :global(body) {
    overflow: hidden;
  }

  span {
    position: absolute;
    font-size: 5vw;
  }
</style>

{#each confetti as c}
  <span style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})">{c.character}</span>
{/each}
