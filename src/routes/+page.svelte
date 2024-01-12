<script lang="ts">
	import Countup from 'svelte-countup';

	import { trpc } from '$lib/client';
	import type { PizzaSize, PizzaType, Range } from '$lib/server/schema';
	import Chart from '$lib/components/chart/Chart.svelte';
	import DateRangePicker from '$lib/components/bits/date-range-picker/DateRangePicker.svelte';
	import type { DateRange, Selected } from 'bits-ui';
	import Select from '$lib/components/bits/select/Select.svelte';

	import Pizza from '~icons/ic/baseline-local-pizza';
	import Ruler from '~icons/mdi/ruler';

	let range: Range = {
		start: new Date(Date.UTC(2023, 0, 1)),
		// end is exclusive
		end: new Date(Date.UTC(2024, 0, 1)),
	};

	$: revenue = trpc.totalRevenue.query({
		range: {
			start: new Date(2023, 0, 1),
			// end is exclusive
			end: new Date(2024, 0, 1),
		},
	});

	let sizes: Selected<PizzaSize>[];
	let types: Selected<PizzaType>[];
	let value: DateRange;

	$: if (value?.end && value?.start) {
		range = {
			start: value.start.toDate('utc'),
			end: value.end.toDate('utc'),
		};
	}
</script>

<div class="flex flex-row flex-wrap gap-4 justify-center w-full">
	<DateRangePicker bind:value />

	<Select
		placeholder="Select pizza sizes"
		icon={Ruler}
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
		placeholder="Select pizza types"
		icon={Pizza}
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

<div class="dashboard overflow-hidden">
	<div
		id="rev"
		class="p-3 justify-center place-items-center flex flex-row text-4xl bg-dark-4 rounded-3xl gap-4"
	>
		<span> Revenue </span>

		<div class="bg-background/50 rounded-xl p-3 font-bold">
			{#await revenue}
				loading...
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

	<div class="grid lg:grid-cols-3 gap-4 w-full">
		<div id="pie" class="h-full bg-dark-4 rounded-3xl p-8 lg:col-span-1">
			<Chart
				data={trpc.reviewsBySentiment.query({
					range,
				})}
				type="pie"
				dataset="Reviews by sentiment"
				label={d => d.sentiment}
				value={d => d.count}
			/>
		</div>

		<div id="ord" class="h-full bg-dark-4 rounded-3xl p-8 lg:col-span-2">
			<Chart
				data={trpc.ordersByStore.query({
					range,
					pizzaSize: sizes?.length ? sizes.map(s => s.value) : undefined,
					pizzaType: types?.length ? types.map(s => s.value) : undefined,
				})}
				type="bar"
				dataset="Orders by store"
				label={d => d.store}
				value={d => d.count}
				hideLegend
			/>
		</div>
	</div>

	<div id="mon" class="w-full h-full bg-dark-4 rounded-3xl p-8">
		<Chart
			data={trpc.revenueByMonth.query({
				range,
			})}
			type="line"
			dataset="Revenue by month"
			label={d => d.timestamp}
			value={d => d.revenue}
			hideLegend
			timeSeries
		/>
	</div>
</div>

<style>
	.dashboard {
		@apply flex flex-col gap-4;
	}
</style>
