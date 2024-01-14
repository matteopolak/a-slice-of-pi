<script lang="ts">
	import { trpc } from '$lib/client';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { Range } from '$lib/server/schema';

	export let range: Range;
</script>

<div class="chart-item w-full p-8 lg:col-span-full grid place-items-center">
	<Chart
		data={trpc.revenueByStoreByMonth.query(range)}
		type="line"
		dataset="Revenue by store per month (stacked)"
		label={d => d.timestamp}
		value={d => d.revenue}
		timeSeries
		stacked
		yLabel="Revenue ($)"
	/>
</div>