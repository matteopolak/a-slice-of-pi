<script lang="ts">
	import 'chartjs-adapter-date-fns';

	import type {
		ChartConfiguration,
		ChartConfigurationCustomTypesPerDataset,
	} from 'chart.js';
	import {
		ArcElement,
		BarController,
		BarElement,
		CategoryScale,
		Chart,
		Filler,
		Legend,
		LinearScale,
		LineController,
		LineElement,
		PieController,
		PointElement,
		RadarController,
		RadialLinearScale,
		TimeSeriesScale,
		Tooltip,
	} from 'chart.js';
	import { onMount } from 'svelte';

	export let options:
		| ChartConfiguration
		| ChartConfigurationCustomTypesPerDataset;

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		Chart.register(
			LineController,
			BarController,
			PieController,
			RadarController,
			LinearScale,
			TimeSeriesScale,
			CategoryScale,
			RadialLinearScale,
			ArcElement,
			BarElement,
			PointElement,
			LineElement,
			Filler,
			Tooltip,
			Legend,
		);

		chart = new Chart(canvas, options);
	});

	$: if (chart) {
		chart.data = options.data;
		chart.update();
	}
</script>

<svelte:window on:resize={() => chart.resize()} />

<canvas bind:this={canvas} class="!w-full" />
