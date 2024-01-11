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
