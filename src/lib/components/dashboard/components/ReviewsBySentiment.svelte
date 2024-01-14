<script lang="ts">
	import { trpc } from '$lib/client';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { Range } from '$lib/server/schema';

	export let range: Range;
</script>

<div class="chart-item p-8 lg:col-span-2 grid place-items-center">
	<div class="h-full w-full">
		<Chart
			data={trpc.reviewsBySentiment.query(range)}
			type="pie"
			dataset="Reviews by sentiment"
			label={d => d.sentiment}
			value={d => d.count}
		/>
	</div>
</div>
