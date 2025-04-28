import Twemoji from 'twemoji';

// inspiration from https://github.com/jankiel7410/svelte-twemoji/blob/master/src/index.ts
export function twemoji(node: HTMLElement, how: TwemojiOptions | ParseCallback = {}) {
  how = {
    ...how,
    // to always use SVG rendering
    ext: '.svg',
    folder: 'svg',
  }
  Twemoji.parse(node, how);
  
  $effect(() => {
    Twemoji.parse(node, how)
  });

	return {
		update() {
      console.warn('Changing twemoji options after the action was mounted is not possible.');
    }
	}
}