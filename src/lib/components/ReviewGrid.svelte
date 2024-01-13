<script lang="ts">
	import Time from 'svelte-time';

	import { trpc } from '$lib/client';
	import type { ReviewSentiment } from '$lib/server/schema';

	import InfiniteScroll from './InfiniteScroll.svelte';

	let className = '';

	export { className as class };

	function sentimentToBg(sentiment: ReviewSentiment) {
		switch (sentiment) {
		case 'delighted':
			return 'bg-green-500';
		case 'happy':
			return 'bg-green-300';
		case 'sad':
			return 'bg-yellow-500';
		case 'angry':
			return 'bg-red-500';
		}
	}
</script>

<div class="reviews gap-4 {className}">
	<InfiniteScroll
		data={[]}
		load={i => trpc.reviews.query({ page: i })}
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
