<script lang="ts">
	import type { Selected } from 'bits-ui';

	import Store from '~icons/ic/baseline-store';
	import Theater from '~icons/ic/baseline-theater-comedy';
	import { trpc } from '$lib/client';
	import Select from '$lib/components/bits/select/Select.svelte';
	import ReviewGrid from '$lib/components/ReviewGrid.svelte';
	import type { Range } from '$lib/server/schema';
	import type { ReviewSentiment } from '$lib/server/schema';

	export let range: Range;

	let sentiments: Selected<ReviewSentiment>[] = [];
	let stores: Selected<string>[] = [];
</script>

<div class="prose prose-invert theme-item lg:col-span-full p-8 max-w-full flex flex-row flex-wrap gap-16">
	<h1 class="m-0">Reviews</h1>

	<div class="grid lg:grid-cols-2 gap-2 flex-grow">
		<Select
			class="ml-auto flex-grow w-full"
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

		{#await trpc.stores.query({ range })}
			<Select
				placeholder="Loading stores..."
				icon={Theater}
				multiple
				bind:selected={stores}
				options={[]}
			/>
		{:then options}
			<Select
				placeholder="Filter by store"
				icon={Store}
				multiple
				bind:selected={stores}
				options={options.map(({ store }) => ({
					label: store,
					value: store,
				}))}
			/>
		{/await}
	</div>
</div>

<ReviewGrid
	{range}
	sentiments={sentiments.map(s => s.value)}
	stores={stores.map(s => s.value)}
	class="lg:col-span-full"
/>
