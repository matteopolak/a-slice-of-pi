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
	export let hideLegend: boolean = false;

	export let label: (d: T) => string;
	export let value: (d: T) => number;

	let options: ChartConfiguration | ChartConfigurationCustomTypesPerDataset = {
		type,
		data: {
			labels: [],
			datasets: [
				{
					data: [],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				colors: {
					forceOverride: true,
				},
				legend: {
					labels: {
						color: 'white',
						font: {
							family: 'Roboto',
						},
					},
					display: !hideLegend,
				},
				title: {
					display: true,
					text: dataset,
					color: 'white',
					font: {
						size: 20,
						family: 'Roboto',
					},
					padding: {
						bottom: 20,
					},
				},
			},
			scales:
				type !== 'pie'
					? {
							y: {
								ticks: {
									color: 'white',
								},
							},
							x: {
								ticks: {
									color: 'white',
								},
							},
					  }
					: undefined,
			datasets: {
				pie: {
					borderColor: 'none',
				},
			},
		},
	};

	function updateOptions(data: T[]) {
		options.data.labels = data.map(label);
		options.data.datasets[0].data = data.map(value);
		options = options;
	}

	$: data.then(updateOptions);
</script>

<Chart {options} />
