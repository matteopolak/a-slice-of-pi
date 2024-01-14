<script lang="ts">
	import { trpc } from '$lib/client';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { Range } from '$lib/server/schema';

	export let range: Range;
</script>

<div class="chart-item w-full p-8 lg:col-span-3 grid place-items-center">
	<Chart
		data={trpc.revenueByMonth.query(range)}
		type="line"
		dataset="Revenue by month"
		label={d => d.timestamp}
		value={d => d.revenue}
		hideLegend
		timeSeries
		yLabel="Revenue ($)"
	/>
</div>
