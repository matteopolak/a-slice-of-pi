<script>
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
</script>

<Navbar />

{#if $page.url.pathname === '/docs'}
	<slot />
{:else}
	<div class="grid place-items-center p-8">
		<div class="grid w-full gap-8 max-w-7xl">
			<slot />
		</div>
	</div>
{/if}
