import { sql, type SQLWrapper } from 'drizzle-orm';

export function extractYearMonth(expression: SQLWrapper) {
	return sql<string>`TO_CHAR(${expression}, 'YYYY-MM')`;
}

export function averageYearMonth(expression: SQLWrapper) {
	return sql<string>`TO_TIMESTAMP(AVG(EXTRACT(EPOCH FROM ${expression})))`
		.mapWith(v => {
			const date = new Date(v);

			date.setUTCDate(15);
			date.setUTCHours(0, 0, 0, 0);

			return date.toISOString();
		});
} 