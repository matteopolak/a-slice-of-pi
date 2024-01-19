<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { onMount } from 'svelte';

	import GitHub from '~icons/bxl/github';
	import Api from '~icons/ic/baseline-api';
	import DateRangePicker from '$lib/components/bits/date-range-picker/DateRangePicker.svelte';

	export let rawRange: DateRange = {
		start: new CalendarDate(2023, 0, 0),
		end: new CalendarDate(2024, 0, 0),
	};

	let show = false;

	onMount(() => {
		const interval = setInterval(() => {
			show = true;

			setTimeout(() => {
				show = false;
			}, 250);
		}, 4_000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<header class="border-b border-border bg-background/75 backdrop-blur sticky top-0 z-20">
	<div class="container px-8 max-w-7xl py-4">
		<div class="flex h-[70px] items-center justify-between gap-3">
			<div class="flex items-center gap-1.5">
				<a href="/" class="rounded-md flex flex-row place-items-center gap-2" title="Visit home of a slice of pie">
					<enhanced:img src="../../../static/favicon.webp" alt="a slice of pie" class="sq-12" />

					<span class="font-bold text-xl font-morn">
						{#if show}
							a slice of pie
						{:else}
							<!-- Use an invisible character to remove layout shift -->
							a slice of pi<span class="opacity-0">e</span>
						{/if}
					</span>
				</a>
			</div>

			<div class="hidden md:block container max-w-md">
				<DateRangePicker bind:value={rawRange} />
			</div>

			<div class="flex items-center gap-4">
				<a href="/docs" aria-label="Read API documentation">
					<Api class="sq-6" />
				</a>

				<a href="https://github.com/matteopolak/a-slice-of-pi" aria-label="View the website's source code on GitHub">
					<GitHub class="sq-6" />
				</a>
			</div>
		</div>

		<div class="md:hidden container max-w-md">
			<DateRangePicker bind:value={rawRange} />
		</div>
	</div>
</header>
