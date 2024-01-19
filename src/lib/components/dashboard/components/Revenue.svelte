<script lang="ts">
	import Countup from 'svelte-countup';

	import { trpc } from '$lib/client';

	const revenue = trpc.totalRevenue.query({
		range: {
			start: new Date(2023, 0, 1),
			end: new Date(2024, 0, 1),
		},
	});
</script>

<div
	class="chart-item !min-h-0 p-3 justify-center place-items-center flex flex-row text-4xl gap-4 lg:col-span-full"
>
	<span> Revenue </span>

	<div class="bg-background/50 rounded-xl p-3 font-bold">
		{#await revenue}
			...
		{:then revenue}
			$<Countup
				initial={0}
				value={revenue}
				duration={100}
				step={1}
				roundto={1}
				format={true}
			/>
		{/await}
	</div>
</div>