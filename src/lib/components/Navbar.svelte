<script lang="ts">
	import { onMount } from 'svelte';
	import GitHub from '~icons/bxl/github';
	import Api from '~icons/ic/baseline-api';

	let show = false;

	onMount(() => {
		const interval = setInterval(() => {
			show = true;

			setTimeout(() => {
				show = false;
			}, 250);
		}, 4_000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<header class="border-b border-border bg-background/75 backdrop-blur">
	<div class="container px-4 max-w-7xl">
		<div class="flex h-[70px] items-center justify-between gap-3">
			<div class="flex items-center gap-1.5">
				<a href="/" class="rounded-md flex flex-row place-items-center gap-2">
					<img src="/favicon.png" alt="Logo" class="sq-12" />

					<span class="font-bold text-xl font-morn">
						{#if show}
							a slice of pie
						{:else}
							a slice of pi
						{/if}
					</span>
				</a>
			</div>

			<div class="flex items-center gap-4">
				<a href="/docs">
					<Api class="sq-6" />
				</a>

				<a href="https://github.com/matteopolak/a-slice-of-pi">
					<GitHub class="sq-6" />
				</a>
			</div>
		</div>
	</div>
</header>
