<script lang="ts">
	import { trpc } from '$lib/client';
	import type { PizzaSize, PizzaType, Range } from '$lib/server/schema';
	import { month } from '$lib/constants';
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
	let value: DateRange | undefined;

	$: if (value?.end && value?.start) {
		range = {
			start: value.start.toDate('utc'),
			end: value.end.toDate('utc'),
		};
	}
</script>

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

<div style="width: 400px;">
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

<div style="width: 400px;">
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
	/>
</div>

{#await revenue}
	loading...
{:then revenue}
	<div>
		Total revenue: {revenue}
	</div>
{/await}

<div style="width: 400px;">
	<Chart
		data={trpc.revenueByMonth.query({
			range,
		})}
		type="line"
		dataset="Revenue by month"
		label={d => month(d.month)}
		value={d => d.revenue}
	/>
</div>
