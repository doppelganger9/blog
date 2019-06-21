<script>
  import { onMount, onDestroy } from 'svelte';

	let elapsed = 0;
	let duration = 5000;

	let last_time;
  let frame;

  onMount(() => {
    // window, cancelAnimationFrame are not defined when Sapper compiles & crawls from server-side node.
    last_time = window.performance.now();

    onDestroy(() => {
	  	cancelAnimationFrame(frame);
  	});
  });

  let changeDuration = () => {
    elapsed = 0;
    last_time = window.performance.now();
    frame && cancelAnimationFrame(frame);
    (function update() {
      frame = requestAnimationFrame(update);

      const time = window.performance.now();
      elapsed += Math.min(
        time - last_time,
        duration - elapsed
      );

      last_time = time;
    }());
  };

</script>
<h1>Chrono</h1>
<p>
<label for="duration">Duration:</label><input id="duration" type="number" bind:value={duration} on:change={() => changeDuration()} min=1 />
</p>
<button on:click={() => changeDuration()}>Go!</button>
<p>
<label>
	elapsed time:
	<progress value="{elapsed / duration}"></progress>{#if elapsed-duration == 0} DONE {:else} ... {/if}
</label>
</p>
<!-- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API -->
