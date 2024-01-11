<script lang="ts">
	import Chart from 'chart.js/auto';
	import type {
		ChartConfiguration,
		ChartConfigurationCustomTypesPerDataset,
	} from 'chart.js';
	import { onMount } from 'svelte';

	export let options:
		| ChartConfiguration
		| ChartConfigurationCustomTypesPerDataset;

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		chart = new Chart(canvas, options);
	});

	$: if (chart) {
		chart.data.labels = options.data.labels;
		chart.data.datasets[0].data = options.data.datasets[0].data;
		chart.update();
	}
</script>

<canvas bind:this={canvas} />
