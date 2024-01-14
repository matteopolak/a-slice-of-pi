<script lang="ts">
	import Time from 'svelte-time';

	import { trpc } from '$lib/client';
	import type { Range,ReviewSentiment } from '$lib/server/schema';
	import { sentimentToBg } from '$lib/utils';

	import InfiniteScroll from './InfiniteScroll.svelte';

	let className = '';

	export let sentiments: ReviewSentiment[];
	export let range: Range;
	export { className as class };
</script>

<div class="reviews gap-2 {className}">
	<InfiniteScroll
		data={[]}
		load={i => trpc.reviews.query({
			page: i,
			sentiments,
			start: range.start,
			end: range.end,
		})}
		itemThreshold={15}
		let:item
	>
		<div class="theme-item w-full p-8 prose prose-invert flex flex-col">
			<div class="flex flex-row gap-4 flex-wrap place-items-center">
				<h2 class="m-0">{item.store}</h2>
				<div class="sq-5 rounded-full ml-auto {sentimentToBg(item.sentiment)}" />
			</div>

			<p>{item.message}</p>

			<Time relative timestamp={item.createdAt} class="mt-auto ml-auto text-sm" />
		</div>

		<svelte:fragment slot="loading">
			loading...
		</svelte:fragment>
	</InfiniteScroll>
</div>

<style>
	.reviews {
		@apply grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	}
</style>
