<script lang="ts">
	import type {
		ChartConfiguration,
		ChartConfigurationCustomTypesPerDataset,
	} from 'chart.js';
	import { enUS } from 'date-fns/locale';

	import Chart from './RawChart.svelte';

	type T = $$Generic;

	export let data: Promise<T[]>;
	export let type: 'line' | 'bar' | 'pie';
	export let dataset: string;
	export let hideLegend = false;
	export let timeSeries = false;

	export let label: (d: T) => string;
	export let value: (d: T) => number;

	let options: ChartConfiguration | ChartConfigurationCustomTypesPerDataset = {
		type,
		data: {
			labels: [],
			datasets: [
				{
					data: [],
					backgroundColor: [
						'#FF6B6B',
						'#FFAD60',
						'#FFF1B8',
						'#98C9A3',
						'#C8A79C',
						'#E6D5B8',
						'#FFC4C4',
						'#89CFF0',
						'#C3B1E1',
						'#98DDCA',
					],
					borderRadius: type === 'line' ? 20 : 10,
				},
			],
		},
		options: {
			responsive: true,
			borderColor: 'rgba(0, 0, 0, 0.5)',
			plugins: {
				legend: {
					labels: {
						color: 'white',
						font: {
							family: 'Roboto',
						},
						boxHeight: 15,
						boxWidth: 15,
						usePointStyle: true,
						pointStyle: 'circle',
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
			scales: {
				y: {
					ticks: {
						color: 'white',
					},
					display: type !== 'pie',
				},
				x: {
					ticks: {
						color: 'white',
					},
					type: timeSeries ? 'timeseries' : 'category',
					time: {
						unit: 'month',
					},
					display: type !== 'pie',
				},
			},
			datasets: {
				line: {
					fill: true,
					tension: 0.4,
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
