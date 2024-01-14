<script lang="ts">
	import type { Selected } from 'bits-ui';

	import Theater from '~icons/ic/baseline-theater-comedy';
	import Select from '$lib/components/bits/select/Select.svelte';
	import ReviewGrid from '$lib/components/ReviewGrid.svelte';
	import type { Range } from '$lib/server/schema';
	import type { ReviewSentiment } from '$lib/server/schema';

	export let range: Range;

	let sentiments: Selected<ReviewSentiment>[] = [];
</script>

<div class="prose prose-invert theme-item lg:col-span-full p-8 max-w-full flex flex-row gap-4">
	<h1 class="m-0">Reviews</h1>

	<Select
		class="ml-auto flex-grow-0 max-w-md w-full"
		placeholder="Filter by sentiment"
		icon={Theater}
		multiple
		bind:selected={sentiments}
		options={[
			{
				label: 'Delighted',
				value: 'delighted',
			},
			{
				label: 'Happy',
				value: 'happy',
			},
			{
				label: 'Sad',
				value: 'sad',
			},
			{
				label: 'Angry',
				value: 'angry',
			},
		]}
	/>
</div>

<ReviewGrid {range} sentiments={sentiments.map(s => s.value)} class="lg:col-span-full" />
