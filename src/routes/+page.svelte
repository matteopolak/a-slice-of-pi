<script lang="ts">
	import type { DateRange, Selected } from 'bits-ui';
	import Countup from 'svelte-countup';

	import Pizza from '~icons/ic/baseline-local-pizza';
	import Ruler from '~icons/mdi/ruler';
	import { trpc } from '$lib/client';
	import DateRangePicker from '$lib/components/bits/date-range-picker/DateRangePicker.svelte';
	import Select from '$lib/components/bits/select/Select.svelte';
	import Chart from '$lib/components/chart/Chart.svelte';
	import { PIZZA_SIZE_PRETTY } from '$lib/constants';
	import type { PizzaSize, PizzaType, Range } from '$lib/server/schema';

	let range: Range = {
		start: new Date(Date.UTC(2023, 0, 1)),
		// end is exclusive
		end: new Date(Date.UTC(2024, 0, 1)),
	};

	$: revenue = trpc.totalRevenue.query({
		start: new Date(2023, 0, 1),
		// end is exclusive
		end: new Date(2024, 0, 1),
	});

	let sizes: Selected<PizzaSize>[];
	let types: Selected<PizzaType>[];
	let value: DateRange;
	let pizzaKey: Selected<'size' | 'type'> = {
		label: 'Pizza Type',
		value: 'type',
	};

	$: if (value?.end && value?.start) {
		range = {
			start: value.start.toDate('utc'),
			end: value.end.toDate('utc'),
		};
	}
</script>

<div class="container max-w-xl">
	<DateRangePicker bind:value />
</div>

<div class="grid lg:grid-cols-7 gap-4">
	<div
		class="p-3 justify-center place-items-center flex flex-row text-4xl bg-dark-4 rounded-3xl gap-4 lg:col-span-7"
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

	<div class="bg-dark-4 rounded-3xl p-8 lg:col-span-3 grid place-items-center">
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

	<div
		class="bg-dark-4 rounded-3xl p-8 lg:col-span-4 grid place-items-center gap-4"
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

		<div class="grid lg:grid-cols-2 gap-2 mt-auto">
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

	<div class="bg-dark-4 rounded-3xl p-8 lg:col-span-5 grid place-items-center">
		<div class="w-full">
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
	</div>

	<div
		class="bg-dark-4 rounded-3xl p-8 lg:col-span-2 gap-4 grid place-items-center"
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

		<div class="flex">
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

	<div class="w-full bg-dark-4 rounded-3xl p-8 lg:col-span-7 grid place-items-center min-w-0">
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
</div>
