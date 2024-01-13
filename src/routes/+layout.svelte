<script>
	import '../app.css';

	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />

{#if $page.url.pathname === '/docs'}
	<slot />
{:else}
	<div class="container grid w-full gap-6 lg:gap-8 max-w-7xl p-4 lg:p-8">
		<slot />
	</div>
{/if}
