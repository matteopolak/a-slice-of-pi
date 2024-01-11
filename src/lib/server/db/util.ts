import { sql, type SQLWrapper } from 'drizzle-orm';

export function extractMonth(expression: SQLWrapper) {
	return sql<number>`EXTRACT(MONTH FROM ${expression})`.mapWith(parseInt);
}
