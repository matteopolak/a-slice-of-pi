import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

import type { ReviewSentiment } from './server/schema';

type FlyAndScaleParams = {
	y?: number;
	start?: number;
	duration?: number;
};

const defaultFlyAndScaleParams = { y: -8, start: 0.95, duration: 200 };

export function flyAndScale(node: Element, params?: FlyAndScaleParams): TransitionConfig {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	const withDefaults = { ...defaultFlyAndScaleParams, ...params };

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: withDefaults.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [withDefaults.y, 0]);
			const scale = scaleConversion(t, [0, 1], [withDefaults.start, 1]);

			return styleToString({
				transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
}

export function sentimentToBg(sentiment: ReviewSentiment) {
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
