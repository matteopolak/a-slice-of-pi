<script lang="ts">
	import type { DateRange } from 'bits-ui';

	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Range } from '$lib/server/schema';

	let range: Range = {
		start: new Date(Date.UTC(2023, 0, 1)),
		end: new Date(Date.UTC(2024, 0, 1)),
	};

	let rawRange: DateRange;

	$: if (rawRange?.end && rawRange?.start) {
		range = {
			start: rawRange.start.toDate('utc'),
			end: rawRange.end.toDate('utc'),
		};
	}
</script>

<Navbar bind:rawRange />

<div class="container grid w-full gap-6 lg:gap-8 max-w-7xl p-4 lg:p-8">
	<Dashboard {range} />
</div>
