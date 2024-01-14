<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';

	import DateRangePicker from '$lib/components/bits/date-range-picker/DateRangePicker.svelte';
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import type { Range } from '$lib/server/schema';

	let range: Range = {
		start: new Date(Date.UTC(2023, 0, 1)),
		end: new Date(Date.UTC(2024, 0, 1)),
	};

	let rawRange: DateRange = {
		start: new CalendarDate(2023, 0, 0),
		end: new CalendarDate(2024, 0, 0),
	};

	$: if (rawRange?.end && rawRange?.start) {
		range = {
			start: rawRange.start.toDate('utc'),
			end: rawRange.end.toDate('utc'),
		};
	}
</script>

<div class="container max-w-xl">
	<DateRangePicker bind:value={rawRange} />
</div>

<Dashboard {range} />
