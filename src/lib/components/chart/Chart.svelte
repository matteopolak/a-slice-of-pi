<script lang="ts" generics="T">
	import { COLOURS, COLOURS_OPAQUE } from '$lib/constants';

	import type {
		ChartConfiguration,
		ChartConfigurationCustomTypesPerDataset,
	} from 'chart.js';
	import { enUS } from 'date-fns/locale';

	import Chart from './RawChart.svelte';

	export let data: Promise<T[] | Record<string, T[]>>;

	export let type: 'line' | 'bar' | 'pie' | 'radar';
	export let dataset: string;
	export let hideLegend = false;
	export let timeSeries = false;
	export let animate = false;
	export let stacked = false;
	export let yLabel: string | undefined = undefined;

	export let unit: 'month' | 'day' | 'hour' | 'minute' | 'second' = 'month';
	export let labels: string[] = [];

	export let label: (d: T) => string;
	export let value: (d: T) => number;

	let options: ChartConfiguration | ChartConfigurationCustomTypesPerDataset = {
		type,
		data: {
			labels,
			datasets: [],
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
					type: type === 'radar' ? 'radialLinear' : 'linear',
					stacked,
					display: type !== 'pie',
					title: {
						display: !!yLabel,
						text: yLabel,
						color: 'white',
						font: {
							size: 16,
							family: 'Roboto',
						},
					},
				},
				x: {
					ticks: {
						color: 'white',
					},
					type: timeSeries ? 'timeseries' : 'category',
					time: {
						unit,
					},
					adapters: {
						date: {
							locale: enUS,
						},
					},
					display: type !== 'pie' && type !== 'radar',
				},
			},
			datasets: {
				line: {
					fill: true,
					animations: animate
						? {
								tension: {
									duration: 3000,
									easing: 'easeInOutQuad',
									from: 0.3,
									to: 0.5,
									loop: true,
								},
						  }
						: undefined,
				},
			},
		},
	};

	function updateOptions(data: T[] | Record<string, T[]>) {
		if (Array.isArray(data)) {
			options.data.labels = data.map(label);
			options.data.datasets = [
				{
					data: data.map(value),
					backgroundColor: type === 'line' ? COLOURS[0] : COLOURS,
					borderRadius: type === 'line' ? 20 : 10,
					pointRadius: 5,
				},
			];
		} else if (type === 'line' || type === 'radar') {
			// @ts-expect-error - the bubble chart is not in use here
			options.data.datasets = Object.entries(data).map(([k, v], i) => ({
				label: k,
				data: v.map(d => ({
					x: labels.length ? labels.indexOf(label(d)) : label(d),
					[type === 'radar' ? 'r' : 'y']: value(d),
				})),
				parsing: labels.length === 0,
				backgroundColor: stacked ? COLOURS[i] : COLOURS_OPAQUE[i],
			}));
		}

		options = options;
	}

	$: data.then(updateOptions);
</script>

<Chart {options} />
