<script>
	import {onMount} from 'svelte';
	
	onMount(() => {
		const child = document.createElement('script');
        child.async = 'async';
        child.src = "https://platform.twitter.com/widgets.js"
        child.charset = "utf-8";

        const body = document.getElementsByTagName('body')[0];
		body.appendChild(child);
	});
</script>
