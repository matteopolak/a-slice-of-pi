<script>
	import { browser } from '$app/environment';
	import { RedocStandalone } from 'redoc-svelte';
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		document.documentElement.classList.add('bg-white', 'min-h-screen');
	});

	onDestroy(() => {
		if (browser)
			document.documentElement.classList.remove('bg-white', 'min-h-screen');
	});
</script>

<div class="bg-white min-h-screen">
	<RedocStandalone specUrl="/docs/openapi.json" />
</div>
