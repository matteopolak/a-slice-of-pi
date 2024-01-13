import type { PizzaSize } from './server/schema';

export const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'June',
	'July',
	'Aug',
	'Sept',
	'Oct',
	'Nov',
	'Dec',
];

/**
 * @param n The month number, 1-indexed
 * @returns A pretty-printed month name
 */
export function month(n: number) {
	return MONTHS[n - 1];
}

export const COLOURS = [
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
];

export const COLOURS_OPAQUE = COLOURS.map((c) => c + '80');

export const PIZZA_SIZE_PRETTY: Record<PizzaSize | string, string> = {
	S: 'Small',
	M: 'Medium',
	L: 'Large',
};
