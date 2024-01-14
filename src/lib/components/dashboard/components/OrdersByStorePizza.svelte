<script lang="ts">
	import type { Selected } from 'bits-ui';

	import Pizza from '~icons/ic/baseline-local-pizza';
	import { trpc } from '$lib/client';
	import Select from '$lib/components/bits/select/Select.svelte';
	import Chart from '$lib/components/chart/Chart.svelte';
	import { PIZZA_SIZE_PRETTY } from '$lib/constants';
	import type { Range } from '$lib/server/schema';

	export let range: Range;

	let pizzaKey: Selected<'size' | 'type'> = {
		label: 'Pizza Type',
		value: 'type',
	};
</script>

<div
		class="chart-item p-8 lg:col-span-2 gap-4 grid place-items-center"
	>
		<div class="w-full">
			<Chart
				data={trpc.ordersByStoreByPizza.query({
					start: range.start,
					end: range.end,
					key: pizzaKey?.value ?? 'type',
				})}
				type="radar"
				dataset={pizzaKey?.value === 'type'
					? 'Orders by store by pizza type'
					: 'Orders by store by pizza size'}
				labels={pizzaKey?.value === 'type'
					? ['Cheese', 'Pepperoni', 'Deluxe', 'Hawaiian', 'Meatlovers']
					: ['Small', 'Medium', 'Large']}
				label={d => PIZZA_SIZE_PRETTY[d.x] ?? d.x}
				value={d => d.y}
			/>
		</div>

		<div class="flex w-full mt-auto">
			<Select
				placeholder="Select aggregation"
				icon={Pizza}
				bind:selected={pizzaKey}
				options={[
					{
						label: 'Pizza Type',
						value: 'type',
					},
					{
						label: 'Pizza Size',
						value: 'size',
					},
				]}
			/>
		</div>
	</div>