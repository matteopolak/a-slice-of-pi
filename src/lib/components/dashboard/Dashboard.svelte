<script lang="ts">
	import type { Range } from '$lib/server/schema';

	import OrdersByStore from './components/OrdersByStore.svelte';
	import OrdersByStorePizza from './components/OrdersByStorePizza.svelte';
	import Revenue from './components/Revenue.svelte';
	import RevenueByMonth from './components/RevenueByMonth.svelte';
	import RevenueByStoreMonth from './components/RevenueByStoreMonth.svelte';
	import Reviews from './components/Reviews.svelte';
	import ReviewsBySentiment from './components/ReviewsBySentiment.svelte'; 
	
	export let range: Range;
</script>

<div class="grid lg:grid-cols-5 gap-4">
	<Revenue />
	<ReviewsBySentiment {range} />
	<OrdersByStore {range} />
	<RevenueByMonth {range} />
	<OrdersByStorePizza {range} />
	<RevenueByStoreMonth {range} />
	<Reviews {range} />
</div>
