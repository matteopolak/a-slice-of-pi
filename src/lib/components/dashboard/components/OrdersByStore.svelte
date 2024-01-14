<script lang="ts">
	import type { Selected } from 'bits-ui';

	import Pizza from '~icons/ic/baseline-local-pizza';
	import Ruler from '~icons/mdi/ruler';
	import { trpc } from '$lib/client';
	import Select from '$lib/components/bits/select/Select.svelte';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { PizzaSize, PizzaType, Range } from '$lib/server/schema';

	export let range: Range;

	let sizes: Selected<PizzaSize>[];
	let types: Selected<PizzaType>[];
</script>

<div
		class="chart-item p-8 lg:col-span-3 grid place-items-center gap-4"
	>
		<div class="h-full w-full">
			<Chart
				data={trpc.ordersByStore.query({
					start: range.start,
					end: range.end,
					pizzaSize: sizes?.length ? sizes.map(s => s.value) : undefined,
					pizzaType: types?.length ? types.map(s => s.value) : undefined,
				})}
				type="bar"
				dataset="Orders by store"
				label={d => d.store}
				value={d => d.count}
				hideLegend
				yLabel="Orders"
			/>
		</div>

		<div class="grid lg:grid-cols-2 gap-2 mt-auto w-full">
			<Select
				placeholder="Filter by pizza size"
				icon={Ruler}
				multiple
				bind:selected={sizes}
				options={[
					{
						label: 'Small',
						value: 'S',
					},
					{
						label: 'Medium',
						value: 'M',
					},
					{
						label: 'Large',
						value: 'L',
					},
				]}
			/>

			<Select
				placeholder="Filter by pizza type"
				icon={Pizza}
				multiple
				bind:selected={types}
				options={[
					{
						label: 'Cheese',
						value: 'Cheese',
					},
					{
						label: 'Pepperoni',
						value: 'Pepperoni',
					},
					{
						label: 'Deluxe',
						value: 'Deluxe',
					},
					{
						label: 'Hawaiian',
						value: 'Hawaiian',
					},
					{
						label: 'Meatlovers',
						value: 'Meatlovers',
					},
				]}
			/>
		</div>
	</div>