<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
</script>

<Navbar />

<div class="grid place-items-center p-8">
	<div class="grid w-full max-w-7xl gap-8">
		<slot />
	</div>
</div>
