<script lang="ts">
	import 'chartjs-adapter-date-fns';

	import type {
		ChartConfiguration,
		ChartConfigurationCustomTypesPerDataset,
	} from 'chart.js';
	import Chart from 'chart.js/auto';
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
		chart.data.datasets = options.data.datasets;
		chart.update();
	}
</script>

<svelte:window on:resize={() => chart.resize()} />

<canvas bind:this={canvas} class="!w-full" />
