<script lang="ts">
	import type {
		ChartConfiguration,
		ChartConfigurationCustomTypesPerDataset,
	} from 'chart.js';
	import Chart from './RawChart.svelte';

	type T = $$Generic;

	export let data: Promise<T[]>;
	export let type: 'line' | 'bar' | 'pie';
	export let dataset: string;

	export let label: (d: T) => string;
	export let value: (d: T) => number;

	let options: ChartConfiguration | ChartConfigurationCustomTypesPerDataset = {
		type,
		data: {
			labels: [],
			datasets: [
				{
					label: dataset,
					data: [],
				},
			],
		},
		options: {
			responsive: true,
		},
	};

	$: {
		data.then(updateOptions);
	}

	function updateOptions(data: T[]) {
		options.data.labels = data.map(label);
		options.data.datasets[0].data = data.map(value);
		options = options;
	}
</script>

<Chart {options} />
