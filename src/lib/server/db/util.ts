import { sql, type SQLWrapper } from 'drizzle-orm';

export function extractYearMonth(expression: SQLWrapper) {
	return sql<string>`TO_CHAR(${expression}, 'YYYY-MM')`;
}
